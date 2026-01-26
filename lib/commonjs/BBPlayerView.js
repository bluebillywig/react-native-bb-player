"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.ExpoBBPlayerView = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _NativeCommands = require("./NativeCommands");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Native event types with NativeSyntheticEvent wrapper

// Register the native component
const NativeView = (0, _reactNative.requireNativeComponent)("BBPlayerView");

/**
 * BBPlayerView - React Native Video Player component for Blue Billywig
 *
 * This component wraps the native Blue Billywig player SDK for iOS and Android,
 * providing a seamless video playback experience with full native performance.
 */
const BBPlayerView = exports.ExpoBBPlayerView = /*#__PURE__*/(0, _react.forwardRef)((props, ref) => {
  const {
    jwt,
    options,
    ...restProps
  } = props;
  const nativeRef = (0, _react.useRef)(null);

  // Create command functions bound to the native view ref
  const commands = (0, _NativeCommands.createCommands)(nativeRef);

  // Expose methods via ref
  (0, _react.useImperativeHandle)(ref, () => commands, []);

  // Merge jwt into options if provided
  const mergedOptions = jwt ? {
    ...options,
    jwt
  } : options;
  return /*#__PURE__*/_react.default.createElement(NativeView, _extends({
    ref: nativeRef
  }, restProps, {
    options: mergedOptions
    // Unwrap events from NativeSyntheticEvent
    ,
    onDidFailWithError: props.onDidFailWithError ? event => props.onDidFailWithError?.(event.nativeEvent.payload) : undefined,
    onDidRequestCollapse: props.onDidRequestCollapse ? () => props.onDidRequestCollapse?.() : undefined,
    onDidRequestExpand: props.onDidRequestExpand ? () => props.onDidRequestExpand?.() : undefined,
    onDidRequestOpenUrl: props.onDidRequestOpenUrl ? event => props.onDidRequestOpenUrl?.(event.nativeEvent.payload) : undefined,
    onDidSetupWithJsonUrl: props.onDidSetupWithJsonUrl ? event => props.onDidSetupWithJsonUrl?.(event.nativeEvent.payload) : undefined,
    onDidTriggerAdError: props.onDidTriggerAdError ? event => props.onDidTriggerAdError?.(event.nativeEvent.payload) : undefined,
    onDidTriggerAdFinished: props.onDidTriggerAdFinished ? () => props.onDidTriggerAdFinished?.() : undefined,
    onDidTriggerAdLoaded: props.onDidTriggerAdLoaded ? () => props.onDidTriggerAdLoaded?.() : undefined,
    onDidTriggerAdLoadStart: props.onDidTriggerAdLoadStart ? () => props.onDidTriggerAdLoadStart?.() : undefined,
    onDidTriggerAdNotFound: props.onDidTriggerAdNotFound ? () => props.onDidTriggerAdNotFound?.() : undefined,
    onDidTriggerAdQuartile1: props.onDidTriggerAdQuartile1 ? () => props.onDidTriggerAdQuartile1?.() : undefined,
    onDidTriggerAdQuartile2: props.onDidTriggerAdQuartile2 ? () => props.onDidTriggerAdQuartile2?.() : undefined,
    onDidTriggerAdQuartile3: props.onDidTriggerAdQuartile3 ? () => props.onDidTriggerAdQuartile3?.() : undefined,
    onDidTriggerAdStarted: props.onDidTriggerAdStarted ? () => props.onDidTriggerAdStarted?.() : undefined,
    onDidTriggerAllAdsCompleted: props.onDidTriggerAllAdsCompleted ? () => props.onDidTriggerAllAdsCompleted?.() : undefined,
    onDidTriggerApiReady: props.onDidTriggerApiReady ? () => props.onDidTriggerApiReady?.() : undefined,
    onDidTriggerAutoPause: props.onDidTriggerAutoPause ? event => props.onDidTriggerAutoPause?.(event.nativeEvent.why) : undefined,
    onDidTriggerAutoPausePlay: props.onDidTriggerAutoPausePlay ? event => props.onDidTriggerAutoPausePlay?.(event.nativeEvent.why) : undefined,
    onDidTriggerCanPlay: props.onDidTriggerCanPlay ? () => props.onDidTriggerCanPlay?.() : undefined,
    onDidTriggerCustomStatistics: props.onDidTriggerCustomStatistics ? event => props.onDidTriggerCustomStatistics?.(event.nativeEvent) : undefined,
    onDidTriggerDurationChange: props.onDidTriggerDurationChange ? event => props.onDidTriggerDurationChange?.(event.nativeEvent.duration) : undefined,
    onDidTriggerEnded: props.onDidTriggerEnded ? () => props.onDidTriggerEnded?.() : undefined,
    onDidTriggerFullscreen: props.onDidTriggerFullscreen ? () => props.onDidTriggerFullscreen?.() : undefined,
    onDidTriggerMediaClipFailed: props.onDidTriggerMediaClipFailed ? () => props.onDidTriggerMediaClipFailed?.() : undefined,
    onDidTriggerMediaClipLoaded: props.onDidTriggerMediaClipLoaded ? event => props.onDidTriggerMediaClipLoaded?.(event.nativeEvent) : undefined,
    onDidTriggerModeChange: props.onDidTriggerModeChange ? event => props.onDidTriggerModeChange?.(event.nativeEvent.mode) : undefined,
    onDidTriggerPause: props.onDidTriggerPause ? () => props.onDidTriggerPause?.() : undefined,
    onDidTriggerPhaseChange: props.onDidTriggerPhaseChange ? event => props.onDidTriggerPhaseChange?.(event.nativeEvent.phase) : undefined,
    onDidTriggerPlay: props.onDidTriggerPlay ? () => props.onDidTriggerPlay?.() : undefined,
    onDidTriggerPlaying: props.onDidTriggerPlaying ? () => props.onDidTriggerPlaying?.() : undefined,
    onDidTriggerProjectLoaded: props.onDidTriggerProjectLoaded ? event => props.onDidTriggerProjectLoaded?.(event.nativeEvent) : undefined,
    onDidTriggerRetractFullscreen: props.onDidTriggerRetractFullscreen ? () => props.onDidTriggerRetractFullscreen?.() : undefined,
    onDidTriggerSeeked: props.onDidTriggerSeeked ? event => props.onDidTriggerSeeked?.(event.nativeEvent.payload) : undefined,
    onDidTriggerSeeking: props.onDidTriggerSeeking ? () => props.onDidTriggerSeeking?.() : undefined,
    onDidTriggerStall: props.onDidTriggerStall ? () => props.onDidTriggerStall?.() : undefined,
    onDidTriggerStateChange: props.onDidTriggerStateChange ? event => props.onDidTriggerStateChange?.(event.nativeEvent.state) : undefined,
    onDidTriggerTimeUpdate: props.onDidTriggerTimeUpdate ? event => props.onDidTriggerTimeUpdate?.(event.nativeEvent.currentTime, event.nativeEvent.duration) : undefined,
    onDidTriggerViewFinished: props.onDidTriggerViewFinished ? () => props.onDidTriggerViewFinished?.() : undefined,
    onDidTriggerViewStarted: props.onDidTriggerViewStarted ? () => props.onDidTriggerViewStarted?.() : undefined,
    onDidTriggerVolumeChange: props.onDidTriggerVolumeChange ? event => props.onDidTriggerVolumeChange?.(event.nativeEvent.volume) : undefined
  }));
});
BBPlayerView.displayName = "BBPlayerView";
var _default = exports.default = BBPlayerView; // For backwards compatibility
//# sourceMappingURL=BBPlayerView.js.map