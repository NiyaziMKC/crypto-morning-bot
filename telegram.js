/**
 * Telegram Bot API ile mesaj gönderir
 * Telegraf kütüphanesi kullanılarak
 */
import { Telegraf } from 'telegraf';
import { config } from '../config.js';
import { buildErrorMessage } from '../utils/format.js';
let bot = null;
/**
 * Bot örneğini başlatır (singleton)
 */
function getBot() {
    if (!bot) {
        bot = new Telegraf(config.telegram.botToken);
    }
    return bot;
}
/**
 * Formatlanmış rapor mesajını gönderir (MarkdownV2)
 */
export async function sendReport(message) {
    const botInstance = getBot();
    try {
        await botInstance.telegram.sendMessage(config.telegram.chatId, message, {
            parse_mode: 'MarkdownV2',
            link_preview_options: { is_disabled: true },
        });
        return true;
    }
    catch (error) {
        console.error('Telegram send error:', error);
        return false;
    }
}
/**
 * Hata mesajı gönderir
 */
export async function sendError(error) {
    const botInstance = getBot();
    const message = buildErrorMessage(error);
    try {
        await botInstance.telegram.sendMessage(config.telegram.chatId, message, {
            parse_mode: 'MarkdownV2',
        });
        return true;
    }
    catch (err) {
        console.error('Telegram error send failed:', err);
        return false;
    }
}
/**
 * Bağlantı testi - bot bilgilerini alır
 */
export async function testConnection() {
    const botInstance = getBot();
    try {
        const me = await botInstance.telegram.getMe();
        return { ok: true, info: me };
    }
    catch (error) {
        return { ok: false, error: String(error) };
    }
}
/**
 * Bot'u durdurur (graceful shutdown için)
 */
export function stopBot() {
    if (bot) {
        bot.stop();
        bot = null;
    }
}
//# sourceMappingURL=telegram.js.map