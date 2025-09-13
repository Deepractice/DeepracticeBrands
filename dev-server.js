const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = process.env.PORT || 3000;
const DIST_DIR = path.join(__dirname, 'dist');

// MIME types
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
    '.ico': 'image/x-icon'
};

// Build the project first
function buildProject() {
    return new Promise((resolve, reject) => {
        console.log('🔨 Building project...');
        exec('node build.js', (error, stdout, stderr) => {
            if (error) {
                console.error(`Build error: ${error}`);
                reject(error);
                return;
            }
            console.log(stdout);
            if (stderr) console.error(stderr);
            resolve();
        });
    });
}

// Create HTTP server
function createServer() {
    const server = http.createServer((req, res) => {
        let filePath = path.join(DIST_DIR, req.url === '/' ? 'index.html' : req.url);
        
        // Security: prevent directory traversal
        if (!filePath.startsWith(DIST_DIR)) {
            res.writeHead(403);
            res.end('Forbidden');
            return;
        }
        
        const extname = String(path.extname(filePath)).toLowerCase();
        const contentType = mimeTypes[extname] || 'application/octet-stream';
        
        fs.readFile(filePath, (error, content) => {
            if (error) {
                if (error.code === 'ENOENT') {
                    // Try to serve index.html for SPA routes
                    if (!extname) {
                        filePath = path.join(DIST_DIR, 'index.html');
                        fs.readFile(filePath, (error, content) => {
                            if (error) {
                                res.writeHead(404);
                                res.end('404 Not Found');
                            } else {
                                res.writeHead(200, { 'Content-Type': 'text/html' });
                                res.end(content, 'utf-8');
                            }
                        });
                    } else {
                        res.writeHead(404);
                        res.end('404 Not Found');
                    }
                } else {
                    res.writeHead(500);
                    res.end(`Server Error: ${error.code}`);
                }
            } else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content, 'utf-8');
            }
        });
    });
    
    server.listen(PORT, () => {
        console.log(`\n🚀 Development server running at:`);
        console.log(`   http://localhost:${PORT}`);
        console.log(`\n📁 Serving files from: ${DIST_DIR}`);
        console.log(`\n👀 Watching for changes...`);
        console.log(`   Press Ctrl+C to stop\n`);
    });
    
    return server;
}

// Watch for file changes
function watchFiles() {
    const watchDirs = [
        path.join(__dirname, 'images'),
        __dirname
    ];
    
    const rebuild = debounce(async () => {
        console.log('\n🔄 Changes detected, rebuilding...');
        try {
            await buildProject();
            console.log('✅ Rebuild complete!\n');
        } catch (error) {
            console.error('❌ Rebuild failed:', error);
        }
    }, 500);
    
    // Watch template file
    if (fs.existsSync(path.join(__dirname, 'index.template.html'))) {
        fs.watch(path.join(__dirname, 'index.template.html'), (eventType) => {
            if (eventType === 'change') {
                rebuild();
            }
        });
    }
    
    // Watch images directory
    fs.watch(path.join(__dirname, 'images'), { recursive: true }, (eventType, filename) => {
        if (filename) {
            rebuild();
        }
    });
    
    // Watch build.js
    fs.watch(path.join(__dirname, 'build.js'), (eventType) => {
        if (eventType === 'change') {
            rebuild();
        }
    });
}

// Debounce function to prevent multiple rebuilds
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Main function
async function main() {
    try {
        // Initial build
        await buildProject();
        
        // Start server
        createServer();
        
        // Watch for changes
        watchFiles();
        
    } catch (error) {
        console.error('Failed to start dev server:', error);
        process.exit(1);
    }
}

// Handle process termination
process.on('SIGINT', () => {
    console.log('\n\n👋 Shutting down development server...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n\n👋 Shutting down development server...');
    process.exit(0);
});

// Start the dev server
main();