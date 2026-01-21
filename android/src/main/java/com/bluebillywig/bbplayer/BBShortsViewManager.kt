package com.bluebillywig.bbplayer

import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp

/**
 * ViewManager for BBShortsView - manages the React Native native view for Shorts playback.
 */
class BBShortsViewManager : SimpleViewManager<BBShortsView>() {

    override fun getName(): String = REACT_CLASS

    override fun createViewInstance(reactContext: ThemedReactContext): BBShortsView {
        return BBShortsView(reactContext)
    }

    // Props
    @ReactProp(name = "jsonUrl")
    fun setJsonUrl(view: BBShortsView, url: String?) {
        view.setJsonUrl(url ?: "")
    }

    @ReactProp(name = "options")
    fun setOptions(view: BBShortsView, options: ReadableMap?) {
        view.setOptions(options)
    }

    // Commands - using Kotlin's mapOf
    override fun getCommandsMap(): Map<String, Int> = mapOf(
        "destroy" to COMMAND_DESTROY
    )

    // Override for Old Architecture (numeric command IDs)
    @Deprecated("Deprecated in favor of receiveCommand with String commandId")
    override fun receiveCommand(view: BBShortsView, commandId: Int, args: ReadableArray?) {
        val commandName = when (commandId) {
            COMMAND_DESTROY -> "destroy"
            else -> return
        }
        receiveCommand(view, commandName, args)
    }

    // Override for New Architecture (string command names)
    override fun receiveCommand(view: BBShortsView, commandId: String?, args: ReadableArray?) {
        when (commandId) {
            "destroy" -> view.destroy()
        }
    }

    // Event registration - using Kotlin's mapOf
    override fun getExportedCustomDirectEventTypeConstants(): Map<String, Any> {
        val eventNames = listOf(
            "onDidSetupWithJsonUrl",
            "onDidFailWithError"
        )

        return eventNames.associateWith { eventName ->
            mapOf("registrationName" to eventName)
        }
    }

    // Called after props are set - trigger shorts setup
    override fun onAfterUpdateTransaction(view: BBShortsView) {
        super.onAfterUpdateTransaction(view)
        view.setupShorts()
    }

    companion object {
        const val REACT_CLASS = "BBShortsView"

        // Command IDs
        private const val COMMAND_DESTROY = 1
    }
}
