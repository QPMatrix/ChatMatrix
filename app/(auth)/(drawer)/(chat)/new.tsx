import { View, Text, Button } from "react-native";
import React from "react";
import { useAuth } from "@clerk/clerk-expo";
import { defaultStyles } from "@/constants/Styles";
import { Stack } from "expo-router";
import HeaderDropDown from "@/components/header-drop-down";

const Page = () => {
  const { signOut } = useAuth();
  const [gptVersion, setGptVersion] = React.useState("3.5");
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
      <Button title="Sign Out" onPress={() => signOut()} />
    </View>
  );
};

export default Page;
