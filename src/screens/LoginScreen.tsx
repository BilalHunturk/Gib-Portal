import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { GibService } from "../services/gib";

const REMEMBER_KEY = "gib_remember_me";
const USERNAME_KEY = "gib_username";
const PASSWORD_KEY = "gib_password";

type Props = {
  gib: GibService;
  onLoggedIn: () => void;
  autoLoginFailed?: boolean;
};

export function LoginScreen({ gib, onLoggedIn, autoLoginFailed }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (autoLoginFailed) {
      setError("Otomatik giriş başarısız. Lütfen tekrar deneyin.");
      loadSavedCredentialsForDisplay();
    }
  }, [autoLoginFailed]);

  async function loadSavedCredentialsForDisplay() {
    try {
      const savedRemember = await SecureStore.getItemAsync(REMEMBER_KEY);
      if (savedRemember === "true") {
        const savedUsername = await SecureStore.getItemAsync(USERNAME_KEY);
        const savedPassword = await SecureStore.getItemAsync(PASSWORD_KEY);
        setRememberMe(true);
        setUsername(savedUsername ?? "");
        setPassword(savedPassword ?? "");
      }
    } catch {
      // Ignore errors
    }
  }

  async function saveCredentialsIfNeeded() {
    if (rememberMe) {
      await SecureStore.setItemAsync(REMEMBER_KEY, "true");
      await SecureStore.setItemAsync(USERNAME_KEY, username.trim());
      await SecureStore.setItemAsync(PASSWORD_KEY, password.trim());
    } else {
      await SecureStore.deleteItemAsync(REMEMBER_KEY);
      await SecureStore.deleteItemAsync(USERNAME_KEY);
      await SecureStore.deleteItemAsync(PASSWORD_KEY);
    }
  }

  async function handleLogin() {
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Kullanıcı kodu ve parola giriniz.");
      return;
    }

    try {
      setLoading(true);
      await gib.login(username.trim(), password.trim());
      await saveCredentialsIfNeeded();
      onLoggedIn();
    } catch (err: any) {
      setError(err?.message ?? "Giriş sırasında hata oluştu.");
    } finally {
      setLoading(false);
    }
  }



  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.card}>
        <Text style={styles.title}>GİB Fatura Mobil</Text>
        <Text style={styles.subtitle}>
          GİB e-Arşiv Portal kullanıcı bilgilerinizle giriş yapın.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="GİB Kullanıcı Kodu"
          placeholderTextColor="#999"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Parola"
          placeholderTextColor="#999"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
          autoCapitalize="none"
        />

        <View style={styles.rememberRow}>
          <View>
            <Text style={styles.rememberTitle}>Beni hatırla</Text>
            <Text style={styles.rememberNote}>
              Bilgiler cihazda güvenli alanda saklanır.
            </Text>
          </View>

          <Switch value={rememberMe} onValueChange={setRememberMe} />
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Pressable
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Giriş Yap</Text>
          )}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6f8",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
  },
  subtitle: {
    color: "#666",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    backgroundColor: "#fff",
    color: "#000",
  },
  rememberRow: {
    marginTop: 4,
    paddingVertical: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rememberTitle: {
    fontWeight: "700",
  },
  rememberNote: {
    color: "#777",
    fontSize: 12,
    marginTop: 2,
  },
  error: {
    color: "#b00020",
  },
  button: {
    backgroundColor: "#1f6feb",
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
    marginTop: 4,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});