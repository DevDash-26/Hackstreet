import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BACKEND_ENV_PATH = join(process.cwd(), 'backend', '.env');
const FRONTEND_ENV_PATH = join(process.cwd(), 'frontend', '.env.local');

const BACKEND_KEYS = ['NODE_ENV', 'PORT'];
const FRONTEND_KEYS = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_PUBLISHABLE_KEY'];

function loadEnvFile(filePath: string): Record<string, string> {
  if (!existsSync(filePath)) return {};
  const variables: Record<string, string> = {};
  for (const rawLine of readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    const line = rawLine.trim();
    if (line.length === 0 || line.startsWith('#') || !line.includes('=')) continue;
    const separatorIndex = line.indexOf('=');
    const key = line.slice(0, separatorIndex).trim();
    const value = line
      .slice(separatorIndex + 1)
      .trim()
      .replace(/^["']|["']$/g, '');
    if (key.length > 0) variables[key] = value;
  }
  return variables;
}

function reportSection(title: string, filePath: string, keys: string[]): void {
  console.log(`${title} (${filePath.replace(process.cwd(), '').replace(/^[\\/]/, '')}):`);
  const variables = loadEnvFile(filePath);
  if (Object.keys(variables).length === 0) {
    console.log('  (file not found - defaults will be used)');
  }
  for (const key of keys) {
    const value = variables[key];
    const configured = value !== undefined && value.length > 0;
    console.log(`  ${configured ? 'OK  ' : 'INFO'} ${key} - ${configured ? value : 'not set'}`);
  }
}

reportSection('Backend environment', BACKEND_ENV_PATH, BACKEND_KEYS);
reportSection('Frontend environment', FRONTEND_ENV_PATH, FRONTEND_KEYS);
