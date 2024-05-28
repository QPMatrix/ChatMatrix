import {
  View,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Image,
  Text,
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
import Colors from "@/constants/Colors";

const Page = () => {
  const [gptVersion, setGptVersion] = useMMKVString("gptVersion", Storage);
  const [height, setHeight] = useState(0);
  const [key, setKey] = useMMKVString("apikey", keyStorage);
  const [organization, setOrganization] = useMMKVString("org", keyStorage);
  const [messages, setMessages] = useState<Message[]>([]);
  const [working, setWorking] = useState(false);
  if (!key || key === "" || !organization || organization === "") {
    return <Redirect href={"/(auth)/(modal)/settings"} />;
  }
  const onLayout = (event: any) => {
    const { height } = event.nativeEvent.layout;
    setHeight(height);
  };
  const openAI = useMemo(() => new OpenAI({ apiKey: key, organization }), []);
  const getCompletion = async (message: string) => {
    setWorking(true);

    setMessages([...messages, { content: message, role: Role.User }]);
    const result = await openAI.image.create({
      prompt: message,
    });
    if (result.data && result.data.length > 0) {
      const imageUrl = result.data[0].url;
      setMessages((prev) => [
        ...prev,
        { role: Role.Bot, content: "", imageUrl, prompt: message },
      ]);
    }
    setWorking(false);
  };

  return (
    <View style={defaultStyles.pageContainer}>
      <Stack.Screen
        options={{
          headerTitle: () => (
            <HeaderDropDown
              title="Dall·E"
              items={[
                {
                  key: "share",
                  title: "Share GPT",
                  icon: "square.and.arrow.up",
                },
                {
                  key: "details",
                  title: "See Details",
                  icon: "info.circle",
                },
                {
                  key: "keep",
                  title: "Keep in Sidebar",
                  icon: "pin",
                },
              ]}
              onSelect={(key) => {}}
            />
          ),
        }}
      />
      <View style={{ flex: 1 }} onLayout={onLayout}>
        {messages.length === 0 && (
          <View
            style={[
              { marginTop: height / 2 - 100, alignItems: "center", gap: 16 },
            ]}
          >
            <View style={styles.logoContainer}>
              <Image
                source={require("@/assets/images/dalle.png")}
                style={styles.image}
              />
            </View>
            <Text style={styles.label}>
              Let me turn your imagination into imagery.
            </Text>
          </View>
        )}
        <FlashList
          data={messages}
          renderItem={({ item }) => <ChatMessages {...item} />}
          estimatedItemSize={400}
          contentContainerStyle={{ paddingBottom: 150, paddingTop: 30 }}
          keyExtractor={(_, index) => index.toString()}
          keyboardDismissMode="on-drag"
          ListFooterComponent={
            <>
              {working && (
                <ChatMessages
                  {...{ role: Role.Bot, content: "", loading: true }}
                />
              )}
            </>
          }
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
    width: 80,
    height: 80,
    backgroundColor: "#000",
    borderRadius: 50,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.greyLight,
  },
  image: {
    resizeMode: "cover",
  },
  page: {
    flex: 1,
  },
  label: {
    color: Colors.grey,
    fontSize: 16,
  },
});
export default Page;
