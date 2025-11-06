import { type ParamListBase, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as React from "react";
import { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import Card from "../components/Card";

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const [text, onChangeText] = useState("https://demo.bbvms.com/a/native_sdk_outstream.json");

  return (
    <View style={styles.container}>
      <Card label="Api + Outstream player" onPress={() => navigation.navigate("Api")} color="pink" />
      <Card
        label="Outstream Player"
        onPress={() =>
          navigation.navigate("OutstreamPlayer", {
            jsonUrl: text,
          })
        }
        color="green">
        <TextInput style={styles.input} onChangeText={onChangeText} value={text} multiline />
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: "row" },
  input: {
    borderRadius: 10,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    fontSize: 14,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
});
