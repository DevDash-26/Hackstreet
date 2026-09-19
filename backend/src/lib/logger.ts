import { env } from '../config/env.js';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LOG_LEVELS: Record<LogLevel, number> = { debug: 10, info: 20, warn: 30, error: 40 };
const activeLevel: LogLevel = env.NODE_ENV === 'production' ? 'info' : 'debug';

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[activeLevel];
}

function write(level: LogLevel, message: string, meta?: unknown): void {
  if (!shouldLog(level)) return;
  const serializer = level === 'debug' ? console.log : console[level];
  const error: Error | undefined = meta instanceof Error ? meta : undefined;
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...(error !== undefined ? { error: { name: error.name, message: error.message } } : {}),
    ...(meta !== undefined && error === undefined ? { meta } : {}),
  };
  serializer(JSON.stringify(entry));
}

export const logger = {
  debug: (message: string, meta?: unknown) => write('debug', message, meta),
  info: (message: string, meta?: unknown) => write('info', message, meta),
  warn: (message: string, meta?: unknown) => write('warn', message, meta),
  error: (message: string, meta?: unknown) => write('error', message, meta),
};
