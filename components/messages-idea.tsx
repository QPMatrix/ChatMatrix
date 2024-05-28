import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React from "react";
import Colors from "@/constants/Colors";
const PredefinedMessages = [
  { title: "Explain React Native", text: "like I'm five years old" },
  { title: "Suggest fun activities", text: "for a group of friends" },
  { title: "Recommend a book", text: "for a beginner programmer" },
];
type Props = {
  onSelectCard: (message: string) => void;
};
const MessagesIdea = ({ onSelectCard }: Props) => {
  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingVertical: 10,
          gap: 16,
        }}
      >
        {PredefinedMessages.map((message, index) => (
          <TouchableOpacity
            style={styles.card}
            key={index}
            onPress={() => onSelectCard(`${message.title} ${message.text}`)}
          >
            <Text style={{ fontSize: 16, fontWeight: "500" }}>
              {message.title}
            </Text>
            <Text style={{ fontSize: 14, color: Colors.grey }}>
              {message.text}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  card: {
    padding: 14,
    borderRadius: 10,
    backgroundColor: Colors.input,
  },
});
export default MessagesIdea;
