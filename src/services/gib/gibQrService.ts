export class GibQrService {
  async injectGibQrCodeIntoHtml(html: string) {
    const qrValue = this.extractQrValueFromHtml(html);

    if (!qrValue) {
      return html;
    }

    const QRCode = await import("qrcode");

    const qrSvg = await QRCode.default.toString(qrValue, {
      type: "svg",
      errorCorrectionLevel: "H",
      margin: 0,
      width: 220,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    });

    const qrDataUri = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(qrSvg)}`;

    const qrImageHtml = `
      <img
        src="${qrDataUri}"
        alt="QR Kod"
        style="width:220px;height:220px;display:block;"
      />
    `;

    let updatedHtml = html.replace(
      /<div\b([^>]*\bid=["']qrcode["'][^>]*)>\s*<\/div>/i,
      `<div $1>${qrImageHtml}</div>`
    );

    if (updatedHtml === html) {
      updatedHtml = html.replace(
        /<div\b(?=[^>]*\bid=["']qrcode["'])[^>]*>[\s\S]*?<\/div>/i,
        `<div id="qrcode">${qrImageHtml}</div>`
      );
    }

    return updatedHtml;
  }

  private extractQrValueFromHtml(html: string) {
    const match = html.match(
      /<div\b(?=[^>]*\bid=["']qrvalue["'])[^>]*>([\s\S]*?)<\/div>/i
    );

    if (!match?.[1]) {
      return null;
    }

    return this.decodeHtmlEntities(match[1])
      .replace(/\s+/g, " ")
      .trim();
  }

  private decodeHtmlEntities(value: string) {
    return value
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">");
  }
}