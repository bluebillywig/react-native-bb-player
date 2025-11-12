# GitHub Workflows

This directory contains automated workflows for release management and testing of react-native-bb-player.

## Workflows

### 1. Build and Test (`build-and-test.yaml`)

**Purpose**: Builds and tests the player-api-example demo app on every PR and release branch push.

**Trigger**:
- Pull requests to `master` or `release/**`
- Pushes to `release/**` branches
- Manual workflow dispatch

**What it does**:
1. **Android Build**: Builds release APK of demo app
2. **iOS Build**: Builds iOS app for simulator (unsigned)
3. **TypeScript Check**: Validates TypeScript types

**Artifacts**: Uploads Android APK as workflow artifact (30-day retention)

---

### 2. Create Release Branch (`create-release-branch.yaml`)

**Purpose**: Automatically detects the latest iOS and Android native SDK versions and creates a release branch with updated dependencies.

**Trigger**: Manual workflow dispatch from GitHub Actions UI

**Parameters**:
- `version`: The version to use for the release
  - `latest` (default): Automatically detect and use the latest native SDK versions
  - `auto`: Auto-increment from the latest release branch (patch version)
  - `{x}.{y}.{z}`: Specify an exact version (e.g., `8.38.0`)

**What it does**:
1. Queries CocoaPods for the latest `BlueBillywigNativePlayerKit-iOS` version
2. Queries Maven for the latest `bbnativeplayersdk` version
3. Creates a new release branch: `release/v{x}.{y}.{z}`
4. Updates `package.json` version
5. Updates `ReactNativeBBPlayer.podspec` iOS dependency
6. Updates `android/build.gradle` Android dependency
7. Updates `CHANGELOG.md` with new version entry
8. Commits and pushes the changes

**Usage**:
1. Go to **Actions** tab in GitHub
2. Select **Create release branch** workflow
3. Click **Run workflow**
4. Choose version mode: `latest`, `auto`, or specify version
5. Click **Run workflow**

**Example scenarios**:

```yaml
# Use latest native SDK versions (recommended for sprint releases)
version: latest
# Result: Creates release/v8.38.0 if both iOS and Android SDKs are at 8.38.0

# Auto-increment patch version
version: auto
# Result: If latest is v8.38.0, creates release/v8.38.1

# Specify exact version
version: 8.39.0
# Result: Creates release/v8.39.0 (but uses detected native SDK versions)
```

---

### 3. Create Release Tag (`create-release-tag.yaml`)

**Purpose**: Creates a release tag, builds artifacts, and publishes a GitHub release with downloadable assets.

**Trigger**: Manual workflow dispatch from GitHub Actions UI (must be run from a release branch)

**Parameters**: None (automatically uses the current branch)

**What it does**:
1. **Creates Release**: Validates branch, creates tag, generates changelog
2. **Builds Android Demo**: Compiles player-api-example APK (~70 MB)
3. **Creates npm Package**: Generates .tgz tarball (~40 KB)
4. **Generates Documentation**: Bundles all docs into .tar.gz (~50 KB)
5. **Publishes GitHub Release** with:
   - Release notes from changelog
   - Native SDK version information
   - Installation instructions
   - Links to documentation
6. **Uploads Public Artifacts**:
   - `player-api-example-{version}.apk` - Android demo app
   - `react-native-bb-player-{version}.tgz` - npm package
   - `react-native-bb-player-docs-{version}.tar.gz` - Documentation bundle

**Build Time**: ~10-15 minutes (parallel builds)

**Usage**:
1. Ensure you're on a release branch (e.g., `release/v8.38.0`)
2. Go to **Actions** tab in GitHub
3. Select **Create release tag** workflow
4. Make sure the branch dropdown shows your release branch
5. Click **Run workflow**
6. Click **Run workflow** again

**Important**: This workflow MUST be run from a release branch, not from master!

---

## Complete Release Process

### Scenario 1: Sprint Release with Latest Native SDKs (Recommended)

```bash
# 1. Create release branch with latest SDKs
#    Via GitHub Actions UI:
#    - Actions → Create release branch → Run workflow
#    - Input: "latest"

# 2. Checkout and test the release branch locally
git fetch origin
git checkout release/v8.38.0

cd player-api-example
npm install
npx expo run:ios      # Test iOS
npx expo run:android  # Test Android

# 3. If tests pass, create the release tag
#    Via GitHub Actions UI (from release/v8.38.0 branch):
#    - Actions → Create release tag → Run workflow

# 4. (Optional) Publish to npm
git checkout release/v8.38.0
git pull
npm publish
```

