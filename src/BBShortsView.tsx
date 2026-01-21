import React, { forwardRef, useImperativeHandle, useRef } from "react";
import {
  requireNativeComponent,
  type NativeSyntheticEvent,
  type ViewProps,
  NativeModules,
  findNodeHandle,
} from "react-native";

import type { Override } from "./types";

/**
 * Options for the BBShortsView component.
 */
export type BBShortsViewOptions = {
  /** Display format: "full" (default) | "list" | "player" */
  displayFormat?: "full" | "list" | "player";
  /** Start spacing for shelf display format */
  shelfStartSpacing?: number;
  /** End spacing for shelf display format */
  shelfEndSpacing?: number;
  /** Skip shorts ad on swipe */
  skipShortsAdOnSwipe?: boolean;
  /** Any additional native options */
  [key: string]: unknown;
};

/**
 * Props for the BBShortsView component.
 */
export type BBShortsViewProps = {
  /**
   * JSON URL to load Shorts configuration from.
   * Format: https://{domain}.bbvms.com/sh/{shortsId}.json
   */
  jsonUrl: string;
  /**
   * Optional configuration options for the Shorts player.
   */
  options?: BBShortsViewOptions;
  /**
   * Called when the Shorts view is successfully set up.
   */
  onDidSetupWithJsonUrl?: (url: string) => void;
  /**
   * Called when an error occurs.
   */
  onDidFailWithError?: (error: string) => void;
  /**
   * Called when the Shorts view is resized.
   */
  onDidTriggerResize?: (width: number, height: number) => void;
} & ViewProps;

/**
 * Methods exposed via the ref for the BBShortsView component.
 */
export type BBShortsViewMethods = {
  /**
   * Destroy the Shorts view and clean up resources.
   */
  destroy: () => void;
};

// Native event types with NativeSyntheticEvent wrapper
type NativeBBShortsViewProps = Override<
  BBShortsViewProps,
  {
    onDidSetupWithJsonUrl?: (
      event: NativeSyntheticEvent<{ url: string }>
    ) => void;
    onDidFailWithError?: (
      event: NativeSyntheticEvent<{ error: string }>
    ) => void;
    onDidTriggerResize?: (
      event: NativeSyntheticEvent<{ width: number; height: number }>
    ) => void;
  }
> &
  ViewProps;

// Register the native component
const NativeView =
  requireNativeComponent<NativeBBShortsViewProps>("BBShortsView");

/**
 * BBShortsView - React Native Shorts Player component for Blue Billywig
 *
 * This component wraps the native Blue Billywig Shorts SDK for iOS and Android,
 * providing a vertical video swipe experience (TikTok-style).
 *
 * Note: This is a separate component from BBPlayerView. Shorts use a different
 * native SDK view that supports vertical swipe navigation.
 *
 * @example
 * ```tsx
 * import { BBShortsView } from '@bluebillywig/react-native-bb-player';
 *
 * function ShortsScreen() {
 *   const shortsRef = useRef<BBShortsViewMethods>(null);
 *
 *   return (
 *     <BBShortsView
 *       ref={shortsRef}
 *       jsonUrl="https://demo.bbvms.com/sh/58.json"
 *       style={{ flex: 1 }}
 *       onDidSetupWithJsonUrl={(url) => console.log('Shorts loaded:', url)}
 *       onDidFailWithError={(error) => console.error('Error:', error)}
 *     />
 *   );
 * }
 * ```
 */
const BBShortsView = forwardRef<BBShortsViewMethods, BBShortsViewProps>(
  (props, ref) => {
    const nativeRef = useRef<any>(null);

    // Expose methods via ref
    useImperativeHandle(
      ref,
      () => ({
        destroy: () => {
          const tag = findNodeHandle(nativeRef.current);
          if (tag != null) {
            // For iOS, we use the NativeModule pattern similar to BBPlayerModule
            // For Android, the destroy command is handled through the ViewManager
            NativeModules.BBShortsViewManager?.destroy?.(tag);
          }
        },
      }),
      []
    );

    return (
      <NativeView
        ref={nativeRef}
        jsonUrl={props.jsonUrl}
        options={props.options}
        style={props.style}
        // Unwrap events from NativeSyntheticEvent
        onDidSetupWithJsonUrl={
          props.onDidSetupWithJsonUrl
            ? (event) => props.onDidSetupWithJsonUrl?.(event.nativeEvent.url)
            : undefined
        }
        onDidFailWithError={
          props.onDidFailWithError
            ? (event) => props.onDidFailWithError?.(event.nativeEvent.error)
            : undefined
        }
        onDidTriggerResize={
          props.onDidTriggerResize
            ? (event) =>
                props.onDidTriggerResize?.(
                  event.nativeEvent.width,
                  event.nativeEvent.height
                )
            : undefined
        }
      />
    );
  }
);

BBShortsView.displayName = "BBShortsView";

export default BBShortsView;
export { BBShortsView };
