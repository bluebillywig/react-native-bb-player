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

  # Prefer vendored frameworks (from npm package) over CocoaPods remote
  frameworks_dir = File.join(__dir__, 'ios', 'Frameworks')
  if File.exist?(File.join(frameworks_dir, 'BBNativePlayerKit.xcframework'))
    s.vendored_frameworks = 'ios/Frameworks/BBNativePlayerKit.xcframework',
                            'ios/Frameworks/bbnativeshared.xcframework'
    s.dependency 'GoogleAds-IMA-iOS-SDK', '3.23.0'
    s.dependency 'GoogleUserMessagingPlatform', '~> 2.1'
    s.dependency 'google-cast-sdk-dynamic-xcframework-ios-bb', '4.8.0'
  else
    s.dependency 'BlueBillywigNativePlayerKit-iOS'
    s.dependency 'BlueBillywigNativePlayerKit-iOS/GoogleCastSDK'
  end

  # Swift/Objective-C compatibility
  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
    'SWIFT_COMPILATION_MODE' => 'wholemodule'
  }

  s.source_files = "ios/*.{h,m,mm,swift,hpp,cpp}"
end
