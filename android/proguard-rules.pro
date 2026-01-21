# Expo BB Player ProGuard Rules
# Optimizations for release builds

# Keep Blue Billywig Native Player SDK classes
-keep class com.bluebillywig.** { *; }
-keep interface com.bluebillywig.** { *; }
-keepclassmembers class com.bluebillywig.** { *; }

# Keep Blue Billywig Native Shared classes
-keep class com.bluebillywig.bbnativeshared.** { *; }
-keep interface com.bluebillywig.bbnativeshared.** { *; }

# Keep Expo BB Player module classes
-keep class expo.modules.bbplayer.** { *; }
-keep interface expo.modules.bbplayer.** { *; }

# Keep Expo Modules API classes that are accessed via reflection
-keep class expo.modules.kotlin.** { *; }
-keepclassmembers class expo.modules.kotlin.** { *; }

# Keep delegate interfaces and their implementations
-keep class * implements com.bluebillywig.bbnativeplayersdk.BBNativePlayerViewDelegate { *; }

# Keep enum classes used by the SDK
-keepclassmembers enum com.bluebillywig.bbnativeshared.enums.** { *; }

# Keep model classes that are serialized/deserialized
-keepclassmembers class com.bluebillywig.bbnativeshared.model.** { *; }

# Remove debug logging in release builds (already guarded by BuildConfig.DEBUG)
-assumenosideeffects class android.util.Log {
    public static *** d(...);
    public static *** v(...);
    public static *** i(...);
}

# Optimize - but not aggressively to avoid breaking functionality
-optimizations !code/simplification/arithmetic,!code/simplification/cast,!field/*,!class/merging/*
-optimizationpasses 5
-allowaccessmodification

# Keep line numbers for better crash reports
-keepattributes SourceFile,LineNumberTable

# Keep annotations
-keepattributes *Annotation*

# Keep native methods
-keepclasseswithmembernames class * {
    native <methods>;
}

# Keep custom view constructors (required for Android layout inflation)
-keepclasseswithmembers class * {
    public <init>(android.content.Context, android.util.AttributeSet);
}
-keepclasseswithmembers class * {
    public <init>(android.content.Context, android.util.AttributeSet, int);
}
