const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { calculateDocCoverage } = require('./doc-coverage');

const REPO_ROOT = path.resolve(__dirname, '..');
const README_PATH = path.join(REPO_ROOT, 'README.md');
const COVERAGE_SUMMARY_PATH = path.join(
  REPO_ROOT,
  'coverage',
  'ng-material-scaffold',
  'coverage-summary.json',
);

/**
 * Maps a coverage percentage to a shields.io color string.
 *
 * @param {number} pct - Coverage percentage (0 to 100).
 * @returns {string} Shields.io color name.
 */
const getBadgeColor = (pct) => {
  if (pct >= 95) return 'brightgreen';
  if (pct >= 90) return 'green';
  if (pct >= 80) return 'yellowgreen';
  if (pct >= 70) return 'yellow';
  if (pct >= 60) return 'orange';
  return 'red';
};

/**
 * Formats a coverage percentage cleanly as an integer or decimal percentage string.
 *
 * @param {number} pct - Coverage percentage.
 * @returns {string} Formatted percentage string with `%` suffix.
 */
const formatPct = (pct) => {
  const rounded = Math.round(pct * 100) / 100;
  if (Number.isInteger(rounded)) {
    return `${rounded}%`;
  }
  return `${rounded}%`;
};

/**
 * Reads or generates the Karma test coverage summary and returns the aggregate test coverage percentage.
 *
 * @returns {number} Aggregate test coverage percentage (minimum of statements, branches, functions, and lines).
 */
const getTestCoveragePct = () => {
  if (!fs.existsSync(COVERAGE_SUMMARY_PATH)) {
    execSync('npm test -- --watch=false', { cwd: REPO_ROOT, stdio: 'inherit' });
  }
  const summary = JSON.parse(fs.readFileSync(COVERAGE_SUMMARY_PATH, 'utf8'));
  const total = summary.total;
  const pct = Math.min(
    Number(total.statements.pct),
    Number(total.branches.pct),
    Number(total.functions.pct),
    Number(total.lines.pct),
  );
  return pct;
};

/**
 * Updates the `% doc coverage` and `% test coverage` shields in `README.md`.
 *
 * @returns {boolean} True if `README.md` was modified, false otherwise.
 */
const updateReadmeShields = () => {
  const { coverage: docPct } = calculateDocCoverage();
  const testPct = getTestCoveragePct();

  const docPctStr = formatPct(docPct).replace('%', '%25');
  const testPctStr = formatPct(testPct).replace('%', '%25');

  const docColor = getBadgeColor(docPct);
  const testColor = getBadgeColor(testPct);

  const docShield = `[![% doc coverage](https://img.shields.io/badge/doc%20coverage-${docPctStr}-${docColor}.svg)](#)`;
  const testShield = `[![% test coverage](https://img.shields.io/badge/test%20coverage-${testPctStr}-${testColor}.svg)](#)`;

  const content = fs.readFileSync(README_PATH, 'utf8');

  const docPattern = /\[?!\[[^\]]*(?:%\s*)?doc\s+coverage[^\]]*\]\([^)]+\)(?:\]\([^)]*\))?/i;
  const testPattern = /\[?!\[[^\]]*(?:%\s*)?test\s+coverage[^\]]*\]\([^)]+\)(?:\]\([^)]*\))?/i;

  const hasDoc = docPattern.test(content);
  const hasTest = testPattern.test(content);

  let newContent = content;
  if (hasDoc) {
    newContent = newContent.replace(docPattern, docShield);
  }
  if (hasTest) {
    newContent = newContent.replace(testPattern, testShield);
  }

  if (!hasDoc && !hasTest) {
    const angularBuildBadge =
      '[![Angular build](https://github.com/SamuelMarks/ng-material-scaffold/actions/workflows/main.yml/badge.svg)](https://github.com/SamuelMarks/ng-material-scaffold/actions/workflows/main.yml)';
    if (newContent.includes(angularBuildBadge)) {
      newContent = newContent.replace(
        angularBuildBadge,
        `${angularBuildBadge}
${docShield}
${testShield}`,
      );
    } else {
      newContent = `${docShield}
${testShield}

${newContent}`;
    }
  } else if (hasDoc && !hasTest) {
    newContent = newContent.replace(
      docPattern,
      `${docShield}
${testShield}`,
    );
  } else if (hasTest && !hasDoc) {
    newContent = newContent.replace(
      testPattern,
      `${docShield}
${testShield}`,
    );
  }

  if (newContent !== content) {
    fs.writeFileSync(README_PATH, newContent, 'utf8');
    console.log(
      `Updated README.md shields (doc: ${formatPct(docPct)}, test: ${formatPct(testPct)})`,
    );
    return true;
  }

  console.log(
    `README.md shields are up to date (doc: ${formatPct(docPct)}, test: ${formatPct(testPct)})`,
  );
  return false;
};

if (require.main === module) {
  updateReadmeShields();
}

module.exports = { updateReadmeShields, getBadgeColor, formatPct };
