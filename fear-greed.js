/**
 * Alternative.me Fear & Greed Index API
 * Ücretsiz, API key gerektirmez
 * Docs: https://alternative.me/crypto/fear-and-greed-index/
 */
const FEAR_GREED_API = 'https://api.alternative.me/fng/';
async function fetchWithTimeout(url, timeoutMs = 10000) {
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
 * Güncel Fear & Greed Index değerini çeker
 * value: 0-100 arası (0=Extreme Fear, 100=Extreme Greed)
 * classification: "Extreme Fear", "Fear", "Neutral", "Greed", "Extreme Greed"
 */
export async function fetchFearGreedIndex() {
    const url = `${FEAR_GREED_API}?limit=1&format=json`;
    const response = await fetchWithTimeout(url);
    if (!response.ok) {
        throw new Error(`Fear & Greed API error: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    if (data.metadata.error) {
        throw new Error(`Fear & Greed API error: ${data.metadata.error}`);
    }
    if (!data.data || data.data.length === 0) {
        throw new Error('Fear & Greed API returned no data');
    }
    const latest = data.data[0];
    return {
        value: parseInt(latest.value, 10),
        classification: latest.value_classification,
        timestamp: latest.timestamp,
    };
}
/**
 * Türkçe sınıflandırma çevirisi
 */
export function translateClassification(classification) {
    const translations = {
        'Extreme Fear': 'Aşırı Korku',
        'Fear': 'Korku',
        'Neutral': 'Nötr',
        'Greed': 'Açgözlülük',
        'Extreme Greed': 'Aşırı Açgözlülük',
    };
    return translations[classification] || classification;
}
//# sourceMappingURL=fear-greed.js.map