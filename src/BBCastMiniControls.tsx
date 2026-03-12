import React from 'react';
import { requireNativeComponent, type ViewProps } from 'react-native';

export interface BBCastMiniControlsProps extends ViewProps {}

const NativeBBCastMiniControls =
  requireNativeComponent<BBCastMiniControlsProps>('BBCastMiniControlsView');

/**
 * BBCastMiniControls - Native ChromeCast mini controller that shows during casting.
 *
 * This component renders the native Google Cast SDK mini controller
 * (GCKUIMiniMediaControlsViewController on iOS, MiniControllerFragment on Android).
 * It automatically shows playback controls when content is being cast.
 *
 * @example
 * ```tsx
 * <BBCastMiniControls style={{ height: 64 }} />
 * ```
 */
const BBCastMiniControls: React.FC<BBCastMiniControlsProps> = (props) => {
  return <NativeBBCastMiniControls {...props} />;
};

BBCastMiniControls.displayName = 'BBCastMiniControls';

export default BBCastMiniControls;
