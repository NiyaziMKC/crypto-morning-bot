/**
 * Kripto haberlerini çeker
 * CryptoPanic (kripto-odaklı) ve NewsAPI (genel) destekler
 * En az biri için API key gerekir
 */
export interface NewsItem {
    title: string;
    url: string;
    source: string;
    publishedAt: string;
    description?: string;
}
/**
 * CryptoPanic'ten son 24 saatin kripto haberlerini çeker
 */
export declare function fetchCryptoPanicNews(): Promise<NewsItem[]>;
/**
 * NewsAPI'den kripto ile ilgili son 24 saat haberlerini çeker
 */
export declare function fetchNewsApiNews(): Promise<NewsItem[]>;
/**
 * Tüm kaynaklardan haber çeker, birleştirir ve önceliklendirir
 */
export declare function fetchAllNews(): Promise<NewsItem[]>;
/**
 * Haberleri özetleyici için metin formatına çevirir
 */
export declare function formatNewsForSummary(news: NewsItem[]): string;
//# sourceMappingURL=news.d.ts.map