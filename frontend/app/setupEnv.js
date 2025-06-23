import fs from 'fs';

const IGreen = '\x1b[32m';
const NC = '\x1b[0m';
const FgRed = '\x1b[31m';

try {
  fs.copyFileSync('.env.production', '.env.local');
  console.log(`${IGreen}.env.production was copied to .env.local 👏${NC}`);
} catch (error) {
  console.error(`${FgRed}❌ Failed to copy .env.production to .env.local:${NC}`, error);
}
