package com.bluebillywig.bbplayer

import android.widget.FrameLayout
import androidx.mediarouter.app.MediaRouteButton
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp

class BBCastButtonViewManager : SimpleViewManager<FrameLayout>() {

    override fun getName(): String = "BBCastButtonView"

    override fun createViewInstance(reactContext: ThemedReactContext): FrameLayout {
        val container = FrameLayout(reactContext)
        val castButton = MediaRouteButton(reactContext)

        try {
            val castButtonFactoryClass = Class.forName("com.google.android.gms.cast.framework.CastButtonFactory")
            castButtonFactoryClass.getMethod("setUpMediaRouteButton", android.content.Context::class.java, MediaRouteButton::class.java)
                .invoke(null, reactContext, castButton)
        } catch (e: Exception) {
            android.util.Log.w("BBCastButton", "Cast button unavailable: ${e.message}")
        }

        container.addView(
            castButton,
            FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.MATCH_PARENT
            )
        )
        return container
    }

    @ReactProp(name = "tintColor", customType = "Color")
    fun setTintColor(view: FrameLayout, color: Int?) {
        // MediaRouteButton tint is controlled via the Cast SDK theme.
        // The tintColor prop is primarily effective on iOS (GCKUICastButton).
    }
}
