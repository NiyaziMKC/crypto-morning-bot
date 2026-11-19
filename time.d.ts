/**
 * Zaman dilimi yardımcı fonksiyonları
 * Türkiye saat dilimi: UTC+3 (yıl boyunca, yaz saati uygulamaz)
 */
export declare const TURKEY_TIMEZONE = "Europe/Istanbul";
export declare const TURKEY_OFFSET_HOURS = 3;
/**
 * Şu anki Türkiye tarihini "DD MMMM YYYY" formatında döndürür
 * Örn: "20 Mayıs 2024 Pazartesi"
 */
export declare function getTurkeyDateString(): string;
/**
 * Şu anki Türkiye saatini "HH:mm" formatında döndürür
 */
export declare function getTurkeyTimeString(): string;
/**
 * ISO string'i Türkiye saatine çevirir
 */
export declare function toTurkeyTime(isoString: string): Date;
/**
 * Son 24 saat filtresi için başlangıç zamanı (UTC ISO string)
 */
export declare function getLast24HoursStartISO(): string;
//# sourceMappingURL=time.d.ts.map