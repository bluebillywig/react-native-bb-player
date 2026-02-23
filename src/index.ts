// Main exports
export { default as BBPlayerView } from "./BBPlayerView";
export { default as BBShortsView } from "./BBShortsView";
export { default as BBOutstreamView } from "./BBOutstreamView";
export { BBModalPlayer } from "./BBModalPlayer";
export type { ModalPlayerOptions } from "./BBModalPlayer";
export * from "./BBPlayer.types";
export * from "./BBShortsView"; // Export BBShortsView types
export * from "./BBOutstreamView"; // Export BBOutstreamView types
export * from "./types";
export * from "./utils";

// For backwards compatibility with Expo module naming
export { default as ExpoBBPlayerView } from "./BBPlayerView";
export {
  type BBPlayerViewProps as ExpoBBPlayerViewProps,
  type BBPlayerViewMethods as ExpoBBPlayerViewType,
} from "./BBPlayer.types";
