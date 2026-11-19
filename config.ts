import dotenv from 'dotenv';
dotenv.config();

interface Config {
  telegram: {
    botToken: string;
    chatId: string;
  };
  nvidia: {
    apiKey: string;
    baseUrl: string;
    model: string;
  };
  news: {
    cryptopanicApiKey?: string;
    newsApiKey?: string;
  };
}

function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function getOptionalEnv(key: string): string | undefined {
  return process.env[key];
}

export const config: Config = {
  telegram: {
    botToken: getRequiredEnv('TELEGRAM_BOT_TOKEN'),
    chatId: getRequiredEnv('TELEGRAM_CHAT_ID'),
  },
  nvidia: {
    apiKey: getRequiredEnv('NVIDIA_API_KEY'),
    baseUrl: getRequiredEnv('NVIDIA_BASE_URL'),
    model: getRequiredEnv('NVIDIA_MODEL'),
  },
  news: {
    cryptopanicApiKey: getOptionalEnv('CRYPTOPANIC_API_KEY'),
    newsApiKey: getOptionalEnv('NEWSAPI_KEY'),
  },
};

export function validateConfig(): void {
  if (!config.telegram.botToken || !config.telegram.chatId) {
    throw new Error('Telegram configuration is incomplete');
  }
  if (!config.nvidia.apiKey || !config.nvidia.baseUrl || !config.nvidia.model) {
    throw new Error('NVIDIA NIM configuration is incomplete');
  }
  if (!config.news.cryptopanicApiKey && !config.news.newsApiKey) {
    console.warn('⚠️  No news API keys configured. News section will be limited.');
  }
}