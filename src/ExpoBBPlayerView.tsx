import { requireNativeView } from "expo";
import type React from "react";
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
      event: NativeSyntheticEvent<{ payload: string }>
    ) => void;
    onDidTriggerAutoPausePlay?: (
      event: NativeSyntheticEvent<{ payload: string }>
    ) => void;
    onDidTriggerDurationChange?: (
      event: NativeSyntheticEvent<{ payload: number }>
    ) => void;
    onDidTriggerCustomStatistics?: (
      event: NativeSyntheticEvent<CustomStatistics>
    ) => void;
    onDidTriggerMediaClipLoaded?: (
      event: NativeSyntheticEvent<MediaClip>
    ) => void;
    onDidTriggerModeChange?: (
      event: NativeSyntheticEvent<{ payload: string }>
    ) => void;
    onDidTriggerPhaseChange?: (
      event: NativeSyntheticEvent<{ payload: Phase }>
    ) => void;
    onDidTriggerProjectLoaded?: (event: NativeSyntheticEvent<Project>) => void;
    onDidTriggerSeeked?: (
      event: NativeSyntheticEvent<{ payload: number }>
    ) => void;
    onDidTriggerStateChange?: (
      event: NativeSyntheticEvent<{ payload: State }>
    ) => void;
    onDidTriggerVolumeChange?: (
      event: NativeSyntheticEvent<{ payload: number }>
    ) => void;
  }
>;

const NativeView: React.ComponentType<NativeExpoBBPlayerViewProps> =
  requireNativeView("ExpoBBPlayer");

const ExpoBBPlayerView = (props: ExpoBBPlayerViewProps) => {
  return (
    <NativeView
      {...props}
      onDidTriggerCustomStatistics={(event) =>
        props.onDidTriggerCustomStatistics?.(event.nativeEvent)
      }
      onDidTriggerProjectLoaded={(event) =>
        props.onDidTriggerProjectLoaded?.(event.nativeEvent)
      }
      onDidTriggerMediaClipLoaded={(event) => {
        console.log("onDidTriggerMediaClipLoaded", event.nativeEvent);
        props.onDidTriggerMediaClipLoaded?.(event.nativeEvent);
      }}
      onDidTriggerPhaseChange={(event) => {
        console.log("onDidTriggerPhaseChange", event.nativeEvent);
        props.onDidTriggerPhaseChange?.(event.nativeEvent.payload);
      }}
      onDidTriggerStateChange={(event) =>
        props.onDidTriggerStateChange?.(event.nativeEvent.payload)
      }
      onDidTriggerModeChange={(event) =>
        props.onDidTriggerModeChange?.(event.nativeEvent.payload)
      }
      onDidTriggerDurationChange={(event) =>
        props.onDidTriggerDurationChange?.(event.nativeEvent.payload)
      }
      onDidTriggerSeeked={(event) =>
        props.onDidTriggerSeeked?.(event.nativeEvent.payload)
      }
      onDidTriggerVolumeChange={(event) =>
        props.onDidTriggerVolumeChange?.(event.nativeEvent.payload)
      }
      onDidTriggerAutoPause={(event) =>
        props.onDidTriggerAutoPause?.(event.nativeEvent.payload)
      }
      onDidTriggerAutoPausePlay={(event) =>
        props.onDidTriggerAutoPausePlay?.(event.nativeEvent.payload)
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
    />
  );
};

export default ExpoBBPlayerView;
