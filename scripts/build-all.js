import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');
const frontendDir = path.join(rootDir, 'frontend');
const adminDir = path.join(rootDir, 'backend', 'src', 'admin');
const distDir = path.join(rootDir, 'dist');

console.log('🚀 [Build] Starting unified Yaari Social Cafe build...');

// Helper to ensure dependencies are installed
function ensureDependencies(dir, label) {
  const nodeModulesPath = path.join(dir, 'node_modules');
  if (!fs.existsSync(nodeModulesPath)) {
    console.log(`📦 [Build] Installing missing dependencies in ${label}...`);
    execSync('npm install', { cwd: dir, stdio: 'inherit' });
  }
}

// 1. Ensure dependencies in subprojects
ensureDependencies(frontendDir, 'frontend');
ensureDependencies(adminDir, 'backend/src/admin');

// 2. Build Customer Website (Frontend)
console.log('📦 [Build] Building Customer Website (frontend)...');
execSync('npm run build', { cwd: frontendDir, stdio: 'inherit' });

// 3. Build Admin Panel
console.log('📦 [Build] Building Admin Panel (backend/src/admin)...');
execSync('npm run build', { cwd: adminDir, stdio: 'inherit' });

// 4. Clean and recreate root dist directory
console.log('🧹 [Build] Preparing unified root dist directory...');
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

// 5. Copy Frontend dist into root dist
const frontendDist = path.join(frontendDir, 'dist');
console.log(`📁 [Build] Merging Frontend dist -> dist/`);
fs.cpSync(frontendDist, distDir, { recursive: true });

// 6. Copy Admin dist into root dist/admin
const adminDist = path.join(adminDir, 'dist');
const targetAdminDist = path.join(distDir, 'admin');
console.log(`📁 [Build] Merging Admin dist -> dist/admin/`);
fs.mkdirSync(targetAdminDist, { recursive: true });
fs.cpSync(adminDist, targetAdminDist, { recursive: true });

// 7. Verify generated outputs
const frontendIndex = path.join(distDir, 'index.html');
const adminIndex = path.join(targetAdminDist, 'index.html');

if (!fs.existsSync(frontendIndex) || !fs.existsSync(adminIndex)) {
  console.error('❌ [Build Error] Verification failed: Missing index.html in dist or dist/admin');
  process.exit(1);
}

console.log('✨ [Build Success] Unified build completed successfully!');
console.log(`   🏠 Customer Site: dist/index.html`);
console.log(`   🛠️ Admin Panel:   dist/admin/index.html`);
