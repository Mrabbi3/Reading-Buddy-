const fs = require('fs');
const readline = require('readline');

async function extract() {
  const fileStream = fs.createReadStream('/Users/naimurrifat/.gemini/antigravity/brain/a893e518-46d0-4b90-8cba-a3cede49818d/.system_generated/logs/transcript_full.jsonl');
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  for await (const line of rl) {
    if (line.includes('write_to_file') && line.includes('.web.tsx')) {
      try {
        const data = JSON.parse(line);
        if (data.tool_calls) {
          for (const tc of data.tool_calls) {
            if (tc.name === 'write_to_file' && tc.args.TargetFile && tc.args.TargetFile.endsWith('.web.tsx')) {
              console.log(`Writing ${tc.args.TargetFile}`);
              fs.writeFileSync(tc.args.TargetFile, tc.args.CodeContent);
            }
          }
        }
      } catch (e) {
        // ignore
      }
    }
  }
}
extract();
