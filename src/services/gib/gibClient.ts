import axios from "axios";

export const USE_TEST_ENV = true; // true yaparak test ortamına geçiş yapabilirsiniz. Test ortamında gerçek fatura sorgulaması yapılamaz, sadece giriş testi yapılabilir.

export const BASE_URL = USE_TEST_ENV
  ? "https://earsivportaltest.efatura.gov.tr"
  : "https://earsivportal.efatura.gov.tr";

type FormValue = string | number | boolean | null | undefined;

function toFormUrlEncoded(data: Record<string, FormValue>) {
  return Object.entries(data)
    .map(([key, value]) => {
      return `${encodeURIComponent(key)}=${encodeURIComponent(
        String(value ?? "")
      )}`;
    })
    .join("&");
}

function makeCallId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export class GibClient {
  private token: string | null = null;

  getToken() {
    return this.token;
  }

  setToken(token: string) {
    this.token = token;
  }

  clearToken() {
    this.token = null;
  }

  isLoggedIn() {
    return Boolean(this.token);
  }

  async postAssosLogin(params: Record<string, FormValue>) {
    return this.postForm("/earsiv-services/assos-login", params, 30000);
  }

  async logoutByToken(token: string) {
    return this.postAssosLogin({
      assoscmd: "logout",
      token,
    });
  }

  async dispatch(
    cmd: string,
    pageName: string,
    payload: Record<string, any>
  ) {
    if (!this.token) {
      throw new Error("Token yok. Önce giriş yapılmalı.");
    }

    const data = await this.postForm(
      "/earsiv-services/dispatch",
      {
        callid: makeCallId(),
        token: this.token,
        cmd,
        pageName,
        jp: JSON.stringify(payload ?? {}),
      },
      30000
    );

    if (data?.error) {
      throw new Error(`GİB hata döndürdü: ${JSON.stringify(data.error)}`);
    }

    return data;
  }

  buildDownloadUrl(params: {
    ettn: string;
    onayDurumu: string;
    belgeTip: string;
  }) {
    if (!this.token) {
      throw new Error("Token yok. Önce giriş yapılmalı.");
    }

    if (!params.ettn) {
      throw new Error("Belge ETTN bilgisi bulunamadı.");
    }

    const query = new URLSearchParams({
      token: this.token,
      ettn: params.ettn,
      onayDurumu: params.onayDurumu || "Onaylandı",
      belgeTip: params.belgeTip || "FATURA",
      cmd: "EARSIV_PORTAL_BELGE_INDIR",
    });

    return `${BASE_URL}/earsiv-services/download?${query.toString()}`;
  }

  private async postForm(
    path: string,
    params: Record<string, FormValue>,
    timeout: number
  ) {
    const url = `${BASE_URL}${path}`;

    try {
      const response = await axios.post(url, toFormUrlEncoded(params), {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
        timeout,
      });

      return response.data;
    } catch (error: any) {
      if (
        error.code === "ECONNABORTED" ||
        error.message?.includes("timeout")
      ) {
        throw new Error(
          "Bağlantı zaman aşımına uğradı. İnternet bağlantınızı kontrol edin."
        );
      }

      if (
        error.message?.includes("Network Error") ||
        error.code === "ERR_NETWORK"
      ) {
        throw new Error(
          "İnternet bağlantısı hatası. Lütfen bağlantınızı kontrol edin."
        );
      }

      throw error;
    }
  }
}