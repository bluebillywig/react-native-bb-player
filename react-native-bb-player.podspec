require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

# Use a fallback version for local development if version is 0.0.0-development
# This prevents CocoaPods from trying to validate a non-existent git tag
version = package['version']
if version.start_with?('0.0.0')
  version = '0.0.1-local'
end

Pod::Spec.new do |s|
  s.name           = 'react-native-bb-player'
  s.version        = version
  s.summary        = package['description']
  s.description    = 'React Native Module for Blue Billywig Native Player SDK'
  s.license        = package['license']
  s.author         = 'Blue Billywig'
  s.homepage       = 'https://github.com/bluebillywig/react-native-bb-player'
  s.platforms      = { :ios => '14.0' }
  s.swift_version  = '5.4'
  s.source         = { :git => 'https://github.com/bluebillywig/react-native-bb-player.git', :tag => "v#{s.version}" }
  s.static_framework = true

  s.dependency 'React-Core'
  s.dependency 'BlueBillywigNativePlayerKit-iOS', '~> 8.45.0'
  s.dependency 'BlueBillywigNativePlayerKit-iOS/GoogleCastSDK', '~> 8.45.0'

  # Note: TurboModule/New Architecture dependencies (React-Codegen, RCT-Folly, etc.)
  # are automatically provided by React Native when New Architecture is enabled.
  # No need to specify them here as they would create duplicate/conflicting deps.

  # Swift/Objective-C compatibility
  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
    'SWIFT_COMPILATION_MODE' => 'wholemodule'
  }

  s.source_files = "ios/**/*.{h,m,mm,swift,hpp,cpp}"
end
