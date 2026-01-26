"use strict";

/**
 * Converts a Blue Billywig playout URL to a mediaclip JSON URL
 *
 * @param url - The URL to convert (e.g., https://demo.bbvms.com/p/default/c/6323522.json)
 * @returns The converted mediaclip JSON URL (e.g., https://demo.bbvms.com/json/mediaclip/6323522)
 *
 * @example
 * convertPlayoutUrlToMediaclipUrl('https://demo.bbvms.com/p/default/c/6323522.json')
 * // Returns: 'https://demo.bbvms.com/json/mediaclip/6323522'
 */
export function convertPlayoutUrlToMediaclipUrl(url) {
  try {
    const urlObj = new URL(url);

    // Check if this is a playout URL (contains /p/ in the path)
    const playoutMatch = urlObj.pathname.match(/\/p\/[^\/]+\/c\/(\d+)/);
    if (playoutMatch && playoutMatch[1]) {
      const clipId = playoutMatch[1];
      // Construct the mediaclip JSON URL
      return `${urlObj.protocol}//${urlObj.host}/json/mediaclip/${clipId}`;
    }

    // If it's not a playout URL, return the original URL
    return url;
  } catch (error) {
    // If URL parsing fails, return the original URL
    if (__DEV__) {
      console.warn('Failed to parse URL:', error);
    }
    return url;
  }
}
//# sourceMappingURL=utils.js.map