/**
 * NVIDIA NIM API (OpenAI uyumlu) ile Türkçe piyasa özeti üretir
 * https://build.nvidia.com/ adresinden model ve API key alın
 */
/**
 * Ham piyasa verisi ve haberlerden 60 saniyelik Türkçe özet üretir
 */
export declare function generateSummary(data: {
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
    newsText: string;
}): Promise<string>;
/**
 * Bağlantı testi için basit bir istek atar
 */
export declare function testConnection(): Promise<boolean>;
//# sourceMappingURL=nim.d.ts.map