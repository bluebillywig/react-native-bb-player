require 'json'

package = JSON.parse(File.read(File.join(__dir__, '..', 'package.json')))

Pod::Spec.new do |s|
  s.name           = 'ExpoBBPlayer'
  s.version        = package['version']
  s.summary        = package['description']
  s.description    = package['description']
  s.license        = package['license']
  s.author         = package['author']
  s.homepage       = package['homepage']
  s.platforms      = {
    :ios => '15.1',
    :tvos => '15.1'
  }
  s.swift_version  = '5.4'
  s.source         = { git: 'https://github.com/RCVZ/expo-bb-player.git' }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'
  # Flexible version constraint allows patch updates (8.37.x)
  # Customers can override by specifying exact version in their Podfile
  s.dependency 'BlueBillywigNativePlayerKit-iOS', '~>8.37'
  s.dependency 'BlueBillywigNativePlayerKit-iOS/GoogleCastSDK'

  # Swift/Objective-C compatibility
  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
  }

  s.source_files = "**/*.{h,m,mm,swift,hpp,cpp}"
end
