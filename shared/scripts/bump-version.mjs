// Run from a project folder (npm's `prebuild`): bumps the patch version in
// that project's package.json. The version is stamped onto the page as
// data-version and shown in the ?debug panel.
import { readFileSync, writeFileSync } from 'fs';

const pkg = JSON.parse(readFileSync('./package.json', 'utf8'));
const [major, minor, patch] = pkg.version.split('.').map(Number);
pkg.version = [major, minor, patch + 1].join('.');
writeFileSync('./package.json', JSON.stringify(pkg, null, 2) + '\n');
console.log(`Version bumped to ${pkg.version}`);
