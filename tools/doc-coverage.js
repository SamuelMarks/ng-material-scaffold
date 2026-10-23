const fs = require('fs');
const path = require('path');
const ts = require('typescript');

/**
 * Checks whether a file path is a non-test, non-declaration TypeScript source file.
 *
 * @param {string} filePath - Absolute path to the file.
 * @returns {boolean} True if the file should be analyzed for JSDoc coverage.
 */
const isTsFile = (filePath) =>
  filePath.endsWith('.ts') && !filePath.endsWith('.spec.ts') && !filePath.endsWith('.d.ts');

/**
 * Recursively collects all TypeScript source files under a directory.
 *
 * @param {string} dir - Root directory to traverse.
 * @returns {string[]} Array of matching file paths.
 */
const collectFiles = (dir) => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      return collectFiles(fullPath);
    }
    return isTsFile(fullPath) ? [fullPath] : [];
  });
};

/**
 * Checks if a TypeScript AST node has at least one JSDoc comment or tag attached.
 *
 * @param {ts.Node} node - The AST node to inspect.
 * @returns {boolean} True if JSDoc documentation is present.
 */
const hasDocs = (node) => {
  const docs = ts.getJSDocCommentsAndTags(node);
  return docs != null && docs.length > 0;
};

/**
 * Checks if a TypeScript AST node has an `export` or `default` modifier.
 *
 * @param {ts.Node} node - The AST node to inspect.
 * @returns {boolean} True if the node is exported.
 */
const isExported = (node) => {
  const flags = ts.getCombinedModifierFlags(node);
  return (flags & ts.ModifierFlags.Export) !== 0 || (flags & ts.ModifierFlags.ExportDefault) !== 0;
};

/**
 * Checks if a TypeScript AST node is a declaration type that requires documentation.
 *
 * @param {ts.Node} node - The AST node to inspect.
 * @returns {boolean} True if the node is a documentable top-level construct.
 */
const isDocTarget = (node) => {
  return (
    ts.isClassDeclaration(node) ||
    ts.isFunctionDeclaration(node) ||
    ts.isInterfaceDeclaration(node) ||
    ts.isTypeAliasDeclaration(node) ||
    ts.isEnumDeclaration(node) ||
    ts.isVariableStatement(node)
  );
};

/**
 * Calculates documentation coverage across all TypeScript source files in `rootDir`.
 *
 * @param {string} [rootDir] - Directory to scan (defaults to `../src`).
 * @returns {{ coverage: number, documented: number, total: number, undocumented: Array<{ file: string, line: number }> }} Coverage result object.
 */
const calculateDocCoverage = (rootDir = path.resolve(__dirname, '..', 'src')) => {
  const files = collectFiles(rootDir);
  const undocumented = [];
  let total = 0;
  let documented = 0;

  for (const filePath of files) {
    const sourceText = fs.readFileSync(filePath, 'utf8');
    const sourceFile = ts.createSourceFile(filePath, sourceText, ts.ScriptTarget.Latest, true);
    ts.forEachChild(sourceFile, (node) => {
      if (!isDocTarget(node) || !isExported(node)) {
        return;
      }
      total += 1;
      if (hasDocs(node)) {
        documented += 1;
        return;
      }
      const line = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1;
      undocumented.push({
        file: path.relative(process.cwd(), filePath),
        line,
      });
    });
  }

  const coverage = total === 0 ? 100 : Math.round((documented / total) * 10000) / 100;
  return { coverage, documented, total, undocumented };
};

if (require.main === module) {
  const { coverage, documented, total, undocumented } = calculateDocCoverage();

  if (undocumented.length > 0) {
    console.error('Documentation coverage failed. Missing JSDoc for:');
    for (const entry of undocumented) {
      console.error(`- ${entry.file}:${entry.line}`);
    }
    console.error(`Coverage: ${coverage}% (${documented}/${total})`);
    process.exit(1);
  }

  console.log(`Documentation coverage: ${coverage}% (${documented}/${total})`);
}

module.exports = { calculateDocCoverage };
