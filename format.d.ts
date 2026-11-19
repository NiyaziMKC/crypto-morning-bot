/**
 * Mesaj formatlama yardımcıları - Telegram MarkdownV2 uyumlu
 * MarkdownV2 özel karakterleri: _ * [ ] ( ) ~ ` > # + - = | { } . !
 */
/**
 * MarkdownV2 için özel karakterleri kaçırır
 */
export declare function escapeMarkdownV2(text: string): string;
/**
 * Sayıyı binlik ayırıcı ile formatlar (TRY/USD için)
 */
export declare function formatNumber(num: number, decimals?: number): string;
/**
 * Büyük sayıları kısaltır (1.2M, 3.4B, vb.)
 */
export declare function formatCompactNumber(num: number): string;
/**
 * Yüzde değişimi formatlar (emoji ile)
 */
export declare function formatChange(change: number): {
    text: string;
    emoji: string;
};
/**
 * Fiyat formatı (USD)
 */
export declare function formatPrice(price: number): string;
/**
 * Market cap formatı
 */
export declare function formatMarketCap(cap: number): string;
/**
 * Dominans formatı
 */
export declare function formatDominance(dom: number): string;
/**
 * Ana rapor mesajını oluşturur (MarkdownV2)
 */
export declare function buildReportMessage(data: {
    date: string;
    time: string;
    btc: {
        price: number;
        change24h: number;
        marketCap: number;
        dominance: number;
    };
    eth: {
        price: number;
        change24h: number;
        marketCap: number;
        dominance: number;
    };
    totalMarketCap: number;
    totalVolume24h: number;
    fearGreed: {
        value: number;
        classification: string;
    };
    summary: string;
    disclaimer: string;
}): string;
/**
 * Basit hata mesajı
 */
export declare function buildErrorMessage(error: string): string;
//# sourceMappingURL=format.d.ts.map