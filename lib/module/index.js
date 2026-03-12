"use strict";

// Main exports
export { default as BBPlayerView } from "./BBPlayerView";
export { default as BBShortsView } from "./BBShortsView";
export { default as BBOutstreamPlayerView } from "./BBOutstreamView";
export { BBModalPlayer } from "./BBModalPlayer";
export * from "./BBPlayer.types";
export * from "./BBShortsView"; // Export BBShortsView types
export * from "./BBOutstreamView"; // Export BBOutstreamView types
export * from "./types";
export * from "./utils";

// Deprecated aliases — kept for backwards compatibility
/** @deprecated Use `BBOutstreamPlayerView` instead. */
export { default as BBOutstreamView } from "./BBOutstreamView";
/** @deprecated Use `BBOutstreamPlayerView` instead. */
export { default as ExpoBBPlayerView } from "./BBPlayerView";
//# sourceMappingURL=index.js.map