### Scenario 2: Hotfix Release (Patch Version)

```bash
# 1. Create release branch with auto-increment
#    Via GitHub Actions UI:
#    - Actions → Create release branch → Run workflow
#    - Input: "auto"
#    This creates release/v8.38.1 if latest was v8.38.0

# 2. Checkout and apply your hotfix
git fetch origin
git checkout release/v8.38.1

# Make your hotfix changes
git add .
git commit -m "Fix: description of the fix"
git push origin release/v8.38.1

# 3. Test and create release tag
#    Via GitHub Actions UI (from release/v8.38.1 branch):
#    - Actions → Create release tag → Run workflow
```

### Scenario 3: Custom Version Release

```bash
# 1. Create release branch with specific version
#    Via GitHub Actions UI:
#    - Actions → Create release branch → Run workflow
#    - Input: "8.39.0"

# 2. Review and test as usual
# 3. Create release tag as usual
```

---

## Workflow Features

### ✅ Automatic SDK Version Detection

The create-release-branch workflow automatically queries:
- **CocoaPods**: `https://cdn.cocoapods.org/Specs/BlueBillywigNativePlayerKit-iOS/`
- **Maven**: `https://maven.bluebillywig.com/releases/com/bluebillywig/bbnativeplayersdk/bbnativeplayersdk/maven-metadata.xml`

This ensures you're always using the latest native SDK versions without manual lookup.

### ✅ Version Validation

- Checks if release branches/tags already exist
- Validates version format
- Ensures release tags are created from release branches only

### ✅ Automatic CHANGELOG Updates

Creates a new entry in CHANGELOG.md with:
- Version number
- Release date
- Native SDK version changes

### ✅ Rich GitHub Releases

Creates GitHub releases with:
- Formatted release notes
- Native SDK version information
- Installation instructions
- Links to documentation

---

## Troubleshooting

### "Release branch already exists"

**Cause**: A release branch with this version already exists.

**Solution**: Either:
- Use `auto` to auto-increment the patch version
- Choose a different version number
- Delete the existing branch if it's incorrect

### "Not on a release branch"

**Cause**: Trying to run create-release-tag from master or another non-release branch.

**Solution**:
1. Switch to a release branch in GitHub UI
2. Run the workflow from that branch

### "Could not detect latest SDK version"

**Cause**: Network issue or SDK repository unavailable.

**Solution**:
- Wait a moment and retry
- Check if CocoaPods/Maven are accessible
- Use manual version specification as fallback

### Version Mismatch Between iOS and Android

**Warning**: If iOS SDK is 8.38.0 but Android is 8.37.0, the workflow will warn you.

**Resolution**: The workflow will use the iOS version but log a warning. Verify with your team which version should be used.

---

## Integration with Sprint Workflow

This automated workflow integrates seamlessly with the 2-weekly sprint cycle:

**Monday**: Native SDKs (iOS & Android) are released by Blue Billywig

**Tuesday**:
```bash
# Run: Create release branch workflow with "latest"
# This automatically creates release/v8.38.0 with updated dependencies
```

**Tuesday-Wednesday**: Test the release branch

**Thursday**: Run: Create release tag workflow (creates GitHub release)

**Friday**: Optionally publish to npm

---

## Manual Alternative

If you prefer not to use GitHub Actions, you can still use the manual script:

```bash
./scripts/update-native-sdks.sh 8.38.0
```

However, the GitHub Actions workflows provide better automation and validation.

---

## Best Practices

1. **Always use `latest`** for regular sprint releases
2. **Use `auto`** only for hotfixes/patches
3. **Test the release branch** before creating the release tag
4. **Update CHANGELOG.md** with specific changes before creating the tag
5. **Run create-release-tag** only from release branches, never from master
6. **Verify native SDK versions** match between iOS and Android before releasing

---

## Workflow Permissions

These workflows require:
- Read/write access to repository contents
- Permission to create branches and tags
- Permission to create releases

These are provided by the default `GITHUB_TOKEN` for workflows.

---

## Questions?

See:
- [SPRINT_RELEASE_CHECKLIST.md](../../SPRINT_RELEASE_CHECKLIST.md) - Complete release process
- [CHANGELOG.md](../../CHANGELOG.md) - Version history
- [Contributing Guide] - (if you have one)
