import * as SecureStore from "expo-secure-store";
import { GibClient, USE_TEST_ENV } from "./gibClient";

const ACTIVE_TOKEN_KEY = USE_TEST_ENV
  ? "gib_active_token_test"
  : "gib_active_token_prod";

export class GibAuthService {
  constructor(private client: GibClient) {}

  async login(username: string, password: string) {
    await this.logoutStoredTokenIfExists();

    const data = await this.client.postAssosLogin({
      assoscmd: USE_TEST_ENV ? "login" : "anologin",
      userid: username,
      sifre: password,
      sifre2: password,
      parola: password,
    });

    if (!data?.token) {
      if (data?.error) {
        throw new Error(this.getLoginErrorMessage(String(data.error)));
      }

      if (!data || Object.keys(data).length === 0) {
        throw new Error("Kullanıcı adı veya parola yanlış. Lütfen tekrar deneyin.");
      }

      throw new Error("GİB giriş başarısız. Lütfen bilgilerinizi kontrol edin.");
    }

    const token = String(data.token);

    this.client.setToken(token);

    // Amaç: Uygulama kapanırsa sonraki girişte eski token'ı kapatmayı denemek.
    await SecureStore.setItemAsync(ACTIVE_TOKEN_KEY, token);

    return token;
  }

  async logout() {
    const activeToken =
      this.client.getToken() ?? (await SecureStore.getItemAsync(ACTIVE_TOKEN_KEY));

    if (!activeToken) {
      this.client.clearToken();
      await SecureStore.deleteItemAsync(ACTIVE_TOKEN_KEY);
      return;
    }

    try {
      await this.client.logoutByToken(activeToken);
    } finally {
      this.client.clearToken();
      await SecureStore.deleteItemAsync(ACTIVE_TOKEN_KEY);
    }
  }

  private async logoutStoredTokenIfExists() {
    const storedToken = await SecureStore.getItemAsync(ACTIVE_TOKEN_KEY);

    if (!storedToken) {
      return;
    }

    try {
      await this.client.logoutByToken(storedToken);
    } catch {
      // Eski token GİB tarafında zaten düşmüş olabilir.
      // Yeni giriş denemesini engellememek için hatayı yutmamız daha doğru.
    } finally {
      await SecureStore.deleteItemAsync(ACTIVE_TOKEN_KEY);
    }
  }

  private getLoginErrorMessage(errorCode: string) {
    const errorMessages: Record<string, string> = {
      INVALID_CREDENTIALS: "Kullanıcı adı veya parola yanlış.",
      INVALID_USERNAME: "Kullanıcı adı bulunamadı.",
      INVALID_PASSWORD: "Parola yanlış.",
      ACCOUNT_LOCKED: "Hesabınız kilitli. Lütfen GİB destek hattı ile iletişime geçin.",
      USER_NOT_FOUND: "Bu kullanıcı adı sistemde bulunamadı.",
      ACCESS_DENIED: "Erişim reddedildi. Lütfen yetkiniz olup olmadığını kontrol edin.",
    };

    return (
      errorMessages[errorCode] ||
      "Kullanıcı adı veya parola yanlış. Lütfen tekrar deneyin."
    );
  }
}