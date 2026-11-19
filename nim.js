/**
 * NVIDIA NIM API (OpenAI uyumlu) ile Türkçe piyasa özeti üretir
 * https://build.nvidia.com/ adresinden model ve API key alın
 */
import { config } from '../config.js';
async function fetchWithTimeout(url, options, timeoutMs = 30000) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
        return await fetch(url, {
            ...options,
            signal: controller.signal,
        });
    }
    finally {
        clearTimeout(timeout);
    }
}
/**
 * Ham piyasa verisi ve haberlerden 60 saniyelik Türkçe özet üretir
 */
export async function generateSummary(data) {
    const systemPrompt = `Sen profesyonel bir kripto piyasa analistisin. Görevin: verilen ham verileri kullanarak, her sabah Telegram'da paylaşılacak, yaklaşık 60 saniyede okunabilecek, kısa, net ve nesnel bir Türkçe piyasa özeti yazmaktır.

KURALLAR:
1. Çıktı SADECE özet metni olmalı (başlık, giriş, vurgular YOK)
2. Maksimum 3-4 cümle, ~350-400 karakter
3. Yatırım tavsiyesi VERME, "al/sat" deme, risk uyarısı yapma (ayrı eklenecek)
4. Nöbel, objektif dil kullan; "BTC 2% arttı" de, "BTC güçlendi" deme
5. Sayıları net ver: fiyat, değişim %, dominans, Fear & Greed değeri
6. Haberlerden en etkili 1-2'sini çok kısaca bağlam olarak ekle
7. Türkçe, doğal akıcı cümleler kur`;
    const userPrompt = `Aşağıdaki verilerden 60 saniyelik Türkçe piyasa özeti üret:

BTC: $${data.btc.price.toLocaleString()} (${data.btc.change24h >= 0 ? '+' : ''}${data.btc.change24h.toFixed(2)}%) | Dom: %${data.btc.dominance.toFixed(1)} | Mcap: $${(data.btc.marketCap / 1e9).toFixed(1)}B
ETH: $${data.eth.price.toLocaleString()} (${data.eth.change24h >= 0 ? '+' : ''}${data.eth.change24h.toFixed(2)}%) | Dom: %${data.eth.dominance.toFixed(1)} | Mcap: $${(data.eth.marketCap / 1e9).toFixed(1)}B
Toplam Piyasa: $${(data.totalMarketCap / 1e12).toFixed(2)}T | 24h Hacim: $${(data.totalVolume24h / 1e9).toFixed(1)}B
Fear & Greed: ${data.fearGreed.value}/100 (${data.fearGreed.classification})

Haberler:
${data.newsText}`;
    const messages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
    ];
    const url = `${config.nvidia.baseUrl.replace(/\/+$/, '')}/chat/completions`;
    const response = await fetchWithTimeout(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${config.nvidia.apiKey}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            model: config.nvidia.model,
            messages,
            temperature: 0.3,
            max_tokens: 300,
            top_p: 0.9,
            stream: false,
        }),
    });
    if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        throw new Error(`NVIDIA NIM API error: ${response.status} ${response.statusText} - ${errorText}`);
    }
    const result = await response.json();
    if (!result.choices || result.choices.length === 0) {
        throw new Error('NVIDIA NIM returned no choices');
    }
    const summary = result.choices[0].message.content.trim();
    // Güvenlik: Çok uzunsa kırp
    if (summary.length > 500) {
        return summary.slice(0, 497) + '...';
    }
    return summary;
}
/**
 * Bağlantı testi için basit bir istek atar
 */
export async function testConnection() {
    try {
        const url = `${config.nvidia.baseUrl.replace(/\/+$/, '')}/models`;
        const response = await fetchWithTimeout(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${config.nvidia.apiKey}`,
                'Accept': 'application/json',
            },
        });
        return response.ok;
    }
    catch {
        return false;
    }
}
//# sourceMappingURL=nim.js.map