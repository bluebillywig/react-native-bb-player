# Setting Up expo-bb-player as a Separate Repository

This guide explains how to extract `expo-bb-player` from the monorepo and set it up as a standalone GitHub repository.

## Why a Separate Repository?

Publishing `expo-bb-player` as a standalone package has several benefits:

1. **Independent Versioning**: Version the player independently from the channel SDK
2. **Focused Development**: Dedicated issues, PRs, and releases for player improvements
3. **Reusability**: Other projects can use the player without the channel SDK
4. **Clearer Dependencies**: Makes the dependency relationship explicit

## Prerequisites

- Git installed and configured
- GitHub account with repository creation permissions
- Access to the Blue Billywig organization (or your own account for testing)

## Step-by-Step Guide

### 1. Create New GitHub Repository

1. Go to https://github.com/bluebillywig (or your organization)
2. Click "New repository"
3. Repository name: `expo-bb-player`
4. Description: "Blue Billywig Native Video Player for React Native"
5. Choose visibility (Public recommended for npm packages)
6. **Do not** initialize with README, .gitignore, or license (we'll copy these)
7. Click "Create repository"

### 2. Extract Package Files

From the monorepo root:

```bash
# Create a temporary directory
mkdir -p /tmp/expo-bb-player-extract

# Copy the package directory
cp -r packages/expo-bb-player/* /tmp/expo-bb-player-extract/

cd /tmp/expo-bb-player-extract
```

### 3. Initialize Git Repository

```bash
# Initialize git
git init

# Create .gitignore if it doesn't exist
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
package-lock.json
yarn.lock
pnpm-lock.yaml

# Build output
build/
dist/
*.tgz

# IDE
.idea/
.vscode/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Example app specific
example/node_modules/
example/.expo/
example/dist/
example/build/

# iOS
ios/Pods/
ios/*.xcworkspace
*.xcuserstate
example/ios/Pods/
example/ios/build/

# Android
android/.gradle/
android/build/
android/.idea/
example/android/.gradle/
example/android/build/
example/android/app/build/

# Misc
*.log
.env
.env.local
EOF

# Add all files
git add .

# Initial commit
git commit -m "Initial commit: Extract expo-bb-player from monorepo"
```

### 4. Connect to GitHub

```bash
# Add remote (replace with your actual repository URL)
git remote add origin https://github.com/bluebillywig/expo-bb-player.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 5. Update package.json

The `package.json` should already have the correct repository URL from the publishing guide:

```json
{
  "repository": {
    "type": "git",
    "url": "https://github.com/bluebillywig/expo-bb-player.git"
  },
  "bugs": {
    "url": "https://github.com/bluebillywig/expo-bb-player/issues"
  },
  "homepage": "https://github.com/bluebillywig/expo-bb-player#readme"
}
```

Verify these URLs match your new repository.

### 6. Set Up GitHub Repository

In your new GitHub repository:

#### Add Topics
Go to repository settings → About → Topics:
- `react-native`
- `expo`
- `video-player`
- `ios`
- `android`
- `avplayer`
- `exoplayer`

#### Add Description
Set the repository description:
```
Blue Billywig Native Video Player for React Native - iOS AVPlayer and Android ExoPlayer integration
```

#### Create Initial Release
1. Go to Releases → Create a new release
2. Tag: `v1.0.0`
3. Title: `v1.0.0 - Initial Release`
4. Description: Document the initial features

### 7. Update Monorepo to Use Published Package

In the monorepo, update `packages/expo-bb-channel/package.json`:

**Before (monorepo reference):**
```json
{
  "dependencies": {
    "expo-bb-player": "*"
  }
}
```

**After (npm package reference):**
```json
{
  "dependencies": {
    "expo-bb-player": "^1.0.0"
  }
}
```

Then reinstall dependencies:
```bash
cd /path/to/monorepo
pnpm install
```

### 8. Optional: Preserve Git History

If you want to preserve the git history from the monorepo:

```bash
# In the monorepo
git log --pretty=email --patch-with-stat --reverse \
  --full-index --binary -- packages/expo-bb-player > /tmp/expo-bb-player.patch

# In the new repository
cd /tmp/expo-bb-player-extract
git am < /tmp/expo-bb-player.patch
```

This is optional and can be complex. The simpler approach (Step 3) is usually sufficient.

## Maintaining Both Repositories

### Development Workflow

1. **Make changes in standalone repo**: Develop features in `expo-bb-player` repository
2. **Publish new version**: Follow [PUBLISHING.md](../PUBLISHING.md)
3. **Update monorepo**: Update version in `expo-bb-channel/package.json`

### Synchronizing Changes

If you need to make changes to `expo-bb-player` from the monorepo:

1. Make changes in standalone repository
2. Publish new version to npm
3. Update dependency in monorepo

**Do not** modify the local copy in `packages/expo-bb-player` after migration - use the npm package.

## CI/CD Setup

### GitHub Actions for Testing

Create `.github/workflows/test.yml`:

```yaml
name: Test

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint
      - run: npm run build
```

### GitHub Actions for Publishing

Create `.github/workflows/publish.yml`:

```yaml
name: Publish

on:
  release:
    types: [created]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'
      - run: npm ci
      - run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

Add `NPM_TOKEN` to repository secrets.

## Directory Structure After Migration

### Standalone Repository (expo-bb-player)
```
expo-bb-player/
├── README.md
├── PUBLISHING.md
├── package.json
├── expo-module.config.json
├── ExpoBBPlayer.podspec
├── src/
│   ├── index.ts
│   ├── ExpoBBPlayerView.tsx
│   └── types.ts
├── ios/
│   └── BBPlayer native iOS code
├── android/
│   └── BBPlayer native Android code
├── example/
│   └── Example app
└── docs/
    └── SEPARATE_REPO_SETUP.md
```

### Monorepo (channel-hybrid-ott)
```
channel-hybrid-ott/
├── packages/
│   └── expo-bb-channel/
│       ├── package.json (depends on published expo-bb-player)
│       └── ... channel code
└── apps/
    └── mobile-app/
```

## Troubleshooting

### "Module not found: expo-bb-player"

After switching to published package:
```bash
cd monorepo
pnpm install
cd apps/mobile-app
pnpm android  # or pnpm ios
```

### Native Modules Not Linking

For Expo:
```bash
expo prebuild --clean
```

For bare React Native:
```bash
cd ios && pod install && cd ..
cd android && ./gradlew clean && cd ..
```

### Version Conflicts

Ensure you're using the correct version:
```bash
npm list expo-bb-player
```

## Best Practices

1. **Semantic Versioning**: Follow semver strictly
2. **Changelog**: Maintain a CHANGELOG.md documenting all changes
3. **Documentation**: Keep README up to date
4. **Testing**: Test both iOS and Android before each release
5. **Deprecation Warnings**: Provide clear migration paths for breaking changes
6. **GitHub Releases**: Create releases for each npm version

## Support

For questions about repository setup:
- GitHub documentation: https://docs.github.com/
- npm publishing: https://docs.npmjs.com/
- Expo modules: https://docs.expo.dev/modules/overview/

For issues with the package:
- GitHub Issues: https://github.com/bluebillywig/expo-bb-player/issues
