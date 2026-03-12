import React from 'react';
import { requireNativeComponent, type ViewProps, type ColorValue } from 'react-native';

export interface BBCastButtonProps extends ViewProps {
  /**
   * Tint color for the cast button icon.
   * Accepts any React Native color value.
   */
  tintColor?: ColorValue;
}

const NativeBBCastButton = requireNativeComponent<BBCastButtonProps>('BBCastButtonView');

/**
 * BBCastButton - A native ChromeCast button that auto-shows/hides based on device availability.
 *
 * This component renders the native Google Cast SDK button (GCKUICastButton on iOS,
 * MediaRouteButton on Android). It automatically becomes visible when a Cast device
 * is discovered on the network and hides when none are available.
 *
 * @example
 * ```tsx
 * <BBCastButton style={{ width: 48, height: 48 }} tintColor="#ffffff" />
 * ```
 */
const BBCastButton: React.FC<BBCastButtonProps> = (props) => {
  return <NativeBBCastButton {...props} />;
};

BBCastButton.displayName = 'BBCastButton';

export default BBCastButton;
