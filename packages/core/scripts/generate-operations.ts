import { execSync } from "child_process";
import { readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

type HttpMethod = "delete" | "get" | "patch" | "post" | "put";

interface OperationInfo {
  functionName: string;
  hasBody: boolean;
  hasPathParams: boolean;
  hasQueryParams: boolean;
  method: HttpMethod;
  operationName: string;
  path: string;
  queryParamsRequired: boolean;
}

// Check if an operation has a request body
function checkHasBody(schemaContent: string, operationName: string): boolean {
  // Find the operation definition and check for requestBody
  const operationRegex = new RegExp(
    `${operationName}:\\s*\\{[\\s\\S]*?requestBody(\\?)?:\\s*([^;]+);`,
    "m",
  );
  const opMatch = schemaContent.match(operationRegex);

  if (!opMatch) {
    return false;
  }

  const bodyType = opMatch[2].trim();
  // If requestBody is 'never', there's no body
  return bodyType !== "never";
}

// Check if an operation has query params and if they're required
function checkQueryParams(
  schemaContent: string,
  operationName: string,
): { hasQueryParams: boolean; queryParamsRequired: boolean } {
  // Find the operation definition
  const operationRegex = new RegExp(
    `${operationName}:\\s*\\{[\\s\\S]*?parameters:\\s*\\{[\\s\\S]*?query(\\?)?:\\s*([^;]+);`,
    "m",
  );
  const opMatch = schemaContent.match(operationRegex);

  if (!opMatch) {
    return { hasQueryParams: false, queryParamsRequired: false };
  }

  const isOptional = opMatch[1] === "?";
  const queryType = opMatch[2].trim();
  const hasQueryParams = queryType !== "never";

  if (!hasQueryParams) {
    return { hasQueryParams: false, queryParamsRequired: false };
  }

  // If query itself is optional (query?:), the whole thing is optional
  if (isOptional) {
    return { hasQueryParams: true, queryParamsRequired: false };
  }

  // Check if any property in the query object is required (doesn't have ?)
  // Find the query block for this operation
  const queryBlockRegex = new RegExp(
    `${operationName}:[\\s\\S]*?query:\\s*\\{([\\s\\S]*?)\\};`,
    "m",
  );
  const queryBlockMatch = schemaContent.match(queryBlockRegex);

  if (queryBlockMatch) {
    const queryProps = queryBlockMatch[1];
    // Check if there are required properties (property name followed by : without ?)
    // Required: "  propName: type" or "propName: type"
    // Optional: "  propName?: type" or "propName?: type"
    const lines = queryProps.split("\n");
    for (const line of lines) {
      // Skip empty lines and comments
      if (
        !line.trim() ||
        line.trim().startsWith("*") ||
        line.trim().startsWith("/")
      )
        continue;
      // Check for a property definition that's not optional
      if (line.match(/^\s*["']?[\w-]+["']?:\s/) && !line.includes("?:")) {
        return { hasQueryParams: true, queryParamsRequired: true };
      }
    }
  }

  return { hasQueryParams: true, queryParamsRequired: false };
}

// Extract all operations from the schema
function extractOperations(): OperationInfo[] {
  const operations: OperationInfo[] = [];

  const schemaPath = join(__dirname, "../src/schema.d.ts");
  const schemaContent = readFileSync(schemaPath, "utf-8");

  // Extract each path block and its operations
  const pathBlockRegex = /"([^"]+\/[^"]*)":\s*\{([\s\S]*?)(?=\n {2}"\/|$)/g;
  let pathMatch;

  while ((pathMatch = pathBlockRegex.exec(schemaContent)) !== null) {
    const [, path, blockContent] = pathMatch;

    // Check for all HTTP methods
    const methods: Array<{ method: HttpMethod; regex: RegExp }> = [
      { method: "get", regex: /get:\s*operations\["([^"]+)"\]/ },
      { method: "post", regex: /post:\s*operations\["([^"]+)"\]/ },
      { method: "put", regex: /put:\s*operations\["([^"]+)"\]/ },
      { method: "patch", regex: /patch:\s*operations\["([^"]+)"\]/ },
      { method: "delete", regex: /delete:\s*operations\["([^"]+)"\]/ },
    ];

    for (const { method, regex } of methods) {
      const opMatch = blockContent.match(regex);
      if (!opMatch) continue;

      const operationName = opMatch[1];

      // Check for path params
      const hasPathParams = path.includes("{");

      // Check for query params and if they're required
      const { hasQueryParams, queryParamsRequired } = checkQueryParams(
        schemaContent,
        operationName,
      );

      // Check for request body
      const hasBody = checkHasBody(schemaContent, operationName);

      operations.push({
        functionName: operationName,
        hasBody,
        hasPathParams,
        hasQueryParams,
        method,
        operationName,
        path,
        queryParamsRequired,
      });
    }
  }

  return operations;
}

// Generate a single operation function
function generateOperationFunction(op: OperationInfo): string[] {
  const lines: string[] = [];
  const methodUpper = op.method.toUpperCase();

  // Build function parameters
  const params: string[] = ["client: FetchClient"];

  if (op.hasPathParams) {
    params.push(`path: PathParams<"${op.path}", "${op.method}">`);
  }

  if (op.hasQueryParams) {
    const optional = op.queryParamsRequired ? "" : "?";
    params.push(`query${optional}: QueryParams<"${op.path}", "${op.method}">`);
  }

  if (op.hasBody) {
    params.push(`body: RequestBody<"${op.path}", "${op.method}">`);
  }

  // Build function signature
  lines.push(`export function ${op.functionName}(`);
  lines.push(`  ${params.join(",\n  ")},`);
  lines.push(`) {`);

  // Build the client call
  const callParams: string[] = [];

  if (op.hasPathParams || op.hasQueryParams) {
    const paramParts: string[] = [];
    if (op.hasPathParams) {
      paramParts.push("path");
    }
    if (op.hasQueryParams) {
      paramParts.push("query");
    }
    callParams.push(`params: { ${paramParts.join(", ")} }`);
  }

  if (op.hasBody) {
    callParams.push("body");
  }

  if (callParams.length > 0) {
    lines.push(`  return client.${methodUpper}("${op.path}", {`);
    lines.push(`    ${callParams.join(",\n    ")},`);
    lines.push(`  });`);
  } else {
    lines.push(`  return client.${methodUpper}("${op.path}");`);
  }

  lines.push(`}`);

  return lines;
}

// Generate the operations.ts file content
function generateOperationsFile(operations: OperationInfo[]): string {
  const lines: string[] = [
    "/**",
    " * This file was auto-generated by scripts/generate-operations.ts",
    " * Do not make direct changes to the file.",
    " */",
    "",
  ];

  // Collect which type helpers we need to import
  const needsPathParams = operations.some((op) => op.hasPathParams);
  const needsQueryParams = operations.some((op) => op.hasQueryParams);
  const needsRequestBody = operations.some((op) => op.hasBody);

  const typeImports = ["FetchClient"];
  if (needsPathParams) typeImports.push("PathParams");
  if (needsQueryParams) typeImports.push("QueryParams");
  if (needsRequestBody) typeImports.push("RequestBody");

  lines.push(`import type { ${typeImports.join(", ")} } from "./client";`);
  lines.push("");

  // Sort operations alphabetically by function name
  const sorted = [...operations].sort((a, b) =>
    a.functionName.localeCompare(b.functionName),
  );

  for (const op of sorted) {
    lines.push(...generateOperationFunction(op));
    lines.push("");
  }

  return lines.join("\n");
}

// Main function
async function main() {
  console.log("🔍 Extracting operations from schema...");
  const operations = extractOperations();

  console.log(`📝 Found ${operations.length} operations`);

  // Generate operations.ts file
  console.log("✨ Generating operations.ts...");
  const content = generateOperationsFile(operations);
  const outputPath = join(__dirname, "../src/operations.ts");
  writeFileSync(outputPath, content, "utf-8");
  console.log("  ✓ operations.ts");

  // Format generated file with eslint
  console.log("\n🎨 Formatting generated file with eslint...");
  execSync('pnpm eslint --fix "src/operations.ts"', {
    cwd: join(__dirname, ".."),
    stdio: "inherit",
  });

  console.log(`\n✅ Successfully generated ${operations.length} operations!`);
}

main().catch(console.error);
