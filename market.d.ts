/**
 * CoinGecko API'den piyasa verilerini çeker
 * Ücretsiz, API key gerektirmez, rate limit: 10-30 req/min
 * Docs: https://www.coingecko.com/en/api/documentation
 */
/**
 * BTC ve ETH güncel fiyat, 24h değişim, market cap çeker
 */
export declare function fetchBtcEthData(): Promise<{
    btc: {
        price: number;
        change24h: number;
        marketCap: number;
    };
    eth: {
        price: number;
        change24h: number;
        marketCap: number;
    };
}>;
/**
 * Global piyasa verileri (toplam market cap, hacim, dominans) çeker
 */
export declare function fetchGlobalData(): Promise<{
    totalMarketCap: number;
    totalVolume24h: number;
    btcDominance: number;
    ethDominance: number;
}>;
/**
 * Tüm piyasa verilerini tek seferde çeker
 */
export declare function fetchAllMarketData(): Promise<{
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
}>;
//# sourceMappingURL=market.d.ts.map