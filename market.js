/**
 * CoinGecko API'den piyasa verilerini çeker
 * Ücretsiz, API key gerektirmez, rate limit: 10-30 req/min
 * Docs: https://www.coingecko.com/en/api/documentation
 */
const COINGECKO_BASE = 'https://api.coingecko.com/api/v3';
async function fetchWithTimeout(url, options = {}, timeoutMs = 10000) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal,
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'crypto-morning-bot/1.0',
                ...options.headers,
            },
        });
        return response;
    }
    finally {
        clearTimeout(timeout);
    }
}
/**
 * BTC ve ETH güncel fiyat, 24h değişim, market cap çeker
 */
export async function fetchBtcEthData() {
    const url = `${COINGECKO_BASE}/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true&include_market_cap=true`;
    const response = await fetchWithTimeout(url);
    if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return {
        btc: {
            price: data.bitcoin.usd,
            change24h: data.bitcoin.usd_24h_change,
            marketCap: data.bitcoin.usd_market_cap,
        },
        eth: {
            price: data.ethereum.usd,
            change24h: data.ethereum.usd_24h_change,
            marketCap: data.ethereum.usd_market_cap,
        },
    };
}
/**
 * Global piyasa verileri (toplam market cap, hacim, dominans) çeker
 */
export async function fetchGlobalData() {
    const url = `${COINGECKO_BASE}/global`;
    const response = await fetchWithTimeout(url);
    if (!response.ok) {
        throw new Error(`CoinGecko Global API error: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return {
        totalMarketCap: data.data.total_market_cap.usd,
        totalVolume24h: data.data.total_volume.usd,
        btcDominance: data.data.market_cap_percentage.btc,
        ethDominance: data.data.market_cap_percentage.eth,
    };
}
/**
 * Tüm piyasa verilerini tek seferde çeker
 */
export async function fetchAllMarketData() {
    const [prices, global] = await Promise.all([
        fetchBtcEthData(),
        fetchGlobalData(),
    ]);
    return {
        btc: {
            ...prices.btc,
            dominance: global.btcDominance,
        },
        eth: {
            ...prices.eth,
            dominance: global.ethDominance,
        },
        totalMarketCap: global.totalMarketCap,
        totalVolume24h: global.totalVolume24h,
    };
}
//# sourceMappingURL=market.js.map