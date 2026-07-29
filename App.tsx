import React, { useMemo, useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { View, ActivityIndicator, Text } from "react-native";
import * as SecureStore from "expo-secure-store";

import { AppNavigator } from "./src/navigation/AppNavigator";
import { GibService } from "./src/services/gibService";

const REMEMBER_KEY = "gib_remember_me";
const USERNAME_KEY = "gib_username";
const PASSWORD_KEY = "gib_password";

export default function App() {
  const gib = useMemo(() => new GibService(), []);

  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [autoLoginFailed, setAutoLoginFailed] = useState(false);

  useEffect(() => {
    autoLoginWithSavedCredentials();
  }, []);

  async function autoLoginWithSavedCredentials() {
    try {
      const savedRemember = await SecureStore.getItemAsync(REMEMBER_KEY);

      if (savedRemember === "true") {
        const savedUsername = await SecureStore.getItemAsync(USERNAME_KEY);
        const savedPassword = await SecureStore.getItemAsync(PASSWORD_KEY);

        if (savedUsername && savedPassword) {
          try {
            await gib.login(savedUsername, savedPassword);
            setLoggedIn(true);
            return;
          } catch {
            setAutoLoginFailed(true);
          }
        }
      }
    } catch {
      setAutoLoginFailed(true);
    } finally {
      setLoading(false);
    }
  }

  function handleLoggedIn() {
    setLoggedIn(true);
    setAutoLoginFailed(false);
  }

  function handleLogout() {
    setLoggedIn(false);
    setAutoLoginFailed(false);
  }

  if (loading) {
    return (
      <>
        <StatusBar style="dark" />
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f4f6f8",
          }}
        >
          <ActivityIndicator size="large" />
          <Text style={{ marginTop: 12, color: "#666" }}>
            Kontrol ediliyor...
          </Text>
        </View>
      </>
    );
  }

  return (
    <>
      <StatusBar style="dark" />
      <AppNavigator
        gib={gib}
        loggedIn={loggedIn}
        autoLoginFailed={autoLoginFailed}
        onLoggedIn={handleLoggedIn}
        onLogout={handleLogout}
      />
    </>
  );
}