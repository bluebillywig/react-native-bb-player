import React, { forwardRef, useImperativeHandle, useRef } from "react";
import {
  requireNativeComponent,
  type NativeSyntheticEvent,
  type ViewProps,
} from "react-native";

import type { BBPlayerViewProps, BBPlayerViewMethods } from "./BBPlayer.types";
import type {
  CustomStatistics,
  MediaClip,
  Override,
  Phase,
  Project,
  State,
} from "./types";
import { createCommands } from "./NativeCommands";

// Native event types with NativeSyntheticEvent wrapper
type NativeBBPlayerViewProps = Override<
  BBPlayerViewProps,
  {
    onDidFailWithError?: (
      event: NativeSyntheticEvent<{ payload: string }>
    ) => void;
    onDidRequestCollapse?: (event: NativeSyntheticEvent<{}>) => void;
    onDidRequestExpand?: (event: NativeSyntheticEvent<{}>) => void;
    onDidRequestOpenUrl?: (
      event: NativeSyntheticEvent<{ payload: string }>
    ) => void;
    onDidSetupWithJsonUrl?: (
      event: NativeSyntheticEvent<{ payload: string }>
    ) => void;
    onDidTriggerAdError?: (
      event: NativeSyntheticEvent<{ payload: string }>
    ) => void;
    onDidTriggerAdFinished?: (event: NativeSyntheticEvent<{}>) => void;
    onDidTriggerAdLoaded?: (event: NativeSyntheticEvent<{}>) => void;
    onDidTriggerAdLoadStart?: (event: NativeSyntheticEvent<{}>) => void;
    onDidTriggerAdNotFound?: (event: NativeSyntheticEvent<{}>) => void;
    onDidTriggerAdQuartile1?: (event: NativeSyntheticEvent<{}>) => void;
    onDidTriggerAdQuartile2?: (event: NativeSyntheticEvent<{}>) => void;
    onDidTriggerAdQuartile3?: (event: NativeSyntheticEvent<{}>) => void;
    onDidTriggerAdStarted?: (event: NativeSyntheticEvent<{}>) => void;
    onDidTriggerAllAdsCompleted?: (event: NativeSyntheticEvent<{}>) => void;
    onDidTriggerApiReady?: (event: NativeSyntheticEvent<{}>) => void;
    onDidTriggerAutoPause?: (
      event: NativeSyntheticEvent<{ why: string }>
    ) => void;
    onDidTriggerAutoPausePlay?: (
      event: NativeSyntheticEvent<{ why: string }>
    ) => void;
    onDidTriggerCanPlay?: (event: NativeSyntheticEvent<{}>) => void;
    onDidTriggerCustomStatistics?: (
      event: NativeSyntheticEvent<CustomStatistics>
    ) => void;
    onDidTriggerDurationChange?: (
      event: NativeSyntheticEvent<{ duration: number }>
    ) => void;
    onDidTriggerEnded?: (event: NativeSyntheticEvent<{}>) => void;
    onDidTriggerFullscreen?: (event: NativeSyntheticEvent<{}>) => void;
    onDidTriggerMediaClipFailed?: (event: NativeSyntheticEvent<{}>) => void;
    onDidTriggerMediaClipLoaded?: (
      event: NativeSyntheticEvent<MediaClip>
    ) => void;
    onDidTriggerModeChange?: (
      event: NativeSyntheticEvent<{ mode: string }>
    ) => void;
    onDidTriggerPause?: (event: NativeSyntheticEvent<{}>) => void;
    onDidTriggerPhaseChange?: (
      event: NativeSyntheticEvent<{ phase: Phase }>
    ) => void;
    onDidTriggerPlay?: (event: NativeSyntheticEvent<{}>) => void;
    onDidTriggerPlaying?: (event: NativeSyntheticEvent<{}>) => void;
    onDidTriggerProjectLoaded?: (event: NativeSyntheticEvent<Project>) => void;
    onDidTriggerRetractFullscreen?: (event: NativeSyntheticEvent<{}>) => void;
    onDidTriggerSeeked?: (
      event: NativeSyntheticEvent<{ payload: number }>
    ) => void;
    onDidTriggerSeeking?: (event: NativeSyntheticEvent<{}>) => void;
    onDidTriggerStall?: (event: NativeSyntheticEvent<{}>) => void;
    onDidTriggerStateChange?: (
      event: NativeSyntheticEvent<{ state: State }>
    ) => void;
    onDidTriggerTimeUpdate?: (
      event: NativeSyntheticEvent<{ currentTime: number; duration: number }>
    ) => void;
    onDidTriggerViewFinished?: (event: NativeSyntheticEvent<{}>) => void;
    onDidTriggerViewStarted?: (event: NativeSyntheticEvent<{}>) => void;
    onDidTriggerVolumeChange?: (
      event: NativeSyntheticEvent<{ volume: number; muted: boolean }>
    ) => void;
  }
