import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

const execAsync = promisify(exec);
const projectRoot = process.cwd();
const outputPath = join(projectRoot, 'frontend', 'src', 'lib', 'supabase', 'database.types.ts');
const projectId = process.env.SUPABASE_PROJECT_ID ?? '';

async function main(): Promise<void> {
  if (projectId.length === 0) {
    console.error(
      'SUPABASE_PROJECT_ID is not set. Set it in backend/.env or as an environment variable.',
    );
    process.exit(1);
  }

  console.log(`Generating Supabase types for project "${projectId}"...`);
  const command = `npx supabase gen types typescript --project-id "${projectId}"`;
  try {
    const { stdout } = await execAsync(command, { cwd: projectRoot, maxBuffer: 10 * 1024 * 1024 });
    writeFileSync(outputPath, stdout, 'utf8');
    console.log(`Types written to ${outputPath}`);
  } catch (error) {
    console.error(
      'Failed to generate Supabase types.',
      error instanceof Error ? error.message : error,
    );
    process.exit(1);
  }
}

main().catch(() => process.exit(1));
