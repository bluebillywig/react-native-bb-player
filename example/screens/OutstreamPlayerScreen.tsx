import type { StaticScreenProps } from "@react-navigation/native";
import { ExpoBBPlayerView, type ExpoBBPlayerViewType } from "expo-bb-player";
import React, { useRef } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

type Props = StaticScreenProps<{
  jsonUrl: string;
}>;

export default function OutstreamPlayer({ route }: Props) {
  const { jsonUrl } = route.params;
  const ref = useRef<ExpoBBPlayerViewType>(null);
  const options = {
    allowCollapseExpand: true,
    autoPlay: false,
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text
          style={{
            ...styles.text,
            backgroundColor: "lightgrey",
          }}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Diam ut
          venenatis tellus in metus vulputate. Bibendum est ultricies integer
          quis auctor elit sed vulputate mi. Eros in cursus turpis massa
          tincidunt dui ut. Velit laoreet id donec ultrices tincidunt arcu non
          sodales neque. Adipiscing bibendum est ultricies integer quis. Sit
          amet cursus sit amet. Lorem ipsum dolor sit amet, consectetur
          adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Diam ut venenatis tellus in metus vulputate. Bibendum
          est ultricies integer quis auctor elit sed vulputate mi. Eros in
          cursus turpis massa tincidunt dui ut. Velit laoreet id donec ultrices
          tincidunt arcu non sodales neque. Adipiscing bibendum est ultricies
          integer quis. Sit amet cursus sit amet. Malesuada proin libero nunc
          consequat interdum varius sit amet mattis. Sem integer vitae justo
          eget. Sed risus ultricies tristique nulla aliquet enim tortor at.
          Adipiscing enim eu turpis egestas. Felis bibendum ut tristique et
          egestas. Bibendum neque egestas congue quisque egestas. Augue lacus
          viverra vitae congue eu consequat. Vel orci porta non pulvinar neque
          laoreet suspendisse interdum consectetur. Facilisis leo vel fringilla
          est. Nisl purus in mollis nunc sed id semper risus. Vel fringilla est
          ullamcorper eget nulla. Odio morbi quis commodo odio aenean sed
          adipiscing diam. Sagittis id consectetur purus ut. Vestibulum lorem
          sed risus ultricies tristique. Tellus in metus vulputate eu
          scelerisque felis imperdiet proin fermentum. Feugiat in fermentum
          posuere urna nec. A diam maecenas sed enim ut. Cursus mattis molestie
          a iaculis at erat pellentesque adipiscing. Sit amet consectetur
          adipiscing elit pellentesque habitant. Nisl nunc mi ipsum faucibus
          vitae aliquet nec. Ullamcorper eget nulla facilisi etiam dignissim.
          Vitae semper quis lectus nulla at volutpat. Fames ac turpis egestas
          sed tempus urna et pharetra. Lectus quam id leo in. Faucibus a
          pellentesque sit amet. Id interdum velit laoreet id donec. Massa sed
          elementum tempus egestas. In arcu cursus euismod quis viverra nibh
          cras pulvinar mattis. Et odio pellentesque diam volutpat commodo sed
          egestas egestas fringilla. Odio morbi quis commodo odio aenean sed
          adipiscing diam.
        </Text>
        <ExpoBBPlayerView
          ref={ref}
          style={styles.player}
          jsonUrl={jsonUrl}
          options={options}
        />
        <Text style={styles.text}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Diam ut
          venenatis tellus in metus vulputate. Bibendum est ultricies integer
          quis auctor elit sed vulputate mi. Eros in cursus turpis massa
          tincidunt dui ut. Velit laoreet id donec ultrices tincidunt arcu non
          sodales neque. Adipiscing bibendum est ultricies integer quis. Sit
          amet cursus sit amet. Lorem ipsum dolor sit amet, consectetur
          adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Diam ut venenatis tellus in metus vulputate. Bibendum
          est ultricies integer quis auctor elit sed vulputate mi. Eros in
          cursus turpis massa tincidunt dui ut. Velit laoreet id donec ultrices
          tincidunt arcu non sodales neque. Adipiscing bibendum est ultricies
          integer quis. Sit amet cursus sit amet. Malesuada proin libero nunc
          consequat interdum varius sit amet mattis. Sem integer vitae justo
          eget. Sed risus ultricies tristique nulla aliquet enim tortor at.
          Adipiscing enim eu turpis egestas. Felis bibendum ut tristique et
          egestas. Bibendum neque egestas congue quisque egestas. Augue lacus
          viverra vitae congue eu consequat. Vel orci porta non pulvinar neque
          laoreet suspendisse interdum consectetur. Facilisis leo vel fringilla
          est. Nisl purus in mollis nunc sed id semper risus. Vel fringilla est
          ullamcorper eget nulla. Odio morbi quis commodo odio aenean sed
          adipiscing diam. Sagittis id consectetur purus ut. Vestibulum lorem
          sed risus ultricies tristique. Tellus in metus vulputate eu
          scelerisque felis imperdiet proin fermentum. Feugiat in fermentum
          posuere urna nec. A diam maecenas sed enim ut. Cursus mattis molestie
          a iaculis at erat pellentesque adipiscing. Sit amet consectetur
          adipiscing elit pellentesque habitant. Nisl nunc mi ipsum faucibus
          vitae aliquet nec. Ullamcorper eget nulla facilisi etiam dignissim.
          Vitae semper quis lectus nulla at volutpat. Fames ac turpis egestas
          sed tempus urna et pharetra. Lectus quam id leo in. Faucibus a
          pellentesque sit amet. Id interdum velit laoreet id donec. Massa sed
          elementum tempus egestas. In arcu cursus euismod quis viverra nibh
          cras pulvinar mattis. Et odio pellentesque diam volutpat commodo sed
          egestas egestas fringilla. Odio morbi quis commodo odio aenean sed
          adipiscing diam.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 20,
    padding: 12,
  },
  player: {
    backgroundColor: "black",
  },
});
