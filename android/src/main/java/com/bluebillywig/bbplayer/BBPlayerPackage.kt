package com.bluebillywig.bbplayer

import com.facebook.react.BaseReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider
import com.facebook.react.uimanager.ViewManager

class BBPlayerPackage : BaseReactPackage() {
    override fun getModule(name: String, reactContext: ReactApplicationContext): NativeModule? {
        return when (name) {
            BBPlayerModule.NAME -> BBPlayerModule(reactContext)
            else -> null
        }
    }

    override fun getReactModuleInfoProvider(): ReactModuleInfoProvider {
        return ReactModuleInfoProvider {
            mapOf(
                BBPlayerModule.NAME to ReactModuleInfo(
                    BBPlayerModule.NAME,
                    BBPlayerModule::class.java.name,
                    false,  // canOverrideExistingModule
                    false,  // needsEagerInit
                    true,   // hasConstants - deprecated but still needed
                    false,  // isCxxModule
                    BuildConfig.IS_NEW_ARCHITECTURE_ENABLED  // isTurboModule
                )
            )
        }
    }

    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
        return listOf(
            BBPlayerViewManager(),
            BBShortsViewManager()
        )
    }
}
