import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

function parseTags(tagsChunk) {
  return [...tagsChunk.matchAll(/"([^"]+)"/g)].map((match) => match[1]);
}

async function main() {
  const toolsFile = path.join(process.cwd(), "lib", "tools.ts");
  const outputFile = path.join(process.cwd(), "public", "tools-index.json");

  const source = await readFile(toolsFile, "utf8");

  const matches = [...source.matchAll(/slug:\s*"([^"]+)"[\s\S]*?title:\s*"([^"]+)"[\s\S]*?shortDescription:\s*"([^"]+)"[\s\S]*?tags:\s*\[([^\]]*)\]/g)];

  const index = matches.map((match) => {
    const slug = match[1];
    const title = match[2];
    const description = match[3];
    const tags = parseTags(match[4]);

    return {
      slug,
      title,
      description,
      tags,
      url: `/tools/${slug}`,
    };
  });

  await mkdir(path.dirname(outputFile), { recursive: true });
  await writeFile(outputFile, `${JSON.stringify(index, null, 2)}\n`, "utf8");

  console.log(`Generated ${index.length} tools at ${outputFile}`);
}

main().catch((error) => {
  console.error("Failed to generate tools index", error);
  process.exit(1);
});
