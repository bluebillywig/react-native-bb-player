import React, {
  forwardRef,
  useRef,
  useImperativeHandle,
  useState,
  useCallback,
  useEffect,
} from 'react';
import { Animated, LayoutAnimation, Platform, UIManager } from 'react-native';
import BBPlayerView from './BBPlayerView';
import type { BBPlayerViewProps, BBPlayerViewMethods } from './BBPlayer.types';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

/**
 * Animation type for collapse/expand transitions
 */
export type OutstreamAnimationType = 'timing' | 'spring' | 'layout' | 'none';

/**
 * Configuration for Outstream animations
 */
export interface OutstreamAnimationConfig {
  /**
   * Type of animation to use
   * - 'timing': Smooth linear animation (default)
   * - 'spring': Bouncy spring animation
   * - 'layout': Uses LayoutAnimation (simpler, may be smoother on some devices)
   * - 'none': Instant collapse/expand with no animation
   * @default 'timing'
   */
  type?: OutstreamAnimationType;

  /**
   * Duration in milliseconds (for 'timing' and 'layout' types)
   * @default 300
   */
  duration?: number;

  /**
   * Spring damping (for 'spring' type only)
   * @default 15
   */
  damping?: number;

  /**
   * Spring stiffness (for 'spring' type only)
   * @default 100
   */
  stiffness?: number;
}

/**
 * Props for BBOutstreamView
 */
export interface BBOutstreamViewProps extends Omit<BBPlayerViewProps, 'options'> {
  /**
   * Initial/expanded height of the player in pixels
   * @default 200
   */
  expandedHeight?: number;

  /**
   * Height when collapsed in pixels
   * @default 0
   */
  collapsedHeight?: number;

  /**
   * Animation configuration for collapse/expand
   */
  animation?: OutstreamAnimationConfig;

  /**
   * Player options. `allowCollapseExpand` is automatically set to true.
   */
  options?: Record<string, unknown>;

  /**
   * Called when the player requests to collapse (after animation completes)
   */
  onCollapsed?: () => void;

  /**
   * Called when the player requests to expand (after animation completes)
   */
  onExpanded?: () => void;

  /**
   * Called when collapse/expand animation starts
   */
  onAnimationStart?: (isCollapsing: boolean) => void;
}

/**
 * Methods available on BBOutstreamView ref
 */
export interface BBOutstreamViewMethods extends BBPlayerViewMethods {
  /**
   * Returns whether the player is currently collapsed
   */
  isCollapsed: () => boolean;

  /**
   * Programmatically collapse the player with animation
   */
  animateCollapse: () => void;

  /**
   * Programmatically expand the player with animation
   */
  animateExpand: () => void;
}

/**
 * BBOutstreamView - Convenience wrapper for Outstream advertising
 *
 * This component wraps BBPlayerView with automatic collapse/expand animation
 * handling. It's designed for Outstream ad placements embedded in scrollable
 * content like articles or feeds.
 *
 * @example
 * ```tsx
 * <ScrollView>
 *   <Text>Article content...</Text>
 *
 *   <BBOutstreamView
 *     ref={outstreamRef}
 *     jsonUrl="https://demo.bbvms.com/a/native_sdk_outstream.json"
 *     expandedHeight={250}
 *     animation={{ type: 'spring', damping: 20 }}
 *     onCollapsed={() => console.log('Player collapsed')}
 *     onExpanded={() => console.log('Player expanded')}
 *   />
 *
 *   <Text>More content...</Text>
 * </ScrollView>
 * ```
 */
