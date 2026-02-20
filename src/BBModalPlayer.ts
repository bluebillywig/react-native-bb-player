import { NativeEventEmitter, NativeModules } from 'react-native';

const BBPlayerModule = NativeModules.BBPlayerModule;
const eventEmitter = new NativeEventEmitter(BBPlayerModule);

export interface ModalPlayerOptions {
  autoPlay?: boolean;
  jwt?: string;
  playerBackgroundColor?: string;
  fitmode?: string;
  [key: string]: unknown;
}

export const BBModalPlayer = {
  present(jsonUrl: string, options?: ModalPlayerOptions) {
    BBPlayerModule?.presentModalPlayer(
      jsonUrl,
      options ? JSON.stringify(options) : null,
    );
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
