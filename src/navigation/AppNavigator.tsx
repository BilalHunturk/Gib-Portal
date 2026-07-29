import React, { useMemo } from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { LoginScreen } from "../screens/LoginScreen";
import { InvoiceListScreen } from "../screens/InvoiceListScreen";
import { InvoiceDraftScreen } from "../screens/InvoiceDraftScreen";
import { GibService } from "../services/gibService";

export type RootStackParamList = {
  Login: undefined;
  InvoiceList: undefined;
  InvoiceDraft: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

type Props = {
  gib: GibService;
  loggedIn: boolean;
  autoLoginFailed: boolean;
  onLoggedIn: () => void;
  onLogout: () => void;
};

export function AppNavigator({
  gib,
  loggedIn,
  autoLoginFailed,
  onLoggedIn,
  onLogout,
}: Props) {
  const linking = useMemo(
    () => ({
      prefixes: ["gibportal://", "https://gibportal.example.com"],
      config: {
        screens: {
          Login: "login",
          InvoiceList: "invoices",
          InvoiceDraft: "draft",
        },
      },
    }),
    []
  );

  return (
    <SafeAreaProvider>
      <NavigationContainer
        linking={linking}
        theme={{
          ...DefaultTheme,
          colors: {
            ...DefaultTheme.colors,
            background: "#f4f6f8",
          },
        }}
      >
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!loggedIn ? (
            <Stack.Screen name="Login">
              {() => (
                <LoginScreen
                  gib={gib}
                  onLoggedIn={onLoggedIn}
                  autoLoginFailed={autoLoginFailed}
                />
              )}
            </Stack.Screen>
          ) : (
            <>
              <Stack.Screen name="InvoiceList">
                {({ navigation }) => (
                  <InvoiceListScreen
                    gib={gib}
                    onLogout={() => {
                      onLogout();
                    }}
                    onCreateDraft={() => navigation.navigate("InvoiceDraft")}
                  />
                )}
              </Stack.Screen>
              <Stack.Screen name="InvoiceDraft">
                {({ navigation }) => (
                  <InvoiceDraftScreen gib={gib} onBack={() => navigation.goBack()} />
                )}
              </Stack.Screen>
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
