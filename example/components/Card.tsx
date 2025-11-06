import type { PropsWithChildren } from "react";
import { StyleSheet, Text, TouchableHighlight, View } from "react-native";

type CardProps = PropsWithChildren & {
  label: string;
  onPress: () => void;
  color?: string;
};

export default function Card({ children, label, onPress, color }: CardProps) {
  return (
    <TouchableHighlight onPress={onPress} style={[styles.container, { backgroundColor: color }]} activeOpacity={0.1} underlayColor="#DDDDDD">
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", width: "100%" }}>
        <View style={{ position: "absolute", top: 0, left: 0, right: 0 }}>{children}</View>
        <Text style={styles.label}>{label}</Text>
      </View>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  container: {
    aspectRatio: 16 / 10,
    borderRadius: 12,
    flex: 1,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    margin: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 18,
    color: "#000",
    textAlign: "center",
  },
});
