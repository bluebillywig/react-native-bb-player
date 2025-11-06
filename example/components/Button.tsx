import { Text, TouchableOpacity } from "react-native";

export default function Button({title, onPress}: {title: string; onPress: () => void}) {
  return (
<TouchableOpacity style={{ height: 28, backgroundColor: 'blue', justifyContent: 'center', paddingHorizontal: 4, borderRadius: 6 }} onPress={onPress}>
    <Text style={{color: '#fff'}}>{title}</Text>
</TouchableOpacity>
  );
}