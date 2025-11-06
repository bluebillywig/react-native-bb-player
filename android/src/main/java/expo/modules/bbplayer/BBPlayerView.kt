package expo.modules.bbplayer

import android.app.Activity
import android.content.Context
import android.os.Handler
import android.os.Looper
import android.util.Log
import android.widget.FrameLayout
import com.bluebillywig.bbnativeplayersdk.BBNativePlayer
import com.bluebillywig.bbnativeplayersdk.BBNativePlayerView
import com.bluebillywig.bbnativeplayersdk.BBNativePlayerViewDelegate
import com.bluebillywig.bbnativeshared.enums.Phase
import com.bluebillywig.bbnativeshared.enums.State
import com.bluebillywig.bbnativeshared.model.MediaClip
import com.bluebillywig.bbnativeshared.model.Project
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.viewevent.EventDispatcher
import expo.modules.kotlin.views.ExpoView

/**
 * Expo-based View for Blue Billywig Native Player
 *
 * Uses ExpoView with shouldUseAndroidLayout = true to ensure native Android layout
 * is used instead of React Native's Yoga layout system. This is critical for
 * native player controls to work properly.
 */
class BBPlayerView(context: Context, appContext: AppContext) : ExpoView(context, appContext),
    BBNativePlayerViewDelegate {

    // CRITICAL: Use Android's native layout system instead of React Native's Yoga layout
    // This allows the native player controls to render and respond to touch events properly
    override val shouldUseAndroidLayout = true

    private val currentActivity: Activity
        get() = appContext.currentActivity ?: throw IllegalStateException("No current activity")

    private var jsonUrl: String = ""
    private var options = HashMap<String, Any?>()
    private var playerSetup: Boolean = false

    private lateinit var playerView: BBNativePlayerView

    init {
        // Default to black background (playout data may override with bgColor)
        setBackgroundColor(android.graphics.Color.BLACK)
    }

    // Timer for periodic time updates (4x per second)
    private val timeUpdateHandler = Handler(Looper.getMainLooper())
    private var timeUpdateRunnable: Runnable? = null
    private var isPlaying = false
    private var currentDuration: Double = 0.0
    private var lastKnownTime: Double = 0.0
    private var playbackStartTimestamp: Long = 0

    // Event dispatchers for React Native events
    private val onPlayerSetup by EventDispatcher<Map<String, String?>>()
    private val onMediaClipLoaded by EventDispatcher<Map<String, String?>>()
    private val onProjectLoaded by EventDispatcher<Map<String, String?>>()
    private val onPhaseChange by EventDispatcher<Map<String, String?>>()
    private val onStateChange by EventDispatcher<Map<String, String?>>()
    private val onError by EventDispatcher<Map<String, String?>>()
    private val onMediaClipFailed by EventDispatcher<Unit>()
    private val onRequestOpenUrl by EventDispatcher<Map<String, String?>>()

    // Additional critical event dispatchers for bidirectional communication
    private val onPlay by EventDispatcher<Unit>()
    private val onPlaying by EventDispatcher<Unit>()
    private val onPause by EventDispatcher<Unit>()
    private val onEnded by EventDispatcher<Unit>()
    private val onSeeking by EventDispatcher<Unit>()
    private val onSeeked by EventDispatcher<Map<String, Double?>>()
    private val onTimeUpdate by EventDispatcher<Map<String, Double>>()
    private val onDurationChange by EventDispatcher<Map<String, Double>>()
    private val onVolumeChange by EventDispatcher<Map<String, Any?>>()
    private val onCanPlay by EventDispatcher<Unit>()
    private val onStall by EventDispatcher<Unit>()

    fun setJsonUrl(url: String) {
        Log.d("BBPlayerView", "setJsonUrl: $url")
        this.jsonUrl = url
    }

    fun setAutoPlay(autoPlay: Boolean) {
        Log.d("BBPlayerView", "setAutoPlay: $autoPlay")
        this.options["autoPlay"] = autoPlay
    }

    fun setupPlayer() {
        Log.d("BBPlayerView", "setupPlayer called - jsonUrl: $jsonUrl, options: $options")

        if (playerSetup) {
            Log.d("BBPlayerView", "Player already setup, removing old player")
            removePlayer()
        }

        if (jsonUrl.isEmpty()) {
            Log.w("BBPlayerView", "Cannot setup player - jsonUrl is empty")
            return
        }

        Log.d("BBPlayerView", "Creating BBNativePlayerView with factory method")
        playerView = BBNativePlayer.createPlayerView(currentActivity, jsonUrl, options)
        playerView.delegate = this@BBPlayerView

        // Add player with WRAP_CONTENT height for proper aspect ratio
        addView(playerView, LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.WRAP_CONTENT))

        playerSetup = true
        Log.d("BBPlayerView", "Player setup complete")
    }

    private fun removePlayer() {
        Log.d("BBPlayerView", "removePlayer called")
        playerSetup = false
        isPlaying = false
        stopTimeUpdates()
        removeAllViews()

        if (::playerView.isInitialized) {
            playerView.player?.pause()
            playerView.destroy()
        }
    }

    // Public methods for playback control
    fun play() {
        if (::playerView.isInitialized) {
            playerView.player?.play()
        }
    }

    fun pause() {
        if (::playerView.isInitialized) {
            playerView.player?.pause()
        }
    }

    fun seek(offsetInSeconds: Double) {
        if (::playerView.isInitialized) {
            playerView.player?.seek(offsetInSeconds)
        }
    }

    // Start periodic time updates (4x per second = 250ms interval)
    private fun startTimeUpdates() {
        if (timeUpdateRunnable != null) {
            return // Already running
        }

        timeUpdateRunnable = object : Runnable {
            override fun run() {
                if (::playerView.isInitialized && isPlaying) {
                    // Calculate current time based on elapsed time since playback started
                    val elapsedSeconds = (System.currentTimeMillis() - playbackStartTimestamp) / 1000.0
                    val estimatedTime = lastKnownTime + elapsedSeconds
                    val currentTime = kotlin.math.min(estimatedTime, currentDuration)

                    // Only emit if we have valid time values
                    if (currentDuration > 0) {
                        onTimeUpdate(mapOf(
                            "currentTime" to currentTime,
                            "duration" to currentDuration
                        ))
                    }

                    // Schedule next update
                    timeUpdateHandler.postDelayed(this, 250)
                }
            }
        }

        // Start the timer
        timeUpdateHandler.postDelayed(timeUpdateRunnable!!, 250)
    }

    // Stop periodic time updates
    private fun stopTimeUpdates() {
        timeUpdateRunnable?.let {
            timeUpdateHandler.removeCallbacks(it)
            timeUpdateRunnable = null
        }
    }

    // BBNativePlayerViewDelegate implementations
    override fun didSetupWithJsonUrl(view: BBNativePlayerView, url: String?) {
        Log.d("BBPlayerView", "didSetupWithJsonUrl: $url")

        // Debug: Check if controls are enabled
        val playoutData = view.getApiProperty(com.bluebillywig.bbnativeshared.enums.ApiProperty.playoutData)
        Log.d("BBPlayerView", "Playout data: $playoutData")

        onPlayerSetup(mapOf("url" to url))
    }

    override fun didTriggerMediaClipLoaded(view: BBNativePlayerView, clipData: MediaClip?) {
        Log.d("BBPlayerView", "didTriggerMediaClipLoaded: ${clipData?.title}")
        onMediaClipLoaded(mapOf(
            "title" to clipData?.title,
            "id" to clipData?.id
        ))
    }

    override fun didTriggerProjectLoaded(view: BBNativePlayerView, projectData: Project?) {
        Log.d("BBPlayerView", "didTriggerProjectLoaded: ${projectData?.id}")
        onProjectLoaded(mapOf("id" to projectData?.id))
    }

    override fun didTriggerPhaseChange(view: BBNativePlayerView, phase: Phase?) {
        Log.d("BBPlayerView", "didTriggerPhaseChange: ${phase?.name}")
        onPhaseChange(mapOf("phase" to phase?.name))
    }

    override fun didTriggerStateChange(view: BBNativePlayerView, state: State?) {
        Log.d("BBPlayerView", "didTriggerStateChange: ${state?.name}")
        onStateChange(mapOf("state" to state?.name))
    }

    override fun didFailWithError(view: BBNativePlayerView, error: String?) {
        Log.e("BBPlayerView", "didFailWithError: $error")

        // Map common error types to user-friendly messages
        val errorMessage = when {
            error?.contains("Domain", ignoreCase = true) == true ->
                "Content is not available in this location or domain"
            error?.contains("Geo", ignoreCase = true) == true ->
                "Content is not available in your region"
            error != null && error.isNotBlank() -> error
            else -> "Unknown error occurred"
        }

        onError(mapOf("error" to errorMessage))
    }

    override fun didTriggerMediaClipFailed(view: BBNativePlayerView) {
        Log.e("BBPlayerView", "didTriggerMediaClipFailed")
        onMediaClipFailed(Unit)
    }

    override fun didRequestOpenUrl(view: BBNativePlayerView, url: String?) {
        Log.d("BBPlayerView", "didRequestOpenUrl: $url")
        onRequestOpenUrl(mapOf("url" to url))
    }

    override fun didTriggerCanPlay(view: BBNativePlayerView) {
        Log.d("BBPlayerView", "didTriggerCanPlay - autoPlay: ${options["autoPlay"]}")

        // Emit event
        onCanPlay(Unit)

        // If autoPlay was requested, start playback when player is ready
        val autoPlay = options["autoPlay"] as? Boolean ?: false
        if (autoPlay) {
            Log.d("BBPlayerView", "Calling play() for autoplay")
            view.player?.play()
        } else {
            Log.d("BBPlayerView", "AutoPlay is false, not calling play()")
        }
    }

    // Additional critical delegate implementations for bidirectional communication
    override fun didTriggerPlay(view: BBNativePlayerView) {
        Log.d("BBPlayerView", "didTriggerPlay")
        onPlay(Unit)
    }

    override fun didTriggerPlaying(view: BBNativePlayerView) {
        Log.d("BBPlayerView", "didTriggerPlaying - starting periodic time updates")
        isPlaying = true
        playbackStartTimestamp = System.currentTimeMillis()
        startTimeUpdates()
        onPlaying(Unit)
    }

    override fun didTriggerPause(view: BBNativePlayerView) {
        Log.d("BBPlayerView", "didTriggerPause - stopping periodic time updates")
        isPlaying = false
        stopTimeUpdates()
        onPause(Unit)
    }

    override fun didTriggerEnded(view: BBNativePlayerView) {
        Log.d("BBPlayerView", "didTriggerEnded - stopping periodic time updates")
        isPlaying = false
        stopTimeUpdates()
        onEnded(Unit)
    }

    override fun didTriggerSeeking(view: BBNativePlayerView) {
        Log.d("BBPlayerView", "didTriggerSeeking")
        onSeeking(Unit)
    }

    override fun didTriggerSeeked(view: BBNativePlayerView, seekOffset: Double?) {
        Log.d("BBPlayerView", "didTriggerSeeked: $seekOffset")
        // Update lastKnownTime based on seek and reset playback timestamp
        lastKnownTime = seekOffset ?: 0.0
        playbackStartTimestamp = System.currentTimeMillis()

        onSeeked(mapOf(
            "seekOffset" to seekOffset,
            "currentTime" to lastKnownTime
        ))

        // Also fire time update after seek
        onTimeUpdate(mapOf(
            "currentTime" to lastKnownTime,
            "duration" to currentDuration
        ))
    }

    override fun didTriggerDurationChange(view: BBNativePlayerView, duration: Double?) {
        Log.d("BBPlayerView", "didTriggerDurationChange: $duration")
        currentDuration = duration ?: 0.0
        onDurationChange(mapOf("duration" to currentDuration))
    }

    override fun didTriggerVolumeChange(view: BBNativePlayerView, volume: Double?) {
        Log.d("BBPlayerView", "didTriggerVolumeChange: $volume")
        // Infer muted state from volume (volume == 0 means muted)
        val muted = (volume ?: 0.0) == 0.0
        onVolumeChange(mapOf(
            "volume" to volume,
            "muted" to muted
        ))
    }

    override fun didTriggerStall(view: BBNativePlayerView) {
        Log.d("BBPlayerView", "didTriggerStall")
        onStall(Unit)
    }

    override fun onDetachedFromWindow() {
        Log.d("BBPlayerView", "onDetachedFromWindow - cleaning up player")
        removePlayer()
        super.onDetachedFromWindow()
    }
}
