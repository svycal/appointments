import fs from "node:fs";
import path from "node:path";
import { blankSourceFile } from "ts-blank-space";
import ts from "typescript";

const srcDir = "src/components";
const outDir = "js";

// Find all .tsx files in src/components
// Use readdirSync with recursive option (Node.js 18.17+)
function findTsxFiles(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true, recursive: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".tsx"))
    .map((entry) => path.join(entry.parentPath || entry.path, entry.name));
}

const files = findTsxFiles(srcDir);

for (const file of files) {
  const source = fs.readFileSync(file, "utf-8");

  // Parse and strip types
  const sourceFile = ts.createSourceFile(
    file,
    source,
    ts.ScriptTarget.ESNext,
    false,
    ts.ScriptKind.TSX,
  );
  const output = blankSourceFile(sourceFile);

  // Determine output path (same structure under js/, with .jsx extension)
  const relativePath = path.relative(srcDir, file);
  const outPath = path.join(outDir, relativePath.replace(/\.tsx$/, ".jsx"));

  // Ensure output directory exists
  fs.mkdirSync(path.dirname(outPath), { recursive: true });

  // Write the output
  fs.writeFileSync(outPath, output);
  console.log(`Generated: ${outPath}`);
}
