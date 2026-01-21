#import <React/RCTViewManager.h>
#import <React/RCTBridge.h>
#import <React/RCTUIManager.h>

@interface RCT_EXTERN_MODULE(BBShortsViewManager, RCTViewManager)

// Props
RCT_EXPORT_VIEW_PROPERTY(jsonUrl, NSString)
RCT_EXPORT_VIEW_PROPERTY(options, NSDictionary)

// Event handlers
RCT_EXPORT_VIEW_PROPERTY(onDidSetupWithJsonUrl, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onDidFailWithError, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onDidTriggerResize, RCTDirectEventBlock)

// Commands (methods callable from JS)
RCT_EXTERN_METHOD(destroy:(nonnull NSNumber *)reactTag)

@end
