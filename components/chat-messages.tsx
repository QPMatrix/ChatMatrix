import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";
import { Message, Role } from "@/utils/interfaces";

const ChatMessages = ({ content, role, imageUrl, prompt }: Message) => {
  return (
    <View style={styles.row}>
      {role === Role.Bot ? (
        <View style={[styles.item]}>
          <Image
            source={require("@/assets/images/logo-white.png")}
            style={styles.btnImage}
          />
        </View>
      ) : (
        <Image
          source={{ uri: "https://www.qpmatrix.tech/favicon.ico" }}
          style={styles.avatar}
        />
      )}
      <Text style={styles.text}>{content}</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 14,
    gap: 14,
    marginVertical: 12,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#000",
  },
  btnImage: {
    margin: 6,
    width: 16,
    height: 16,
  },
  item: {
    borderRadius: 15,
    overflow: "hidden",
    backgroundColor: "#000",
  },
  text: {
    padding: 4,
    fontSize: 16,
    flexWrap: "wrap",
    flex: 1,
  },
});
export default ChatMessages;