const BBOutstreamView = forwardRef<BBOutstreamViewMethods, BBOutstreamViewProps>(
  (
    {
      expandedHeight = 200,
      collapsedHeight = 0,
      animation = {},
      options = {},
      onCollapsed,
      onExpanded,
      onAnimationStart,
      onDidRequestCollapse,
      onDidRequestExpand,
      style,
      ...playerProps
    },
    ref
  ) => {
    const playerRef = useRef<BBPlayerViewMethods>(null);
    const heightAnim = useRef(new Animated.Value(expandedHeight)).current;
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Default animation config
    const animConfig: Required<OutstreamAnimationConfig> = {
      type: animation.type ?? 'timing',
      duration: animation.duration ?? 300,
      damping: animation.damping ?? 15,
      stiffness: animation.stiffness ?? 100,
    };

    // Update animated value when expandedHeight changes
    useEffect(() => {
      if (!isCollapsed) {
        heightAnim.setValue(expandedHeight);
      }
    }, [expandedHeight, isCollapsed, heightAnim]);

    const animateToHeight = useCallback(
      (toHeight: number, onComplete?: () => void) => {
        const isCollapsing = toHeight === collapsedHeight;
        onAnimationStart?.(isCollapsing);

        if (animConfig.type === 'none') {
          heightAnim.setValue(toHeight);
          onComplete?.();
          return;
        }

        if (animConfig.type === 'layout') {
          LayoutAnimation.configureNext(
            LayoutAnimation.create(
              animConfig.duration,
              LayoutAnimation.Types.easeInEaseOut,
              LayoutAnimation.Properties.scaleY
            ),
            onComplete
          );
          heightAnim.setValue(toHeight);
          return;
        }

        const animationFn =
          animConfig.type === 'spring'
            ? Animated.spring(heightAnim, {
                toValue: toHeight,
                damping: animConfig.damping,
                stiffness: animConfig.stiffness,
                useNativeDriver: false,
              })
            : Animated.timing(heightAnim, {
                toValue: toHeight,
                duration: animConfig.duration,
                useNativeDriver: false,
              });

        animationFn.start(({ finished }) => {
          if (finished) {
            onComplete?.();
          }
        });
      },
      [heightAnim, collapsedHeight, animConfig, onAnimationStart]
    );

    const handleRequestCollapse = useCallback(() => {
      setIsCollapsed(true);
      animateToHeight(collapsedHeight, onCollapsed);
      onDidRequestCollapse?.();
    }, [animateToHeight, collapsedHeight, onCollapsed, onDidRequestCollapse]);

    const handleRequestExpand = useCallback(() => {
      setIsCollapsed(false);
      animateToHeight(expandedHeight, onExpanded);
      onDidRequestExpand?.();
    }, [animateToHeight, expandedHeight, onExpanded, onDidRequestExpand]);

    // Programmatic collapse/expand
    const animateCollapse = useCallback(() => {
      if (!isCollapsed) {
        setIsCollapsed(true);
        animateToHeight(collapsedHeight, onCollapsed);
        playerRef.current?.collapse();
      }
    }, [isCollapsed, animateToHeight, collapsedHeight, onCollapsed]);

    const animateExpand = useCallback(() => {
      if (isCollapsed) {
        setIsCollapsed(false);
        animateToHeight(expandedHeight, onExpanded);
        playerRef.current?.expand();
      }
    }, [isCollapsed, animateToHeight, expandedHeight, onExpanded]);

    // Expose methods via ref
    useImperativeHandle(
      ref,
      () => ({
        // Pass through all BBPlayerViewMethods
        play: () => playerRef.current?.play(),
        pause: () => playerRef.current?.pause(),
        seek: (position: number) => playerRef.current?.seek(position),
        seekRelative: (offset: number) => playerRef.current?.seekRelative(offset),
        setVolume: (volume: number) => playerRef.current?.setVolume(volume),
        setMuted: (muted: boolean) => playerRef.current?.setMuted(muted),
        collapse: () => playerRef.current?.collapse(),
        expand: () => playerRef.current?.expand(),
        enterFullscreen: () => playerRef.current?.enterFullscreen(),
        enterFullscreenLandscape: () => playerRef.current?.enterFullscreenLandscape(),
        exitFullscreen: () => playerRef.current?.exitFullscreen(),
        showCastPicker: () => playerRef.current?.showCastPicker(),
        destroy: () => playerRef.current?.destroy(),
        autoPlayNextCancel: () => playerRef.current?.autoPlayNextCancel(),
        loadClip: (clipId: string, opts?: Parameters<BBPlayerViewMethods['loadClip']>[1]) =>
          playerRef.current?.loadClip(clipId, opts),
        loadWithClipId: (...args: Parameters<BBPlayerViewMethods['loadWithClipId']>) =>
          playerRef.current?.loadWithClipId(...args),
        loadWithClipListId: (...args: Parameters<BBPlayerViewMethods['loadWithClipListId']>) =>
          playerRef.current?.loadWithClipListId(...args),
        loadWithProjectId: (...args: Parameters<BBPlayerViewMethods['loadWithProjectId']>) =>
          playerRef.current?.loadWithProjectId(...args),
        loadWithClipJson: (...args: Parameters<BBPlayerViewMethods['loadWithClipJson']>) =>
          playerRef.current?.loadWithClipJson(...args),
        loadWithClipListJson: (...args: Parameters<BBPlayerViewMethods['loadWithClipListJson']>) =>
          playerRef.current?.loadWithClipListJson(...args),
        loadWithProjectJson: (...args: Parameters<BBPlayerViewMethods['loadWithProjectJson']>) =>
          playerRef.current?.loadWithProjectJson(...args),
        loadWithJsonUrl: (...args: Parameters<BBPlayerViewMethods['loadWithJsonUrl']>) =>
          playerRef.current?.loadWithJsonUrl(...args),
        getDuration: () => playerRef.current?.getDuration() ?? Promise.resolve(null),
        getMuted: () => playerRef.current?.getMuted() ?? Promise.resolve(null),
        getVolume: () => playerRef.current?.getVolume() ?? Promise.resolve(null),
        getPhase: () => playerRef.current?.getPhase() ?? Promise.resolve(null),
        getState: () => playerRef.current?.getState() ?? Promise.resolve(null),
        getMode: () => playerRef.current?.getMode() ?? Promise.resolve(null),
        getClipData: () => playerRef.current?.getClipData() ?? Promise.resolve(null),
        getProjectData: () => playerRef.current?.getProjectData() ?? Promise.resolve(null),
        getPlayoutData: () => playerRef.current?.getPlayoutData() ?? Promise.resolve(null),
        getPlayerState: () => playerRef.current?.getPlayerState() ?? Promise.resolve(null),

        // Outstream-specific methods
        isCollapsed: () => isCollapsed,
        animateCollapse,
        animateExpand,
      }),
      [isCollapsed, animateCollapse, animateExpand]
    );

    // Merge options with allowCollapseExpand: true
    const outstreamOptions = {
      ...options,
      allowCollapseExpand: true,
    };

    return (
      <Animated.View style={[{ height: heightAnim, overflow: 'hidden' }, style]}>
        <BBPlayerView
          ref={playerRef}
          options={outstreamOptions}
          onDidRequestCollapse={handleRequestCollapse}
          onDidRequestExpand={handleRequestExpand}
          style={{ flex: 1 }}
          {...playerProps}
        />
      </Animated.View>
    );
  }
);

BBOutstreamView.displayName = 'BBOutstreamView';

export default BBOutstreamView;
