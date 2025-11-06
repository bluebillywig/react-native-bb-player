# Publishing expo-bb-player

This guide explains how to publish `expo-bb-player` as a standalone npm package.

## Overview

`expo-bb-player` is designed to be published as a standalone React Native package that other packages (like `expo-bb-channel`) can depend on. It provides native video player integration for iOS (AVPlayer) and Android (ExoPlayer).

## Prerequisites

Before publishing:

1. **npm Account**: You need an npm account with publish permissions
2. **GitHub Repository**: The package should have its own GitHub repository at `https://github.com/bluebillywig/expo-bb-player`
3. **Testing**: Ensure all functionality works on both iOS and Android
4. **Version**: Update the version number in `package.json` according to semver

## Pre-Publishing Checklist

- [ ] All native code (iOS and Android) is tested and working
- [ ] README.md is up to date with current API
- [ ] Example app works correctly
- [ ] Version number is updated in `package.json`
- [ ] CHANGELOG is updated (if you maintain one)
- [ ] No development dependencies in `dependencies` (only in `devDependencies` or `peerDependencies`)
- [ ] All files to be published are listed in the `files` array in `package.json`

## Publishing Steps

### 1. Login to npm

```bash
npm login
```

Enter your npm credentials when prompted.

### 2. Verify Package Contents

Check what files will be included in the published package:

```bash
npm pack --dry-run
```

This shows you exactly what will be published. Ensure:
- Source files (`src/`) are included
- Native code (`ios/`, `android/`) is included
- Documentation (`README.md`) is included
- Unnecessary files (tests, examples) are excluded

### 3. Test the Package Locally

Before publishing, test the package locally:

```bash
# In expo-bb-player directory
npm pack
```

This creates a `.tgz` file. Then in a test project:

```bash
npm install /path/to/expo-bb-player-1.0.0.tgz
```

Test the installation and functionality.

### 4. Publish to npm

For the first release:

```bash
npm publish
```

For subsequent releases:

```bash
# Update version first
npm version patch  # or minor, or major
npm publish
```

### 5. Verify Publication

After publishing, verify the package:

```bash
npm view expo-bb-player
```

Test installation in a fresh project:

```bash
npm install expo-bb-player
```

## Versioning Strategy

Follow [Semantic Versioning](https://semver.org/):

- **MAJOR** (1.0.0 → 2.0.0): Breaking changes to the API
- **MINOR** (1.0.0 → 1.1.0): New features, backward compatible
- **PATCH** (1.0.0 → 1.0.1): Bug fixes, backward compatible

### Breaking Changes Examples
- Removing or renaming props
- Changing prop types
- Removing methods or events
- Changing native module interface

### Minor Changes Examples
- Adding new props (optional)
- Adding new events
- Adding new methods
- Performance improvements

### Patch Changes Examples
- Bug fixes
- Documentation updates
- Internal refactoring (no API changes)

## Publishing from CI/CD

For automated publishing, you can use GitHub Actions:

```yaml
name: Publish Package

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

Add your npm token to GitHub Secrets as `NPM_TOKEN`.

## Post-Publishing

After publishing:

1. **Create a Git Tag**:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

2. **Create a GitHub Release**: Document changes and link to npm package

3. **Update Dependent Packages**: Update `expo-bb-channel` and other packages to use the published version

4. **Announce**: Let users know about the new release

## Troubleshooting

### "You do not have permission to publish"

- Ensure you're logged in with the correct npm account
- Check that the package name is not already taken
- Verify you have publish permissions for scoped packages

### "Package already published"

- You cannot republish the same version
- Increment the version number with `npm version patch`

### "Missing Files in Published Package"

- Check the `files` array in `package.json`
- Run `npm pack --dry-run` to preview
- Ensure `.npmignore` is not excluding necessary files

### Native Modules Not Found After Installation

- Ensure `ExpoBBPlayer.podspec` is included in the `files` array
- Ensure `android/build.gradle` is included
- Check that `expo-module.config.json` is included

## Updating expo-bb-channel Dependency

After publishing, update `expo-bb-channel` to use the published version:

```json
{
  "dependencies": {
    "expo-bb-player": "^1.0.0"
  }
}
```

Remove any local path or workspace references.

## Support

For issues with publishing:
- npm documentation: https://docs.npmjs.com/
- Expo modules: https://docs.expo.dev/modules/overview/
- GitHub Issues: https://github.com/bluebillywig/expo-bb-player/issues
