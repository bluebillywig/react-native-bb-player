#!/bin/bash

# Script to update native SDK versions
# Usage: ./scripts/update-native-sdks.sh 8.38.0

set -e

if [ -z "$1" ]; then
  echo "Usage: $0 <version>"
  echo "Example: $0 8.38.0"
  exit 1
fi

NEW_VERSION=$1
BRANCH_NAME="update/sdk-${NEW_VERSION}"

echo "📦 Updating react-native-bb-player to native SDK version ${NEW_VERSION}"

# Create branch
git checkout master
git pull origin master
git checkout -b "$BRANCH_NAME"

# Update package.json version
echo "📝 Updating package.json..."
sed -i '' "s/\"version\": \".*\"/\"version\": \"${NEW_VERSION}\"/" package.json

# Update iOS podspec
echo "📝 Updating ReactNativeBBPlayer.podspec..."
sed -i '' "s/s.dependency 'BlueBillywigNativePlayerKit-iOS', '= .*'/s.dependency 'BlueBillywigNativePlayerKit-iOS', '= ${NEW_VERSION}'/" ReactNativeBBPlayer.podspec

# Update Android build.gradle
echo "📝 Updating android/build.gradle..."
sed -i '' "s/com.bluebillywig.bbnativeplayersdk:bbnativeplayersdk:.*/com.bluebillywig.bbnativeplayersdk:bbnativeplayersdk:${NEW_VERSION}'/" android/build.gradle

# Create changelog entry
echo "📝 Creating changelog entry..."
TODAY=$(date +%Y-%m-%d)
cat > CHANGELOG_NEW.md << EOF
## [${NEW_VERSION}] - ${TODAY}

### Updated
- iOS Native SDK to ${NEW_VERSION}
- Android Native SDK to ${NEW_VERSION}

### Changes
- TODO: Add specific changes from native SDK release notes

EOF

if [ -f CHANGELOG.md ]; then
  cat CHANGELOG.md >> CHANGELOG_NEW.md
  mv CHANGELOG_NEW.md CHANGELOG.md
else
  mv CHANGELOG_NEW.md CHANGELOG.md
fi

echo ""
echo "✅ Version updated to ${NEW_VERSION}"
echo ""
echo "Next steps:"
echo "1. Review the changes: git diff"
echo "2. Update CHANGELOG.md with specific changes"
echo "3. Test iOS: cd player-api-example && npx expo run:ios"
echo "4. Test Android: cd player-api-example && npx expo run:android"
echo "5. Commit: git add . && git commit -m 'Update to native SDK ${NEW_VERSION}'"
echo "6. Push: git push origin ${BRANCH_NAME}"
echo "7. Create PR and merge after testing"
echo "8. Tag release: git tag v${NEW_VERSION} && git push origin v${NEW_VERSION}"
