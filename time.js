/**
 * Zaman dilimi yardımcı fonksiyonları
 * Türkiye saat dilimi: UTC+3 (yıl boyunca, yaz saati uygulamaz)
 */
export const TURKEY_TIMEZONE = 'Europe/Istanbul';
export const TURKEY_OFFSET_HOURS = 3;
/**
 * Şu anki Türkiye tarihini "DD MMMM YYYY" formatında döndürür
 * Örn: "20 Mayıs 2024 Pazartesi"
 */
export function getTurkeyDateString() {
    const now = new Date();
    const turkeyTime = new Date(now.toLocaleString('en-US', { timeZone: TURKEY_TIMEZONE }));
    const days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
    const months = [
        'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
        'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
    ];
    const day = turkeyTime.getDate();
    const month = months[turkeyTime.getMonth()];
    const year = turkeyTime.getFullYear();
    const dayName = days[turkeyTime.getDay()];
    return `${day} ${month} ${year} ${dayName}`;
}
/**
 * Şu anki Türkiye saatini "HH:mm" formatında döndürür
 */
export function getTurkeyTimeString() {
    const now = new Date();
    const turkeyTime = new Date(now.toLocaleString('en-US', { timeZone: TURKEY_TIMEZONE }));
    const hours = turkeyTime.getHours().toString().padStart(2, '0');
    const minutes = turkeyTime.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}
/**
 * ISO string'i Türkiye saatine çevirir
 */
export function toTurkeyTime(isoString) {
    const date = new Date(isoString);
    return new Date(date.toLocaleString('en-US', { timeZone: TURKEY_TIMEZONE }));
}
/**
 * Son 24 saat filtresi için başlangıç zamanı (UTC ISO string)
 */
export function getLast24HoursStartISO() {
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    return twentyFourHoursAgo.toISOString();
}
//# sourceMappingURL=time.js.map