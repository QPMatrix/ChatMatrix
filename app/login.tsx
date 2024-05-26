import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { defaultStyles } from "@/constants/Styles";
import Colors from "@/constants/Colors";
import { useSignIn, useSignUp } from "@clerk/clerk-expo";

const Page = () => {
  const { type } = useLocalSearchParams<{ type: string }>();
  const { signUp, isLoaded, setActive } = useSignUp();
  const {
    signIn,
    isLoaded: signInLoaded,
    setActive: setSignInActive,
  } = useSignIn();
  const [loading, setLoading] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const onSignUpPress = async () => {
    if (!signUp) return;
    setLoading(true);
    try {
      const result = await signUp.create({
        emailAddress,
        password,
      });
      setActive({
        session: result.createdSessionId,
      });
    } catch (error: any) {
      console.error(error);
      Alert.alert("Error", error.errors[0].message);
    } finally {
      setLoading(false);
    }
  };
  const onSignInPress = async () => {
    if (!signIn) return;
    setLoading(true);
    try {
      const result = await signIn.create({
        identifier: emailAddress,
        password,
      });
      setSignInActive({
        session: result.createdSessionId,
      });
    } catch (error: any) {
      console.error(error);
      Alert.alert("Error", error.errors[0].message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={70}
      style={[styles.container]}
    >
      {loading && (
        <View style={defaultStyles.loadingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}
      <Image
        source={require("../assets/images/logo-dark.png")}
        style={styles.logo}
      />
      <Text style={styles.title}>
        {type === "login" ? "Welcome back" : "Create your account"}
      </Text>
      <View style={{ marginBottom: 30 }}>
        <TextInput
          autoCapitalize="none"
          placeholder="Email"
          style={styles.inputField}
          value={emailAddress}
          onChangeText={setEmailAddress}
        />
        <TextInput
          autoCapitalize="none"
          placeholder="Password"
          style={styles.inputField}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>
      {type === "login" ? (
        <TouchableOpacity
          onPress={onSignInPress}
          style={[defaultStyles.btn, styles.btnPrimary]}
        >
          <Text style={styles.btnPrimaryText}>Login</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={onSignUpPress}
          style={[defaultStyles.btn, styles.btnPrimary]}
        >
          <Text style={styles.btnPrimaryText}>Create Account</Text>
        </TouchableOpacity>
      )}
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  logo: {
    width: 60,
    height: 60,
    alignSelf: "center",
    marginVertical: 80,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  inputField: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 12,
    padding: 10,
    backgroundColor: "#fff",
  },
  btnPrimary: {
    backgroundColor: Colors.primary,
    marginVertical: 4,
  },
  btnPrimaryText: {
    color: "#fff",
    fontSize: 16,
  },
});
export default Page;
