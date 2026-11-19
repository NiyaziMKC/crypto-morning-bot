/**
 * Kripto haberlerini çeker
 * CryptoPanic (kripto-odaklı) ve NewsAPI (genel) destekler
 * En az biri için API key gerekir
 */
import { config } from '../config.js';
import { getLast24HoursStartISO } from '../utils/time.js';
async function fetchWithTimeout(url, timeoutMs = 15000) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
        return await fetch(url, {
            signal: controller.signal,
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'crypto-morning-bot/1.0',
            },
        });
    }
    finally {
        clearTimeout(timeout);
    }
}
/**
 * CryptoPanic'ten son 24 saatin kripto haberlerini çeker
 */
export async function fetchCryptoPanicNews() {
    const apiKey = config.news.cryptopanicApiKey;
    if (!apiKey) {
        return [];
    }
    const url = `https://cryptopanic.com/api/v1/posts/?auth_token=${apiKey}&public=true&filter=hot&limit=20`;
    try {
        const response = await fetchWithTimeout(url);
        if (!response.ok) {
            console.warn(`CryptoPanic API error: ${response.status}`);
            return [];
        }
        const data = await response.json();
        const cutoff = new Date(getLast24HoursStartISO());
        return data.results
            .filter(item => new Date(item.published_at) >= cutoff)
            .filter(item => item.kind === 'news') // Sadece haber, analiz değil
            .slice(0, 10)
            .map(item => ({
            title: item.title,
            url: item.url,
            source: item.source.title,
            publishedAt: item.published_at,
        }));
    }
    catch (error) {
        console.warn('CryptoPanic fetch failed:', error);
        return [];
    }
}
/**
 * NewsAPI'den kripto ile ilgili son 24 saat haberlerini çeker
 */
export async function fetchNewsApiNews() {
    const apiKey = config.news.newsApiKey;
    if (!apiKey) {
        return [];
    }
    const fromDate = getLast24HoursStartISO().split('T')[0]; // YYYY-MM-DD
    const url = `https://newsapi.org/v2/everything?q=crypto OR bitcoin OR ethereum OR cryptocurrency&language=tr&sortBy=publishedAt&from=${fromDate}&pageSize=20&apiKey=${apiKey}`;
    try {
        const response = await fetchWithTimeout(url);
        if (!response.ok) {
            console.warn(`NewsAPI error: ${response.status}`);
            return [];
        }
        const data = await response.json();
        if (data.status !== 'ok') {
            console.warn('NewsAPI returned non-ok status');
            return [];
        }
        return data.articles
            .slice(0, 10)
            .map(item => ({
            title: item.title,
            url: item.url,
            source: item.source.name,
            publishedAt: item.publishedAt,
            description: item.description,
        }));
    }
    catch (error) {
        console.warn('NewsAPI fetch failed:', error);
        return [];
    }
}
/**
 * Tüm kaynaklardan haber çeker, birleştirir ve önceliklendirir
 */
export async function fetchAllNews() {
    const [cryptopanic, newsapi] = await Promise.allSettled([
        fetchCryptoPanicNews(),
        fetchNewsApiNews(),
    ]);
    const allNews = [];
    if (cryptopanic.status === 'fulfilled') {
        allNews.push(...cryptopanic.value);
    }
    if (newsapi.status === 'fulfilled') {
        allNews.push(...newsapi.value);
    }
    // Tarihe göre sırala (en yeni önce)
    allNews.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    // Duplicate title temizliği (basit)
    const seen = new Set();
    const unique = allNews.filter(item => {
        const key = item.title.toLowerCase().slice(0, 50);
        if (seen.has(key))
            return false;
        seen.add(key);
        return true;
    });
    return unique.slice(0, 8); // En fazla 8 haber
}
/**
 * Haberleri özetleyici için metin formatına çevirir
 */
export function formatNewsForSummary(news) {
    if (news.length === 0) {
        return 'Son 24 saatte çekilebilen öne çıkan haber bulunamadı.';
    }
    return news.map((item, i) => `${i + 1}. ${item.title} (Kaynak: ${item.source})`).join('\n');
}
//# sourceMappingURL=news.js.map