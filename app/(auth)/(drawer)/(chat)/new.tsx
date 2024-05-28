import {
  View,
  Text,
  Button,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Image,
} from "react-native";
import React from "react";
import { useAuth } from "@clerk/clerk-expo";
import { defaultStyles } from "@/constants/Styles";
import { Stack } from "expo-router";
import HeaderDropDown from "@/components/header-drop-down";
import MessageInput from "@/components/message-input";
import MessagesIdea from "@/components/messages-idea";
import { Message, Role } from "@/utils/interfaces";
import { FlashList } from "@shopify/flash-list";
import ChatMessages from "@/components/chat-messages";
const DUMMY_MESSAGES: Message[] = [
  {
    content: "Hello how  I can help you today?",
    role: Role.Bot,
  },
  {
    content: "I need help with my React Native project. Can you help me?",
    role: Role.User,
  },
];
const Page = () => {
  const { signOut } = useAuth();
  const [gptVersion, setGptVersion] = React.useState("3.5");
  const [messages, setMessages] = React.useState<Message[]>(DUMMY_MESSAGES);
  const [height, setHeight] = React.useState(0);
  const getCompletion = async (message: string) => {
    console.log("Message:", message);
  };
  const onLayout = (event: any) => {
    const { height } = event.nativeEvent.layout;
    setHeight(height);
  };
  return (
    <View style={defaultStyles.pageContainer}>
      <Stack.Screen
        options={{
          headerTitle: () => (
            <HeaderDropDown
              title="ChatMatrix"
              items={[
                {
                  key: "3.5",
                  title: "GPT-3.5",
                  icon: "bolt",
                },
                {
                  key: "4",
                  title: "GPT-4",
                  icon: "sparkles",
                },
              ]}
              onSelect={(key) => setGptVersion(key)}
              selected={gptVersion}
            />
          ),
        }}
      />
      <View style={{ flex: 1 }} onLayout={onLayout}>
        {messages.length === 0 && (
          <View style={[styles.logoContainer, { marginTop: height / 2 - 100 }]}>
            <Image
              source={require("@/assets/images/logo-white.png")}
              style={styles.image}
            />
          </View>
        )}
        <FlashList
          data={messages}
          renderItem={({ item }) => <ChatMessages {...item} />}
          estimatedItemSize={400}
          contentContainerStyle={{ paddingBottom: 150, paddingTop: 30 }}
          keyExtractor={(_, index) => index.toString()}
          keyboardDismissMode="on-drag"
        />
      </View>
      <KeyboardAvoidingView
        keyboardVerticalOffset={70}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
        }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {messages.length === 0 && <MessagesIdea onSelectCard={getCompletion} />}

        <MessageInput onShouldSend={getCompletion} />
      </KeyboardAvoidingView>
    </View>
  );
};
const styles = StyleSheet.create({
  logoContainer: {
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 60,
    backgroundColor: "#000",
    borderRadius: 50,
  },
  image: {
    width: 40,
    height: 40,
    resizeMode: "cover",
  },
});
export default Page;
