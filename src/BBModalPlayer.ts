import { NativeEventEmitter, NativeModules, Platform } from 'react-native';

// Resolve BBPlayerModule: TurboModuleRegistry (New Arch) with NativeModules fallback
let BBPlayerModule: any = null;
try {
  BBPlayerModule = require('./specs/NativeBBPlayerModule').default;
} catch {
  // TurboModule not available
}
if (!BBPlayerModule) {
  BBPlayerModule = NativeModules.BBPlayerModule;
}

if (!BBPlayerModule) {
  console.warn(
    '[BBModalPlayer] Native BBPlayerModule not found. ' +
    'TurboModuleRegistry and NativeModules both returned null. ' +
    `Platform: ${Platform.OS}`,
  );
}

// NativeEventEmitter requires a non-null module on iOS to avoid warnings.
// Pass null-safe: events will simply never fire if module is missing.
const eventEmitter = BBPlayerModule
  ? new NativeEventEmitter(BBPlayerModule)
  : new NativeEventEmitter();

export interface ModalPlayerOptions {
  autoPlay?: boolean;
  jwt?: string;
  playerBackgroundColor?: string;
  fitmode?: string;
  [key: string]: unknown;
}

export const BBModalPlayer = {
  /**
   * Whether the native modal player module is available.
   * When false, present() will be a no-op.
   */
  get isAvailable(): boolean {
    return BBPlayerModule != null;
  },

  present(jsonUrl: string, options?: ModalPlayerOptions, context?: Record<string, string>): boolean {
    if (!BBPlayerModule) {
      console.warn('[BBModalPlayer] present() called but native module is null — cannot open modal');
      return false;
    }
    BBPlayerModule.presentModalPlayer(
      jsonUrl,
      options ? JSON.stringify(options) : null,
      context ? JSON.stringify(context) : null,
    );
    return true;
  },

  dismiss() {
    BBPlayerModule?.dismissModalPlayer();
  },

  addEventListener(
    event: string,
    callback: (...args: any[]) => void,
  ) {
    return eventEmitter.addListener(event, callback);
  },
};
