import express from 'express';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mountMapOverride = {
    'home.js': '/',
    'admin/index.js': '/admin-dashboard',
};

function getMountPath(relativePath) {
    const override = mountMapOverride[relativePath];
    if (override) return override;

    let routePath = '/' + relativePath.replace(/\\/g, '/').replace(/\.js$/, '');
    return routePath.endsWith('/index') ? routePath.slice(0, -6) : routePath;
}

async function loadRoutes(dir, baseDir = __dirname) {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const relativePath = path.relative(baseDir, fullPath).replace(/\\/g, '/');

        if (entry.isDirectory()) {
            await loadRoutes(fullPath, baseDir);
        } else if (entry.isFile() && entry.name.endsWith('.js') && entry.name !== 'index.js') {
            const mountPath = getMountPath(relativePath);
            const routeModule = await import(`./${relativePath}`);
            router.use(mountPath, routeModule.default);
            console.log(`✅ Mounted: ${mountPath} → ./${relativePath}`);
        } else if (entry.isFile() && entry.name === 'index.js' && dir !== baseDir) {
            const mountPath = getMountPath(relativePath);
            const routeModule = await import(`./${relativePath}`);
            router.use(mountPath, routeModule.default);
            console.log(`✅ Mounted: ${mountPath} → ./${relativePath}`);
        }
    }
}

await loadRoutes(__dirname);

export default router;
