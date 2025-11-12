# Sprint Release Checklist

This checklist ensures react-native-bb-player stays synchronized with Blue Billywig's 2-weekly native SDK releases.

## 🚀 Quick Start: Automated Workflow (Recommended)

**For regular sprint releases, use the automated GitHub Actions workflows:**

1. **Create Release Branch** (via GitHub Actions UI)
   - Go to Actions → "Create release branch"
   - Input: `latest` (auto-detects latest native SDK versions)
   - This creates a release branch with all dependencies updated

2. **Test the Release Branch**
   ```bash
   git fetch origin
   git checkout release/v8.38.0
   cd player-api-example
   npm install
   npx expo run:ios && npx expo run:android
   ```

3. **Create Release** (via GitHub Actions UI, from release branch)
   - Switch to the release branch in GitHub
   - Go to Actions → "Create release tag"
   - This creates the GitHub release automatically

4. **(Optional) Publish to npm**
   ```bash
   npm publish
   ```

**See [.github/workflows/README.md](.github/workflows/README.md) for detailed workflow documentation.**

---

## 📋 Manual Process (Alternative)

If you prefer manual control or need to make custom changes, follow this checklist:

## Pre-Release (When Native SDKs are Released)

### 1. Verify Native SDK Releases
- [ ] iOS SDK released: `BlueBillywigNativePlayerKit-iOS` version `_______`
- [ ] Android SDK released: `bbnativeplayersdk` version `_______`
- [ ] Review iOS SDK changelog: [Link to iOS release notes]
- [ ] Review Android SDK changelog: [Link to Android release notes]

### 2. Update Dependencies
```bash
# Run the automated update script
./scripts/update-native-sdks.sh <version>

# Example:
./scripts/update-native-sdks.sh 8.38.0
```

Manual alternative:
- [ ] Update `package.json` version
- [ ] Update `ReactNativeBBPlayer.podspec` iOS dependency
- [ ] Update `android/build.gradle` Android dependency
- [ ] Update `CHANGELOG.md` with changes from native SDKs

### 3. Testing

#### iOS Testing
```bash
cd player-api-example
rm -rf ios node_modules package-lock.json
npm install
npx expo prebuild --platform ios
cd ios
pod install
cd ..
npx expo run:ios
```

Test checklist:
- [ ] Video loads and plays
- [ ] Fullscreen works (regular and landscape)
- [ ] Seek/scrubbing works
- [ ] Volume control works
- [ ] Events fire correctly
- [ ] No crashes or errors in console

#### Android Testing
```bash
cd player-api-example
rm -rf android node_modules package-lock.json
npm install
npx expo prebuild --platform android
npx expo run:android
```

Test checklist:
- [ ] Video loads and plays
- [ ] Fullscreen works (regular and landscape)
- [ ] Seek/scrubbing works
- [ ] Volume control works
- [ ] Events fire correctly
- [ ] No crashes or errors in logcat

### 4. Documentation Updates
- [ ] Update README.md if there are API changes
- [ ] Update TypeScript definitions if needed
- [ ] Add migration notes to CHANGELOG.md if breaking changes
- [ ] Update FULLSCREEN.md if orientation behavior changed

## Release Process

### 5. Create Release
```bash
# Commit changes
git add .
git commit -m "Update to native SDK <version>"
git push origin update/sdk-<version>

# Create PR
# Title: "Update to native SDK <version>"
# Description: Include changelog highlights

# After PR approval and merge:
git checkout master
git pull origin master

# Create and push tag
git tag v<version>
git push origin v<version>

# GitHub Actions will automatically create the release
```

Manual steps:
- [ ] Create update branch
- [ ] Push branch and create PR
- [ ] Review and merge PR
- [ ] Create git tag: `v<version>`
- [ ] Push tag to trigger GitHub release

### 6. npm Publishing (Optional)
```bash
# Login to npm (first time only)
npm login

# Publish to npm
npm publish

# Or for scoped package:
npm publish --access public
```

- [ ] Verify package published: https://www.npmjs.com/package/react-native-bb-player

### 7. Post-Release
- [ ] Announce release in team channels
- [ ] Update internal documentation
- [ ] Notify customers/users if needed
- [ ] Monitor for issues in the first 24-48 hours

## Timeline

**Recommended Schedule:**

| Day | Activity |
|-----|----------|
| Monday (Sprint End) | Native SDKs released |
| Tuesday | Update wrapper dependencies, test iOS |
| Wednesday | Test Android, update docs |
| Thursday | Create PR, review |
| Friday | Merge, tag, release |

## Quick Reference

### Version Files to Update
1. `package.json` - line 3
2. `ReactNativeBBPlayer.podspec` - dependency line
3. `android/build.gradle` - implementation line
4. `CHANGELOG.md` - add new version section

### Key Commands
```bash
# Update versions
./scripts/update-native-sdks.sh <version>

# Test iOS
cd player-api-example && npx expo run:ios

# Test Android
cd player-api-example && npx expo run:android

# Release
git tag v<version> && git push origin v<version>

# Publish to npm
npm publish
```

## Troubleshooting

### iOS Pod Installation Fails
```bash
cd player-api-example/ios
pod repo update
pod install --repo-update
```

### Android Gradle Build Fails
```bash
cd player-api-example/android
./gradlew clean
./gradlew assembleDebug
```

### Version Mismatch Issues
- Ensure all three files (package.json, podspec, build.gradle) use the same version
- Clear caches: `npm cache clean --force`
- Remove node_modules and reinstall

## Notes

- Always test both platforms before releasing
- Keep CHANGELOG.md up to date with all changes
- If a native SDK has breaking changes, document migration steps
- Consider creating a beta/RC tag for major updates before final release
