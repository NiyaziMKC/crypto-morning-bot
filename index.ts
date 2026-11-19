/**
 * Crypto Morning Bot - Ana Entry Point
 * Her sabah 08:00'te çalışıp Telegram'a kripto piyasa özeti gönderir
 */

import { validateConfig } from './config.js';
import { getTurkeyDateString, getTurkeyTimeString } from './utils/time.js';
import { fetchAllMarketData } from './fetchers/market.js';
import { fetchFearGreedIndex, translateClassification } from './fetchers/fear-greed.js';
import { fetchAllNews, formatNewsForSummary } from './fetchers/news.js';
import { generateSummary } from './summarizer/nim.js';
import { sendReport, sendError, testConnection as testTelegram } from './sender/telegram.js';
import { buildReportMessage } from './utils/format.js';
import type { NewsItem } from './fetchers/news.js';

const DISCLAIMER = 'Bu bilgi yatırım tavsiyesi değildir. Kendi araştırmanızı yapın.';

async function main(): Promise<void> {
  console.log('🚀 Crypto Morning Bot başlatılıyor...');
  console.log(`📅 Tarih: ${getTurkeyDateString()}`);
  console.log(`⏰ Saat: ${getTurkeyTimeString()} UTC+3\n`);

  // Config doğrulama
  try {
    validateConfig();
    console.log('✅ Konfigürasyon doğrulandı');
  } catch (error) {
    console.error('❌ Konfigürasyon hatası:', error);
    process.exit(1);
  }

  // Telegram bağlantı testi
  console.log('🔗 Telegram bağlantısı test ediliyor...');
  const tgTest = await testTelegram();
  if (!tgTest.ok) {
    console.error('❌ Telegram bağlantı hatası:', tgTest.error);
    process.exit(1);
  }
  console.log(`✅ Telegram bağlı: @${tgTest.info?.username}`);

  // Veri toplama
  console.log('\n📊 Piyasa verileri çekiliyor...');
  let marketData;
  try {
    marketData = await fetchAllMarketData();
    console.log('✅ Piyasa verileri alındı');
  } catch (error) {
    const errMsg = `Piyasa verisi çekilemedi: ${error}`;
    console.error('❌', errMsg);
    await sendError(errMsg);
    process.exit(1);
  }

  console.log('😰 Fear & Greed Index çekiliyor...');
  let fearGreed;
  try {
    fearGreed = await fetchFearGreedIndex();
    fearGreed.classification = translateClassification(fearGreed.classification);
    console.log(`✅ Fear & Greed: ${fearGreed.value} (${fearGreed.classification})`);
  } catch (error) {
    console.warn('⚠️ Fear & Greed çekilemedi, varsayılan kullanılıyor:', error);
    fearGreed = { value: 50, classification: 'Nötr', timestamp: new Date().toISOString() };
  }

  console.log('📰 Haberler çekiliyor...');
  let news: NewsItem[] = [];
  try {
    news = await fetchAllNews();
    console.log(`✅ ${news.length} haber alındı`);
  } catch (error) {
    console.warn('⚠️ Haber çekilemedi:', error);
    news = [];
  }

  // Özet üretimi
  console.log('\n🤖 NVIDIA NIM ile özet üretiliyor...');
  let summary;
  try {
    const newsText = formatNewsForSummary(news);
    summary = await generateSummary({
      ...marketData,
      fearGreed,
      newsText,
    });
    console.log('✅ Özet üretildi');
    console.log(`📝 Özet: ${summary}`);
  } catch (error) {
    const errMsg = `Özet üretilemedi: ${error}`;
    console.error('❌', errMsg);
    await sendError(errMsg);
    process.exit(1);
  }

  // Mesaj oluştur ve gönder
  console.log('\n📤 Telegram mesajı hazırlanıyor...');
  const message = buildReportMessage({
    date: getTurkeyDateString(),
    time: getTurkeyTimeString(),
    ...marketData,
    fearGreed,
    summary,
    disclaimer: DISCLAIMER,
  });

  console.log('📩 Mesaj gönderiliyor...');
  const sent = await sendReport(message);
  
  if (sent) {
    console.log('✅ Rapor başarıyla gönderildi!');
  } else {
    console.error('❌ Mesaj gönderilemedi');
    process.exit(1);
  }

  console.log('\n✨ İşlem tamamlandı.');
}

// Hata yakalama
process.on('unhandledRejection', (reason) => {
  console.error('💥 Unhandled Rejection:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:', error);
  process.exit(1);
});

// Çalıştır
main();