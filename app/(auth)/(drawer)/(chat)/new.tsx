import {
  View,
  Text,
  Button,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React from "react";
import { useAuth } from "@clerk/clerk-expo";
import { defaultStyles } from "@/constants/Styles";
import { Stack } from "expo-router";
import HeaderDropDown from "@/components/header-drop-down";
import MessageInput from "@/components/message-input";
import MessagesIdea from "@/components/messages-idea";
import { Message } from "@/utils/interfaces";

const Page = () => {
  const { signOut } = useAuth();
  const [gptVersion, setGptVersion] = React.useState("3.5");
  const [messages, setMessages] = React.useState<Message[]>([]);
  const getCompletion = async (message: string) => {
    console.log("Message:", message);
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
      <View style={{ flex: 1 }}>
        <Button title="Sign Out" onPress={() => signOut()} />
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

export default Page;
