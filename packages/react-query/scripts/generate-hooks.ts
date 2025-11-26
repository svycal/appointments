import { writeFileSync, mkdirSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

// Helper to convert operation name to hook name
function operationToHookName(operationName: string): string {
  // Remove common prefixes: get, list, fetch, retrieve
  const withoutPrefix = operationName
    .replace(/^get/, '')
    .replace(/^list/, '')
    .replace(/^fetch/, '')
    .replace(/^retrieve/, '');

  // If nothing left after removing prefix, use the original
  const baseName = withoutPrefix || operationName;

  return `use${baseName.charAt(0).toUpperCase()}${baseName.slice(1)}`;
}

// Helper to convert camelCase to kebab-case
function camelToKebab(str: string): string {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

// Helper to extract path parameters from a path string
function extractPathParams(path: string): string[] {
  const matches = path.match(/\{([^}]+)\}/g);
  if (!matches) return [];
  return matches.map((match) => match.slice(1, -1));
}

interface OperationInfo {
  operationName: string;
  path: string;
  method: HttpMethod;
  hookName: string;
  fileName: string;
  pathParams: string[];
  hasQueryParams: boolean;
  queryParamsRequired: boolean;
}

// Extract all GET operations from the schema
function extractGetOperations(): OperationInfo[] {
  const operations: OperationInfo[] = [];

  // We need to parse the schema type at runtime
  // Since we can't introspect types at runtime, we'll read the schema.d.ts file
  const schemaPath = join(__dirname, '../../core/src/schema.d.ts');
  const schemaContent = readFileSync(schemaPath, 'utf-8');

  // Extract each path block and its GET operation
  // Split by path definitions and process each one
  const pathBlockRegex = /"([^"]+\/[^"]*)":\s*\{([\s\S]*?)(?=\n    "\/|$)/g;
  let pathMatch;

  while ((pathMatch = pathBlockRegex.exec(schemaContent)) !== null) {
    const [, path, blockContent] = pathMatch;

    // Check if this block has a GET operation
    const getOpMatch = blockContent.match(/get:\s*operations\["([^"]+)"\]/);
    if (!getOpMatch) continue;

    const operationName = getOpMatch[1];
    const hookName = operationToHookName(operationName);
    const fileName = camelToKebab(hookName);
    const pathParams = extractPathParams(path);

    // Now we need to check if this operation has query params
    // Look for the operation definition in the operations interface
    const operationRegex = new RegExp(
      `${operationName}:\\s*\\{[\\s\\S]*?parameters:\\s*\\{[\\s\\S]*?query(\\?)?:\\s*([^;]+);`,
      'm',
    );
    const opMatch = schemaContent.match(operationRegex);

    let hasQueryParams = false;
    let queryParamsRequired = false;

    if (opMatch) {
      const isOptional = opMatch[1] === '?';
      const queryType = opMatch[2].trim();
      hasQueryParams = queryType !== 'never';

      if (hasQueryParams) {
        // Check if the query params object has any required fields
        // Look for properties without '?' in the query type definition
        const queryDefMatch = schemaContent.match(
          new RegExp(
            `query${isOptional ? '\\?' : ''}:\\s*\\{([\\s\\S]*?)\\}`,
            'm',
          ),
        );

        if (queryDefMatch) {
          const queryProps = queryDefMatch[1];
          // If any property doesn't have '?', it's required
          queryParamsRequired = /^\s*[^?]+:/m.test(queryProps) && !isOptional;
        } else {
          queryParamsRequired = !isOptional;
        }
      }
    }

    operations.push({
      operationName,
      path,
      method: 'get',
      hookName,
      fileName,
      pathParams,
      hasQueryParams,
      queryParamsRequired,
    });
  }

  return operations;
}

// Generate hook file content
function generateHookFile(op: OperationInfo): string {
  const paramsTypeName = `${op.hookName.charAt(3).toUpperCase()}${op.hookName.slice(4)}Params`;

  const lines: string[] = [
    `import type { Client } from '../client';`,
    `import { paths } from '@savvycal/appointments-core';`,
    ``,
  ];

  // Generate the params type (export it for consumer use)
  lines.push(`export type ${paramsTypeName} =`);
  lines.push(`  paths['${op.path}']['${op.method}']['parameters'];`);
  lines.push(``);

  // Build function signature
  const params: string[] = ['client: Client'];

  // Add path parameters as individual arguments
  if (op.pathParams.length > 0) {
    for (const pathParam of op.pathParams) {
      params.push(`${pathParam}: ${paramsTypeName}['path']['${pathParam}']`);
    }
  }

  // Add query parameters
  if (op.hasQueryParams) {
    const optional = op.queryParamsRequired ? '' : '?';
    params.push(`params${optional}: ${paramsTypeName}['query']`);
  }

  lines.push(`export const ${op.hookName} = (`);
  lines.push(`  ${params.join(',\n  ')},`);
  lines.push(`) => {`);

  // Build the params object for the query
  const queryCallParts: string[] = [];

  if (op.pathParams.length > 0) {
    const pathObj = op.pathParams.map((p) => `${p}`).join(', ');
    queryCallParts.push(`      path: { ${pathObj} },`);
  }

  if (op.hasQueryParams) {
    queryCallParts.push(`      query: params,`);
  }

  lines.push(`  return client.useQuery('${op.method}', '${op.path}', {`);

  if (queryCallParts.length > 0) {
    lines.push(`    params: {`);
    lines.push(...queryCallParts);
    lines.push(`    },`);
  }

  lines.push(`  });`);
  lines.push(`};`);
  lines.push(``);

  return lines.join('\n');
}

// Generate barrel export file
function generateBarrelExport(operations: OperationInfo[]): string {
  const lines: string[] = [];

  // Sort operations alphabetically by hook name
  const sorted = [...operations].sort((a, b) =>
    a.hookName.localeCompare(b.hookName),
  );

  for (const op of sorted) {
    lines.push(`export { ${op.hookName} } from './hooks/${op.fileName}';`);
  }

  lines.push('');

  return lines.join('\n');
}

// Main function
async function main() {
  console.log('🔍 Extracting GET operations from schema...');
  const operations = await extractGetOperations();

  console.log(`📝 Found ${operations.length} GET operations`);

  // Create hooks directory if it doesn't exist
  const hooksDir = join(__dirname, '../src/hooks');
  mkdirSync(hooksDir, { recursive: true });

  // Generate each hook file
  console.log('✨ Generating hook files...');
  for (const op of operations) {
    const content = generateHookFile(op);
    const filePath = join(hooksDir, `${op.fileName}.ts`);
    writeFileSync(filePath, content, 'utf-8');
    console.log(`  ✓ ${op.fileName}.ts`);
  }

  // Generate barrel export
  console.log('📦 Generating barrel export...');
  const barrelContent = generateBarrelExport(operations);
  const barrelPath = join(__dirname, '../src/hooks.ts');
  writeFileSync(barrelPath, barrelContent, 'utf-8');
  console.log(`  ✓ hooks.ts`);

  // Format generated files with prettier
  console.log('\n🎨 Formatting generated files with prettier...');
  execSync('pnpm prettier --write "src/hooks/**/*.ts" "src/hooks.ts"', {
    cwd: join(__dirname, '..'),
    stdio: 'inherit',
  });

  console.log(`\n✅ Successfully generated ${operations.length} hooks!`);
}

main().catch(console.error);
