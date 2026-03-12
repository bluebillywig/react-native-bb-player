package com.bluebillywig.bbplayer

import android.util.Log
import android.view.View
import android.widget.FrameLayout
import androidx.fragment.app.FragmentActivity
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext

class BBCastMiniControlsViewManager : SimpleViewManager<FrameLayout>() {

    override fun getName(): String = "BBCastMiniControlsView"

    override fun createViewInstance(reactContext: ThemedReactContext): FrameLayout {
        val container = FrameLayout(reactContext)
        container.id = View.generateViewId()

        container.addOnAttachStateChangeListener(object : View.OnAttachStateChangeListener {
            private var attempted = false

            override fun onViewAttachedToWindow(v: View) {
                if (attempted) return
                attempted = true
                attachMiniController(reactContext, container)
            }

            override fun onViewDetachedFromWindow(v: View) {}
        })

        return container
    }

    private fun attachMiniController(reactContext: ThemedReactContext, container: FrameLayout) {
        try {
            val activity = reactContext.currentActivity as? FragmentActivity ?: return

            // MiniControllerFragment.onCreateView reads button actions from
            // CastContext → CastMediaOptions → NotificationOptions → actions array.
            // When CastContext is not properly initialized, this array is null,
            // causing an NPE inside onCreateView that we cannot catch.
            // Verify this chain is non-null before creating the fragment.
            val castContextClass = Class.forName("com.google.android.gms.cast.framework.CastContext")
            val castContext = castContextClass.getMethod("getSharedInstance", android.content.Context::class.java)
                .invoke(null, reactContext)

            val mediaOptions = castContextClass.getMethod("getCastMediaOptions").invoke(castContext)
            if (mediaOptions == null) {
                Log.w("BBCastMiniControls", "No CastMediaOptions, skipping mini controls")
                return
            }

            val mediaOptionsClass = Class.forName("com.google.android.gms.cast.framework.media.CastMediaOptions")
            val notificationOptions = mediaOptionsClass.getMethod("getNotificationOptions").invoke(mediaOptions)
            if (notificationOptions == null) {
                Log.w("BBCastMiniControls", "No NotificationOptions, skipping mini controls")
                return
            }

            val notifOptionsClass = Class.forName("com.google.android.gms.cast.framework.media.NotificationOptions")
            val actions = notifOptionsClass.getMethod("getActions").invoke(notificationOptions)
            if (actions == null) {
                Log.w("BBCastMiniControls", "No notification actions, skipping mini controls")
                return
            }

            val fragmentClass = Class.forName(
                "com.google.android.gms.cast.framework.media.widget.MiniControllerFragment"
            )
            val fragment = fragmentClass.getDeclaredConstructor().newInstance() as androidx.fragment.app.Fragment

            activity.supportFragmentManager
                .beginTransaction()
                .replace(container.id, fragment, "bb_cast_mini_controls_${container.id}")
                .commitAllowingStateLoss()
        } catch (e: Exception) {
            Log.w("BBCastMiniControls", "Cast mini controls unavailable: ${e.message}")
        }
    }
}
