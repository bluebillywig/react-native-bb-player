#!/usr/bin/env bash
set -euo pipefail

# Vendor BB native SDK binaries into the npm package.
# iOS: clones xcframeworks from cocoapod repos (private — requires GitHub auth)
# Android: downloads AARs/POMs from Maven Central (public)
#
# Usage: ./scripts/vendor-native-sdks.sh --ios-version 8.45.1 --android-version 8.45.0

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

IOS_VERSION=""
ANDROID_VERSION=""

while [[ $# -gt 0 ]]; do
  case $1 in
    --ios-version) IOS_VERSION="$2"; shift 2 ;;
    --android-version) ANDROID_VERSION="$2"; shift 2 ;;
    *) echo "Unknown arg: $1"; exit 1 ;;
  esac
done

if [[ -z "$IOS_VERSION" || -z "$ANDROID_VERSION" ]]; then
  echo "Usage: $0 --ios-version VERSION --android-version VERSION"
  exit 1
fi

echo "Vendoring iOS $IOS_VERSION, Android $ANDROID_VERSION"

# ============================================================
# iOS — clone xcframeworks from cocoapod repos
# ============================================================
IOS_DIR="$ROOT_DIR/ios/Frameworks"
rm -rf "$IOS_DIR"
mkdir -p "$IOS_DIR"

TMPDIR_IOS=$(mktemp -d)
trap 'rm -rf "$TMPDIR_IOS"' EXIT

echo ""
echo "=== iOS: BBNativePlayerKit.xcframework ==="
git clone --depth 1 --branch "$IOS_VERSION" \
  "https://github.com/bluebillywig/bbnativeplayerkit-cocoapod.git" \
  "$TMPDIR_IOS/playerkit"
cp -R "$TMPDIR_IOS/playerkit/BBNativePlayerKit.xcframework" "$IOS_DIR/"

echo ""
echo "=== iOS: bbnativeshared.xcframework ==="
git clone --depth 1 --branch "$IOS_VERSION" \
  "https://github.com/bluebillywig/bbnativeshared-cocoapod.git" \
  "$TMPDIR_IOS/shared"
cp -R "$TMPDIR_IOS/shared/bbnativeshared.xcframework" "$IOS_DIR/"

echo "iOS frameworks vendored to $IOS_DIR"
ls -lh "$IOS_DIR"

# ============================================================
# Android — download from Maven Central
# ============================================================
REPO_DIR="$ROOT_DIR/android/repo"
rm -rf "$REPO_DIR"

MAVEN_BASE="https://repo1.maven.org/maven2/com/bluebillywig"

# BB artifacts: "group_subpath/artifactId"
ARTIFACT_PATHS="
bbnativeplayersdk/bbnativeplayersdk
bbnativeplayersdk/bbnativeplayersdk-core
bbnativeshared/bbnativeshared
bbnativeshared/bbnativeshared-android
"

echo ""
echo "=== Android: downloading from Maven Central ==="

for artifact_path in $ARTIFACT_PATHS; do
  group_part="${artifact_path%%/*}"
  artifact_name="${artifact_path##*/}"

  maven_url="$MAVEN_BASE/$artifact_path/$ANDROID_VERSION"
  local_dir="$REPO_DIR/com/bluebillywig/$group_part/$artifact_name/$ANDROID_VERSION"
  mkdir -p "$local_dir"

  echo "  Fetching $artifact_name $ANDROID_VERSION ..."

  # Download .pom (required for Gradle resolution)
  curl -sfL "$maven_url/$artifact_name-$ANDROID_VERSION.pom" \
    -o "$local_dir/$artifact_name-$ANDROID_VERSION.pom" || {
    echo "ERROR: failed to download .pom for $artifact_name"; exit 1
  }

  # Download .module (Gradle metadata, needed for KMP — optional)
  curl -sfL "$maven_url/$artifact_name-$ANDROID_VERSION.module" \
    -o "$local_dir/$artifact_name-$ANDROID_VERSION.module" 2>/dev/null || {
    echo "  (no .module for $artifact_name)"
  }

  # Download .aar or .jar
  curl -sfL "$maven_url/$artifact_name-$ANDROID_VERSION.aar" \
    -o "$local_dir/$artifact_name-$ANDROID_VERSION.aar" 2>/dev/null || {
    curl -sfL "$maven_url/$artifact_name-$ANDROID_VERSION.jar" \
      -o "$local_dir/$artifact_name-$ANDROID_VERSION.jar" 2>/dev/null || {
      echo "  (no .aar/.jar for $artifact_name — metadata-only module)"
    }
  }
done

echo ""
echo "Android artifacts vendored to $REPO_DIR"
find "$REPO_DIR" -type f | sort

echo ""
echo "Done. Vendored iOS $IOS_VERSION + Android $ANDROID_VERSION"
