import {
  View,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Image,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { defaultStyles } from "@/constants/Styles";
import { Redirect, Stack } from "expo-router";
import HeaderDropDown from "@/components/header-drop-down";
import MessageInput from "@/components/message-input";
import MessagesIdea from "@/components/messages-idea";
import { Message, Role } from "@/utils/interfaces";
import { FlashList } from "@shopify/flash-list";
import ChatMessages from "@/components/chat-messages";
import { useMMKVString } from "react-native-mmkv";
import { keyStorage, Storage } from "@/utils/storage";
import OpenAI from "react-native-openai";
const Page = () => {
  const [gptVersion, setGptVersion] = useMMKVString("gptVersion", Storage);
  const [height, setHeight] = useState(0);
  const [key, setKey] = useMMKVString("apikey", keyStorage);
  const [organization, setOrganization] = useMMKVString("org", keyStorage);
  const [messages, setMessages] = useState<Message[]>([]);

  if (!key || key === "" || !organization || organization === "") {
    return <Redirect href={"/(auth)/(modal)/settings"} />;
  }
  const onLayout = (event: any) => {
    const { height } = event.nativeEvent.layout;
    setHeight(height);
  };
  const openAI = useMemo(() => new OpenAI({ apiKey: key, organization }), []);
  const getCompletion = async (message: string) => {
    if (messages.length === 0) {
      //TODO:Create chat later store to db,
    }
    setMessages([
      ...messages,
      { content: message, role: Role.User },
      { role: Role.Bot, content: "" },
    ]);
    openAI.chat.stream({
      messages: [{ role: "user", content: message }],
      model: gptVersion === "4" ? "gpt-4" : "gpt-3.5-turbo",
    });
  };
  useEffect(() => {
    const handleMessage = (payload: any) => {
      setMessages((messages) => {
        const newMessage = payload.choices[0]?.delta.content;
        if (newMessage) {
          messages[messages.length - 1].content += newMessage;
          return [...messages];
        }
        if (payload.choices[0]?.finishReason) {
          //Save the Message
          console.log("Stream Ended");
        }
        return messages;
      });
    };
    openAI.chat.addListener("onChatMessageReceived", handleMessage);
    return () => {
      openAI.chat.removeListener("onChatMessageReceived");
    };
  }, [openAI]);
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