> &
  ViewProps;

// Register the native component
const NativeView =
  requireNativeComponent<NativeBBPlayerViewProps>("BBPlayerView");

/**
 * BBPlayerView - React Native Video Player component for Blue Billywig
 *
 * This component wraps the native Blue Billywig player SDK for iOS and Android,
 * providing a seamless video playback experience with full native performance.
 */
const BBPlayerView = forwardRef<BBPlayerViewMethods, BBPlayerViewProps>(
  (props, ref) => {
    const nativeRef = useRef<any>(null);

    // Create command functions bound to the native view ref
    const commands = createCommands(nativeRef);

    // Expose methods via ref
    useImperativeHandle(ref, () => commands, []);

    return (
      <NativeView
        ref={nativeRef}
        {...props}
        // Unwrap events from NativeSyntheticEvent
        onDidFailWithError={
          props.onDidFailWithError
            ? (event) => props.onDidFailWithError?.(event.nativeEvent.payload)
            : undefined
        }
        onDidRequestCollapse={
          props.onDidRequestCollapse
            ? () => props.onDidRequestCollapse?.()
            : undefined
        }
        onDidRequestExpand={
          props.onDidRequestExpand
            ? () => props.onDidRequestExpand?.()
            : undefined
        }
        onDidRequestOpenUrl={
          props.onDidRequestOpenUrl
            ? (event) => props.onDidRequestOpenUrl?.(event.nativeEvent.payload)
            : undefined
        }
        onDidSetupWithJsonUrl={
          props.onDidSetupWithJsonUrl
            ? (event) =>
                props.onDidSetupWithJsonUrl?.(event.nativeEvent.payload)
            : undefined
        }
        onDidTriggerAdError={
          props.onDidTriggerAdError
            ? (event) => props.onDidTriggerAdError?.(event.nativeEvent.payload)
            : undefined
        }
        onDidTriggerAdFinished={
          props.onDidTriggerAdFinished
            ? () => props.onDidTriggerAdFinished?.()
            : undefined
        }
        onDidTriggerAdLoaded={
          props.onDidTriggerAdLoaded
            ? () => props.onDidTriggerAdLoaded?.()
            : undefined
        }
        onDidTriggerAdLoadStart={
          props.onDidTriggerAdLoadStart
            ? () => props.onDidTriggerAdLoadStart?.()
            : undefined
        }
        onDidTriggerAdNotFound={
          props.onDidTriggerAdNotFound
            ? () => props.onDidTriggerAdNotFound?.()
            : undefined
        }
        onDidTriggerAdQuartile1={
          props.onDidTriggerAdQuartile1
            ? () => props.onDidTriggerAdQuartile1?.()
            : undefined
        }
        onDidTriggerAdQuartile2={
          props.onDidTriggerAdQuartile2
            ? () => props.onDidTriggerAdQuartile2?.()
            : undefined
        }
        onDidTriggerAdQuartile3={
          props.onDidTriggerAdQuartile3
            ? () => props.onDidTriggerAdQuartile3?.()
            : undefined
        }
        onDidTriggerAdStarted={
          props.onDidTriggerAdStarted
            ? () => props.onDidTriggerAdStarted?.()
            : undefined
        }
        onDidTriggerAllAdsCompleted={
          props.onDidTriggerAllAdsCompleted
            ? () => props.onDidTriggerAllAdsCompleted?.()
            : undefined
        }
        onDidTriggerApiReady={
          props.onDidTriggerApiReady
            ? () => props.onDidTriggerApiReady?.()
            : undefined
        }
        onDidTriggerAutoPause={
          props.onDidTriggerAutoPause
            ? (event) => props.onDidTriggerAutoPause?.(event.nativeEvent.why)
            : undefined
        }
        onDidTriggerAutoPausePlay={
          props.onDidTriggerAutoPausePlay
            ? (event) =>
                props.onDidTriggerAutoPausePlay?.(event.nativeEvent.why)
            : undefined
        }
        onDidTriggerCanPlay={
          props.onDidTriggerCanPlay
            ? () => props.onDidTriggerCanPlay?.()
            : undefined
        }
        onDidTriggerCustomStatistics={
          props.onDidTriggerCustomStatistics
            ? (event) =>
                props.onDidTriggerCustomStatistics?.(event.nativeEvent)
            : undefined
        }
        onDidTriggerDurationChange={
          props.onDidTriggerDurationChange
            ? (event) =>
                props.onDidTriggerDurationChange?.(event.nativeEvent.duration)
            : undefined
        }
        onDidTriggerEnded={
          props.onDidTriggerEnded
            ? () => props.onDidTriggerEnded?.()
            : undefined
        }
        onDidTriggerFullscreen={
          props.onDidTriggerFullscreen
            ? () => props.onDidTriggerFullscreen?.()
            : undefined
        }
        onDidTriggerMediaClipFailed={
          props.onDidTriggerMediaClipFailed
            ? () => props.onDidTriggerMediaClipFailed?.()
            : undefined
        }
        onDidTriggerMediaClipLoaded={
          props.onDidTriggerMediaClipLoaded
            ? (event) =>
                props.onDidTriggerMediaClipLoaded?.(event.nativeEvent)
            : undefined
        }
        onDidTriggerModeChange={
          props.onDidTriggerModeChange
            ? (event) =>
                props.onDidTriggerModeChange?.(event.nativeEvent.mode)
            : undefined
        }
        onDidTriggerPause={
          props.onDidTriggerPause
            ? () => props.onDidTriggerPause?.()
            : undefined
        }
        onDidTriggerPhaseChange={
          props.onDidTriggerPhaseChange
            ? (event) =>
                props.onDidTriggerPhaseChange?.(event.nativeEvent.phase)
            : undefined
        }
        onDidTriggerPlay={
          props.onDidTriggerPlay ? () => props.onDidTriggerPlay?.() : undefined
        }
        onDidTriggerPlaying={
          props.onDidTriggerPlaying
            ? () => props.onDidTriggerPlaying?.()
            : undefined
        }
        onDidTriggerProjectLoaded={
          props.onDidTriggerProjectLoaded
            ? (event) => props.onDidTriggerProjectLoaded?.(event.nativeEvent)
            : undefined
        }
        onDidTriggerRetractFullscreen={
          props.onDidTriggerRetractFullscreen
            ? () => props.onDidTriggerRetractFullscreen?.()
            : undefined
        }
        onDidTriggerSeeked={
          props.onDidTriggerSeeked
            ? (event) => props.onDidTriggerSeeked?.(event.nativeEvent.payload)
            : undefined
        }
        onDidTriggerSeeking={
          props.onDidTriggerSeeking
            ? () => props.onDidTriggerSeeking?.()
            : undefined
        }
        onDidTriggerStall={
          props.onDidTriggerStall
            ? () => props.onDidTriggerStall?.()
            : undefined
        }
        onDidTriggerStateChange={
          props.onDidTriggerStateChange
            ? (event) =>
                props.onDidTriggerStateChange?.(event.nativeEvent.state)
            : undefined
        }
        onDidTriggerTimeUpdate={
          props.onDidTriggerTimeUpdate
            ? (event) =>
                props.onDidTriggerTimeUpdate?.(
                  event.nativeEvent.currentTime,
                  event.nativeEvent.duration
                )
            : undefined
        }
        onDidTriggerViewFinished={
          props.onDidTriggerViewFinished
            ? () => props.onDidTriggerViewFinished?.()
            : undefined
        }
        onDidTriggerViewStarted={
          props.onDidTriggerViewStarted
            ? () => props.onDidTriggerViewStarted?.()
            : undefined
        }
        onDidTriggerVolumeChange={
          props.onDidTriggerVolumeChange
            ? (event) =>
                props.onDidTriggerVolumeChange?.(event.nativeEvent.volume)
            : undefined
        }
      />
    );
  }
);

BBPlayerView.displayName = "BBPlayerView";

export default BBPlayerView;

// For backwards compatibility
export { BBPlayerView as ExpoBBPlayerView };
