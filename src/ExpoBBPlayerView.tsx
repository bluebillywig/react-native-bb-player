import { requireNativeView } from "expo";
import React from "react";
import type { NativeSyntheticEvent } from "react-native";

import type { ExpoBBPlayerViewProps } from "./ExpoBBPlayer.types";
import type {
  CustomStatistics,
  MediaClip,
  Override,
  Phase,
  Project,
  State,
} from "./types";

type NativeExpoBBPlayerViewProps = Override<
  ExpoBBPlayerViewProps,
  {
    onDidFailWithError?: (
      event: NativeSyntheticEvent<{ payload: string }>
    ) => void;
    onDidRequestOpenUrl?: (
      event: NativeSyntheticEvent<{ payload: string }>
    ) => void;
    onDidSetupWithJsonUrl?: (
      event: NativeSyntheticEvent<{ payload: string }>
    ) => void;
    onDidTriggerAutoPause?: (
      event: NativeSyntheticEvent<{ why: string }>
    ) => void;
    onDidTriggerAutoPausePlay?: (
      event: NativeSyntheticEvent<{ why: string }>
    ) => void;
    onDidTriggerDurationChange?: (
      event: NativeSyntheticEvent<{ duration: number }>
    ) => void;
    onDidTriggerCustomStatistics?: (
      event: NativeSyntheticEvent<CustomStatistics>
    ) => void;
    onDidTriggerMediaClipLoaded?: (
      event: NativeSyntheticEvent<MediaClip>
    ) => void;
    onDidTriggerModeChange?: (
      event: NativeSyntheticEvent<{ mode: string }>
    ) => void;
    onDidTriggerPhaseChange?: (
      event: NativeSyntheticEvent<{ phase: Phase }>
    ) => void;
    onDidTriggerProjectLoaded?: (event: NativeSyntheticEvent<Project>) => void;
    onDidTriggerSeeked?: (
      event: NativeSyntheticEvent<{ payload: number }>
    ) => void;
    onDidTriggerStateChange?: (
      event: NativeSyntheticEvent<{ state: State }>
    ) => void;
    onDidTriggerVolumeChange?: (
      event: NativeSyntheticEvent<{ volume: number; muted: boolean }>
    ) => void;
    onDidTriggerTimeUpdate?: (
      event: NativeSyntheticEvent<{ currentTime: number; duration: number }>
    ) => void;
  }
>;

const NativeView: React.ComponentType<NativeExpoBBPlayerViewProps> =
  requireNativeView("ExpoBBPlayer");

const ExpoBBPlayerView = React.memo((props: ExpoBBPlayerViewProps) => {
  return (
    <NativeView
      {...props}
      onDidTriggerCustomStatistics={(event) =>
        props.onDidTriggerCustomStatistics?.(event.nativeEvent)
      }
      onDidTriggerProjectLoaded={(event) =>
        props.onDidTriggerProjectLoaded?.(event.nativeEvent)
      }
      onDidTriggerMediaClipLoaded={(event) =>
        props.onDidTriggerMediaClipLoaded?.(event.nativeEvent)
      }
      onDidTriggerPhaseChange={(event) =>
        props.onDidTriggerPhaseChange?.(event.nativeEvent.phase)
      }
      onDidTriggerStateChange={(event) =>
        props.onDidTriggerStateChange?.(event.nativeEvent.state)
      }
      onDidTriggerModeChange={(event) =>
        props.onDidTriggerModeChange?.(event.nativeEvent.mode)
      }
      onDidTriggerDurationChange={(event) =>
        props.onDidTriggerDurationChange?.(event.nativeEvent.duration)
      }
      onDidTriggerSeeked={(event) =>
        props.onDidTriggerSeeked?.(event.nativeEvent.payload)
      }
      onDidTriggerVolumeChange={(event) =>
        props.onDidTriggerVolumeChange?.(event.nativeEvent.volume)
      }
      onDidTriggerAutoPause={(event) =>
        props.onDidTriggerAutoPause?.(event.nativeEvent.why)
      }
      onDidTriggerAutoPausePlay={(event) =>
        props.onDidTriggerAutoPausePlay?.(event.nativeEvent.why)
      }
      onDidFailWithError={(event) => {
        props.onDidFailWithError?.(event.nativeEvent.payload);
      }}
      onDidRequestOpenUrl={(event) => {
        props.onDidRequestOpenUrl?.(event.nativeEvent.payload);
      }}
      onDidSetupWithJsonUrl={(event) => {
        props.onDidSetupWithJsonUrl?.(event.nativeEvent.payload);
      }}
      onDidTriggerTimeUpdate={(event) => {
        const { currentTime, duration } = event.nativeEvent;
        props.onDidTriggerTimeUpdate?.(currentTime, duration);
      }}
    />
  );
});

ExpoBBPlayerView.displayName = "ExpoBBPlayerView";

export default ExpoBBPlayerView;
