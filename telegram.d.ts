/**
 * Telegram Bot API ile mesaj gönderir
 * Telegraf kütüphanesi kullanılarak
 */
/**
 * Formatlanmış rapor mesajını gönderir (MarkdownV2)
 */
export declare function sendReport(message: string): Promise<boolean>;
/**
 * Hata mesajı gönderir
 */
export declare function sendError(error: string): Promise<boolean>;
/**
 * Bağlantı testi - bot bilgilerini alır
 */
export declare function testConnection(): Promise<{
    ok: boolean;
    info?: any;
    error?: string;
}>;
/**
 * Bot'u durdurur (graceful shutdown için)
 */
export declare function stopBot(): void;
//# sourceMappingURL=telegram.d.ts.map