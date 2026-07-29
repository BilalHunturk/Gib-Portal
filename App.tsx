import React, { useMemo, useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { View, ActivityIndicator, Text } from "react-native";
import * as SecureStore from "expo-secure-store";

import { LoginScreen } from "./src/screens/LoginScreen";
import { InvoiceListScreen } from "./src/screens/InvoiceListScreen";
// import { CreateDraftTestScreen } from "./src/screens/CreateDraftTestScreen";
import { InvoiceDraftScreen } from "./src/screens/InvoiceDraftScreen";
import { GibService } from "./src/services/gib";

const REMEMBER_KEY = "gib_remember_me";
const USERNAME_KEY = "gib_username";
const PASSWORD_KEY = "gib_password";

type AppScreen = "list" | "draft";

export default function App() {
  const gib = useMemo(() => new GibService(), []);

  const [loggedIn, setLoggedIn] = useState(false);
  const [screen, setScreen] = useState<AppScreen>("list");
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
            setScreen("list");
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
    setScreen("list");
  }

  function handleLogout() {
    setLoggedIn(false);
    setAutoLoginFailed(false);
    setScreen("list");
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

  if (!loggedIn) {
    return (
      <>
        <StatusBar style="dark" />
        <LoginScreen
          gib={gib}
          onLoggedIn={handleLoggedIn}
          autoLoginFailed={autoLoginFailed}
        />
      </>
    );
  }

  if (screen === "draft") {
    return (
      <>
        <StatusBar style="dark" />
        <InvoiceDraftScreen
          gib={gib}
          onBack={() => setScreen("list")}
        />
      </>
    );
  }

  return (
    <>
      <StatusBar style="dark" />
      <InvoiceListScreen
        gib={gib}
        onLogout={handleLogout}
        onCreateDraft={() => setScreen("draft")}
      />
    </>
  );
}