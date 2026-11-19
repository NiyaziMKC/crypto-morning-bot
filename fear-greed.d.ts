/**
 * Alternative.me Fear & Greed Index API
 * Ücretsiz, API key gerektirmez
 * Docs: https://alternative.me/crypto/fear-and-greed-index/
 */
/**
 * Güncel Fear & Greed Index değerini çeker
 * value: 0-100 arası (0=Extreme Fear, 100=Extreme Greed)
 * classification: "Extreme Fear", "Fear", "Neutral", "Greed", "Extreme Greed"
 */
export declare function fetchFearGreedIndex(): Promise<{
    value: number;
    classification: string;
    timestamp: string;
}>;
/**
 * Türkçe sınıflandırma çevirisi
 */
export declare function translateClassification(classification: string): string;
//# sourceMappingURL=fear-greed.d.ts.map