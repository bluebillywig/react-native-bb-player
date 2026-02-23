#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import <BBPlayerModuleSpec/BBPlayerModuleSpec.h>
#endif

@interface RCT_EXTERN_MODULE(BBPlayerModule, RCTEventEmitter)

// Playback control
RCT_EXTERN_METHOD(play:(nonnull NSNumber *)viewTag)
RCT_EXTERN_METHOD(pause:(nonnull NSNumber *)viewTag)
RCT_EXTERN_METHOD(seek:(nonnull NSNumber *)viewTag position:(nonnull NSNumber *)position)
RCT_EXTERN_METHOD(seekRelative:(nonnull NSNumber *)viewTag offsetSeconds:(nonnull NSNumber *)offsetSeconds)
RCT_EXTERN_METHOD(setMuted:(nonnull NSNumber *)viewTag muted:(BOOL)muted)
RCT_EXTERN_METHOD(setVolume:(nonnull NSNumber *)viewTag volume:(nonnull NSNumber *)volume)

// Fullscreen control
RCT_EXTERN_METHOD(enterFullscreen:(nonnull NSNumber *)viewTag)
RCT_EXTERN_METHOD(enterFullscreenLandscape:(nonnull NSNumber *)viewTag)
RCT_EXTERN_METHOD(exitFullscreen:(nonnull NSNumber *)viewTag)

// Layout control
RCT_EXTERN_METHOD(collapse:(nonnull NSNumber *)viewTag)
RCT_EXTERN_METHOD(expand:(nonnull NSNumber *)viewTag)

// Other commands
RCT_EXTERN_METHOD(autoPlayNextCancel:(nonnull NSNumber *)viewTag)
RCT_EXTERN_METHOD(destroy:(nonnull NSNumber *)viewTag)
RCT_EXTERN_METHOD(showCastPicker:(nonnull NSNumber *)viewTag)

// Load methods
RCT_EXTERN_METHOD(loadWithClipId:(nonnull NSNumber *)viewTag clipId:(NSString *)clipId initiator:(NSString *)initiator autoPlay:(BOOL)autoPlay seekTo:(NSNumber *)seekTo contextJson:(NSString *)contextJson)
RCT_EXTERN_METHOD(loadWithClipListId:(nonnull NSNumber *)viewTag clipListId:(NSString *)clipListId initiator:(NSString *)initiator autoPlay:(BOOL)autoPlay seekTo:(NSNumber *)seekTo contextJson:(NSString *)contextJson)
RCT_EXTERN_METHOD(loadWithProjectId:(nonnull NSNumber *)viewTag projectId:(NSString *)projectId initiator:(NSString *)initiator autoPlay:(BOOL)autoPlay seekTo:(NSNumber *)seekTo contextJson:(NSString *)contextJson)
RCT_EXTERN_METHOD(loadWithClipJson:(nonnull NSNumber *)viewTag clipJson:(NSString *)clipJson initiator:(NSString *)initiator autoPlay:(BOOL)autoPlay seekTo:(NSNumber *)seekTo contextJson:(NSString *)contextJson)
RCT_EXTERN_METHOD(loadWithClipListJson:(nonnull NSNumber *)viewTag clipListJson:(NSString *)clipListJson initiator:(NSString *)initiator autoPlay:(BOOL)autoPlay seekTo:(NSNumber *)seekTo contextJson:(NSString *)contextJson)
RCT_EXTERN_METHOD(loadWithProjectJson:(nonnull NSNumber *)viewTag projectJson:(NSString *)projectJson initiator:(NSString *)initiator autoPlay:(BOOL)autoPlay seekTo:(NSNumber *)seekTo contextJson:(NSString *)contextJson)
RCT_EXTERN_METHOD(loadWithJsonUrl:(nonnull NSNumber *)viewTag jsonUrl:(NSString *)jsonUrl autoPlay:(BOOL)autoPlay contextJson:(NSString *)contextJson)

// Getter methods with Promise
RCT_EXTERN_METHOD(getDuration:(nonnull NSNumber *)viewTag resolver:(RCTPromiseResolveBlock)resolver rejecter:(RCTPromiseRejectBlock)rejecter)
RCT_EXTERN_METHOD(getCurrentTime:(nonnull NSNumber *)viewTag resolver:(RCTPromiseResolveBlock)resolver rejecter:(RCTPromiseRejectBlock)rejecter)
RCT_EXTERN_METHOD(getMuted:(nonnull NSNumber *)viewTag resolver:(RCTPromiseResolveBlock)resolver rejecter:(RCTPromiseRejectBlock)rejecter)
RCT_EXTERN_METHOD(getVolume:(nonnull NSNumber *)viewTag resolver:(RCTPromiseResolveBlock)resolver rejecter:(RCTPromiseRejectBlock)rejecter)
RCT_EXTERN_METHOD(getPhase:(nonnull NSNumber *)viewTag resolver:(RCTPromiseResolveBlock)resolver rejecter:(RCTPromiseRejectBlock)rejecter)
RCT_EXTERN_METHOD(getState:(nonnull NSNumber *)viewTag resolver:(RCTPromiseResolveBlock)resolver rejecter:(RCTPromiseRejectBlock)rejecter)
RCT_EXTERN_METHOD(getMode:(nonnull NSNumber *)viewTag resolver:(RCTPromiseResolveBlock)resolver rejecter:(RCTPromiseRejectBlock)rejecter)
RCT_EXTERN_METHOD(getClipData:(nonnull NSNumber *)viewTag resolver:(RCTPromiseResolveBlock)resolver rejecter:(RCTPromiseRejectBlock)rejecter)
RCT_EXTERN_METHOD(getProjectData:(nonnull NSNumber *)viewTag resolver:(RCTPromiseResolveBlock)resolver rejecter:(RCTPromiseRejectBlock)rejecter)
RCT_EXTERN_METHOD(getPlayoutData:(nonnull NSNumber *)viewTag resolver:(RCTPromiseResolveBlock)resolver rejecter:(RCTPromiseRejectBlock)rejecter)

// Modal player (module-level)
RCT_EXTERN_METHOD(presentModalPlayer:(NSString *)jsonUrl optionsJson:(NSString *)optionsJson)
RCT_EXTERN_METHOD(dismissModalPlayer)

// Event emitter support
RCT_EXTERN_METHOD(addListener:(NSString *)eventName)
RCT_EXTERN_METHOD(removeListeners:(double)count)

#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
    return std::make_shared<facebook::react::NativeBBPlayerModuleSpecJSI>(params);
}
#endif

@end
