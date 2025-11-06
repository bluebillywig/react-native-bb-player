import { ExpoBBPlayerView, type ExpoBBPlayerViewType } from "expo-bb-player";
import React, { useRef, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import Button from "../components/Button";

export default function ApiScreen() {
  const scrollViewRef = useRef<ScrollView>(null);
  const playerRef = useRef<ExpoBBPlayerViewType>(null);
  const [events, setEvents] = useState<string[]>([]);
  const [apiProperties, setApiProperties] = useState<string | undefined>("");

  const options = {
    allowCollapseExpand: false,
    autoPlay: false,
  };

  return (
    <SafeAreaView style={styles.container}>
      <ExpoBBPlayerView
        ref={playerRef}
        jsonUrl="https://demo.bbvms.com/a/native_sdk_outstream.json"
        options={options}
        onDidFailWithError={(error) => {
          setEvents((prev) => [...prev, `didFailWithError: ${error}`]);
        }}
        onDidRequestCollapse={() => {
          setEvents((prev) => [...prev, "onDidRequestCollapse"]);
        }}
        onDidRequestExpand={() => {
          setEvents((prev) => [...prev, "onDidRequestExpand"]);
        }}
        onDidRequestOpenUrl={(url) => {
          setEvents((prev) => [...prev, `onDidRequestOpenUrl: ${url}`]);
        }}
        onDidSetupWithJsonUrl={(jsonUrl) => {
          setEvents((prev) => [...prev, `onDidSetupWithJsonUrl: ${jsonUrl}`]);
        }}
        onDidTriggerAdError={(error) => {
          setEvents((prev) => [...prev, `onDidTriggerAdError: ${error}`]);
        }}
        onDidTriggerAdLoaded={() => {
          setEvents((prev) => [...prev, "onDidTriggerAdLoaded"]);
        }}
        onDidTriggerAdFinished={() => {
          setEvents((prev) => [...prev, "onDidTriggerAdFinished"]);
        }}
        onDidTriggerAdQuartile1={() => {
          setEvents((prev) => [...prev, "onDidTriggerAdQuartile1"]);
        }}
        onDidTriggerAdQuartile2={() => {
          setEvents((prev) => [...prev, "onDidTriggerAdQuartile2"]);
        }}
        onDidTriggerAdQuartile3={() => {
          setEvents((prev) => [...prev, "onDidTriggerAdQuartile3"]);
        }}
        onDidTriggerAdStarted={() => {
          setEvents((prev) => [...prev, "onDidTriggerAdStarted"]);
        }}
        onDidTriggerAllAdsCompleted={() => {
          setEvents((prev) => [...prev, "onDidTriggerAllAdsCompleted"]);
        }}
        onDidTriggerAutoPause={(why) => {
          setEvents((prev) => [...prev, `onDidTriggerAutoPause: ${why}`]);
        }}
        onDidTriggerAutoPausePlay={(why) => {
          setEvents((prev) => [...prev, `onDidTriggerAutoPausePlay: ${why}`]);
        }}
        onDidTriggerMediaClipLoaded={(mediaClip) => {
          setEvents((prev) => [
            ...prev,
            `onDidTriggerMediaClipLoaded: ${mediaClip.id}`,
          ]);
        }}
        onDidTriggerMediaClipFailed={() => {
          setEvents((prev) => [...prev, "onDidTriggerMediaClipFailed"]);
        }}
        onDidTriggerCanPlay={() => {
          setEvents((prev) => [...prev, "onDidTriggerCanPlay"]);
        }}
        onDidTriggerCustomStatistics={(_) => {
          setEvents((prev) => [...prev, "onDidTriggerCustomStatistics"]);
        }}
        onDidTriggerDurationChange={(duration) => {
          setEvents((prev) => [
            ...prev,
            `onDidTriggerDurationChange: ${duration}`,
          ]);
        }}
        onDidTriggerEnded={() => {
          setEvents((prev) => [...prev, "onDidTriggerEnded"]);
        }}
        onDidTriggerFullscreen={() => {
          setEvents((prev) => [...prev, "onDidTriggerFullscreen"]);
        }}
        onDidTriggerModeChange={(mode) => {
          setEvents((prev) => [...prev, `onDidTriggerModeChange: ${mode}`]);
        }}
        onDidTriggerPause={() => {
          setEvents((prev) => [...prev, "onDidTriggerPause"]);
        }}
        onDidTriggerPhaseChange={(phase) => {
          console.log("phase", phase);
          setEvents((prev) => [...prev, `onDidTriggerPhaseChange: ${phase}`]);
        }}
        onDidTriggerPlay={() => {
          setEvents((prev) => [...prev, "onDidTriggerPlay"]);
        }}
        onDidTriggerPlaying={() => {
          setEvents((prev) => [...prev, "onDidTriggerPlaying"]);
        }}
        onDidTriggerProjectLoaded={(_) => {
          setEvents((prev) => [...prev, "onDidTriggerProjectLoaded"]);
        }}
        onDidTriggerRetractFullscreen={() => {
          setEvents((prev) => [...prev, "onDidTriggerRetractFullscreen"]);
        }}
        onDidTriggerSeeked={(position) => {
          setEvents((prev) => [...prev, `onDidTriggerSeeked: ${position}`]);
        }}
        onDidTriggerSeeking={() => {
          setEvents((prev) => [...prev, "onDidTriggerSeeking"]);
        }}
        onDidTriggerStall={() => {
          setEvents((prev) => [...prev, "onDidTriggerStall"]);
        }}
        onDidTriggerStateChange={(state) => {
          setEvents((prev) => [...prev, `onDidTriggerStateChange: ${state}`]);
        }}
        onDidTriggerViewFinished={() => {
          setEvents((prev) => [...prev, "onDidTriggerViewFinished"]);
        }}
        onDidTriggerViewStarted={() => {
          setEvents((prev) => [...prev, "onDidTriggerViewStarted"]);
        }}
        onDidTriggerVolumeChange={(volume) => {
          setEvents((prev) => [...prev, `onDidTriggerVolumeChange: ${volume}`]);
        }}
      />
      <View style={styles.textContainer}>
        <Text style={styles.text}>{apiProperties}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Play" onPress={() => playerRef.current?.play()} />
        <Button title="Pause" onPress={() => playerRef.current?.pause()} />
        <Button
          title="Mute"
          onPress={() => playerRef.current?.setMuted(true)}
        />
        <Button
          title="Unmute"
          onPress={() => playerRef.current?.setMuted(false)}
        />
        <Button
          title="Fullscreen"
          onPress={() => playerRef.current?.enterFullscreen()}
        />
        <Button
          title="getAdClipData"
          onPress={async () => {
            const adMediaClip = await playerRef.current?.adMediaClip();
            console.log("adMediaClip", adMediaClip);
            setApiProperties(`AdMediaClipId: ${adMediaClip?.id}`);
          }}
        />
        <Button
          title="getDuration"
          onPress={async () => {
            const duration = await playerRef.current?.duration();
            setApiProperties(`Duration: ${duration}`);
          }}
        />
        <Button
          title="getAdMediaHeight"
          onPress={async () => {
            const adMediaHeight = await playerRef.current?.adMediaHeight();
            setApiProperties(`AdMediaHeight: ${adMediaHeight}`);
          }}
        />
        <Button
          title="getAdMediaWidth"
          onPress={async () => {
            const adMediaWidth = await playerRef.current?.adMediaWidth();
            setApiProperties(`AdMediaWidth: ${adMediaWidth}`);
          }}
        />
        <Button
          title="getMuted"
          onPress={async () => {
            const muted = await playerRef.current?.muted();
            setApiProperties(`Muted: ${muted}`);
          }}
        />
        <Button
          title="getPhase"
          onPress={async () => {
            const phase = await playerRef.current?.phase();
            setApiProperties(`Phase: ${phase}`);
          }}
        />
        <Button
          title="getPlayOutData"
          onPress={async () => {
            const playoutData = await playerRef.current?.playoutData();
            setApiProperties(`PlayoutDataId: ${playoutData?.id}`);
          }}
        />
        <Button
          title="getProjectData"
          onPress={async () => {
            const projectData = await playerRef.current?.projectData();
            console.log("projectData", projectData);
            setApiProperties(`ProjectDataId: ${projectData?.id}`);
          }}
        />
        <Button
          title="getState"
          onPress={async () => {
            const state = await playerRef.current?.playerState();
            setApiProperties(`State: ${state}`);
          }}
        />
        <Button
          title="getMode"
          onPress={async () => {
            const mode = await playerRef.current?.mode();
            setApiProperties(`Mode: ${mode}`);
          }}
        />
      </View>

      <ScrollView
        style={styles.textContainer}
        ref={scrollViewRef}
        onContentSizeChange={(_, contentHeight) => {
          scrollViewRef.current?.scrollTo({ y: contentHeight });
        }}
      >
        {events.map((event, index) => (
          <View
            key={event + index}
            style={{ backgroundColor: index % 2 ? "#fff" : "#eee" }}
          >
            <Text style={styles.text}>{event}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eee",
    padding: 12,
  },
  textContainer: {
    backgroundColor: "#fff",
    marginVertical: 8,
  },
  text: {
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 2,
  },
});
