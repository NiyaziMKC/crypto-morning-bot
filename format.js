/**
 * Mesaj formatlama yardımcıları - Telegram MarkdownV2 uyumlu
 * MarkdownV2 özel karakterleri: _ * [ ] ( ) ~ ` > # + - = | { } . !
 */
const MARKDOWN_V2_ESCAPE_CHARS = /[_*[\]()~`>#+-=|{}.!]/g;
/**
 * MarkdownV2 için özel karakterleri kaçırır
 */
export function escapeMarkdownV2(text) {
    return text.replace(MARKDOWN_V2_ESCAPE_CHARS, '\\$&');
}
/**
 * Sayıyı binlik ayırıcı ile formatlar (TRY/USD için)
 */
export function formatNumber(num, decimals = 2) {
    return new Intl.NumberFormat('tr-TR', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(num);
}
/**
 * Büyük sayıları kısaltır (1.2M, 3.4B, vb.)
 */
export function formatCompactNumber(num) {
    if (num >= 1e12)
        return `${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9)
        return `${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6)
        return `${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3)
        return `${(num / 1e3).toFixed(2)}K`;
    return num.toString();
}
/**
 * Yüzde değişimi formatlar (emoji ile)
 */
export function formatChange(change) {
    const sign = change >= 0 ? '+' : '';
    const emoji = change >= 0 ? '🟢' : '🔴';
    return {
        text: `${sign}${change.toFixed(2)}%`,
        emoji,
    };
}
/**
 * Fiyat formatı (USD)
 */
export function formatPrice(price) {
    if (price >= 1000) {
        return `$${formatNumber(price, 0)}`;
    }
    if (price >= 1) {
        return `$${formatNumber(price, 2)}`;
    }
    return `$${price.toFixed(4)}`;
}
/**
 * Market cap formatı
 */
export function formatMarketCap(cap) {
    return `$${formatCompactNumber(cap)}`;
}
/**
 * Dominans formatı
 */
export function formatDominance(dom) {
    return `%${dom.toFixed(1)}`;
}
/**
 * Ana rapor mesajını oluşturur (MarkdownV2)
 */
export function buildReportMessage(data) {
    const btcChange = formatChange(data.btc.change24h);
    const ethChange = formatChange(data.eth.change24h);
    const lines = [
        `📊 *Kripto Piyasa Özeti \\- ${escapeMarkdownV2(data.date)}*`,
        `_${escapeMarkdownV2(data.time)} UTC+3_\n`,
        `*🪙 Bitcoin \\(BTC\\)*`,
        `Fiyat: ${escapeMarkdownV2(formatPrice(data.btc.price))} ${btcChange.emoji} ${escapeMarkdownV2(btcChange.text)}`,
        `Piyasa Değeri: ${escapeMarkdownV2(formatMarketCap(data.btc.marketCap))}`,
        `Dominans: ${escapeMarkdownV2(formatDominance(data.btc.dominance))}\n`,
        `*🔷 Ethereum \\(ETH\\)*`,
        `Fiyat: ${escapeMarkdownV2(formatPrice(data.eth.price))} ${ethChange.emoji} ${escapeMarkdownV2(ethChange.text)}`,
        `Piyasa Değeri: ${escapeMarkdownV2(formatMarketCap(data.eth.marketCap))}`,
        `Dominans: ${escapeMarkdownV2(formatDominance(data.eth.dominance))}\n`,
        `*📈 Genel Piyasa*`,
        `Toplam Piyasa Değeri: ${escapeMarkdownV2(formatMarketCap(data.totalMarketCap))}`,
        `24h Hacim: ${escapeMarkdownV2(formatMarketCap(data.totalVolume24h))}\n`,
        `*😰 Korku & Açgözlülük Endeksi*`,
        `Değer: ${escapeMarkdownV2(data.fearGreed.value.toString())} \\- ${escapeMarkdownV2(data.fearGreed.classification)}\n`,
        `*📰 Özet*`,
        `${escapeMarkdownV2(data.summary)}\n`,
        `*⚠️ Not*`,
        `${escapeMarkdownV2(data.disclaimer)}`,
    ];
    return lines.join('\n');
}
/**
 * Basit hata mesajı
 */
export function buildErrorMessage(error) {
    return `❌ *Hata*\n${escapeMarkdownV2(error)}`;
}
//# sourceMappingURL=format.js.map