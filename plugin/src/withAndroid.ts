import { ConfigPlugin, withProjectBuildGradle } from "expo/config-plugins";

import type { BBPlayerPluginProps } from "./index";

const BB_MAVEN_REPO = "https://maven.bluebillywig.com/releases";
const BB_MAVEN_COMMENT = "// Blue Billywig SDK Maven Repository";

/**
 * Adds the Blue Billywig Maven repository to the Android project's build.gradle
 */
export const withAndroidBBPlayer: ConfigPlugin<BBPlayerPluginProps> = (
  config,
  props
) => {
  return withProjectBuildGradle(config, (config) => {
    const mavenUrl = props.androidMavenUrl || BB_MAVEN_REPO;

    config.modResults.contents = addBBMavenRepository(
      config.modResults.contents,
      mavenUrl
    );

    return config;
  });
};

/**
 * Adds the BB Maven repository to build.gradle if not already present
 */
function addBBMavenRepository(
  buildGradle: string,
  mavenUrl: string
): string {
  // Check if already added
  if (buildGradle.includes("maven.bluebillywig.com") || buildGradle.includes(mavenUrl)) {
    return buildGradle;
  }

  const mavenBlock = `
        ${BB_MAVEN_COMMENT}
        maven {
            url "${mavenUrl}"
        }`;

  // Find allprojects { repositories { ... } } block and add maven repo
  // Pattern: allprojects { ... repositories { ... } }
  const allProjectsRepoPattern =
    /allprojects\s*\{[^}]*repositories\s*\{/;

  if (allProjectsRepoPattern.test(buildGradle)) {
    // Add after the opening of repositories block in allprojects
    return buildGradle.replace(
      allProjectsRepoPattern,
      (match) => `${match}${mavenBlock}`
    );
  }

  // For newer Gradle/React Native versions, repositories might be in settings.gradle
  // or managed differently. Try to find any repositories block.
  const repoPattern = /repositories\s*\{/;

  if (repoPattern.test(buildGradle)) {
    // Find the last repositories block (usually the one in allprojects or dependencyResolutionManagement)
    const matches = buildGradle.match(/repositories\s*\{/g);
    if (matches && matches.length > 0) {
      // Replace the last occurrence
      const lastIndex = buildGradle.lastIndexOf("repositories {");
      if (lastIndex !== -1) {
        return (
          buildGradle.slice(0, lastIndex + "repositories {".length) +
          mavenBlock +
          buildGradle.slice(lastIndex + "repositories {".length)
        );
      }
    }
  }

  // If no repositories block found, warn and return unchanged
  console.warn(
    "[@bluebillywig/react-native-bb-player] Could not find repositories block in build.gradle. " +
      "You may need to manually add the Blue Billywig Maven repository."
  );

  return buildGradle;
}
