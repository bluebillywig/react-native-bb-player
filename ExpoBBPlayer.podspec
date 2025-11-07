require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name           = 'ExpoBBPlayer'
  s.version        = package['version']
  s.summary        = package['description']
  s.description    = 'Expo Module for Blue Billywig Native Player SDK'
  s.license        = package['license']
  s.author         = 'Blue Billywig'
  s.homepage       = 'https://github.com/bluebillywig/channel'
  s.platforms      = { :ios => '13.4', :tvos => '13.4' }
  s.swift_version  = '5.4'
  s.source         = { :path => '.' }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'
  s.dependency 'BlueBillywigNativePlayerKit-iOS', '= 8.37.0'

  # Swift/Objective-C compatibility
  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
    'SWIFT_COMPILATION_MODE' => 'wholemodule'
  }

  s.source_files = "ios/**/*.{h,m,mm,swift,hpp,cpp}"
end
