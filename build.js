const fs = require('fs');
const path = require('path');

const IMAGES_DIR = path.join(__dirname, 'images');
const TEMPLATE_FILE = path.join(__dirname, 'index.template.html');
const DIST_DIR = path.join(__dirname, 'dist');
const OUTPUT_FILE = path.join(DIST_DIR, 'index.html');
const DIST_IMAGES_DIR = path.join(DIST_DIR, 'images');

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'];

function ensureDirectoryExists(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

function copyImages() {
    ensureDirectoryExists(DIST_IMAGES_DIR);
    
    const imageFiles = getImageFiles();
    let copiedCount = 0;
    
    imageFiles.forEach(file => {
        const src = path.join(IMAGES_DIR, file);
        const dest = path.join(DIST_IMAGES_DIR, file);
        try {
            fs.copyFileSync(src, dest);
            copiedCount++;
        } catch (error) {
            console.error(`Error copying ${file}:`, error.message);
        }
    });
    
    return copiedCount;
}

function getImageFiles() {
    try {
        const files = fs.readdirSync(IMAGES_DIR);
        return files.filter(file => {
            const ext = path.extname(file).toLowerCase();
            return IMAGE_EXTENSIONS.includes(ext);
        }).sort();
    } catch (error) {
        console.error('Error reading images directory:', error);
        return [];
    }
}

function generateHTML() {
    console.log('Building gallery...');
    
    ensureDirectoryExists(DIST_DIR);
    
    const imageFiles = getImageFiles();
    console.log(`Found ${imageFiles.length} images`);
    
    const copiedCount = copyImages();
    console.log(`✓ Copied ${copiedCount} images to dist/images/`);
    
    let template;
    try {
        template = fs.readFileSync(TEMPLATE_FILE, 'utf8');
    } catch (error) {
        console.error('Error reading template file:', error);
        console.log('Creating default template...');
        template = getDefaultTemplate();
    }
    
    const imageFilesJSON = JSON.stringify(imageFiles, null, 8).split('\n').map((line, index) => {
        return index === 0 ? line : '        ' + line;
    }).join('\n');
    
    const html = template.replace('/* IMAGE_FILES_PLACEHOLDER */', imageFilesJSON);
    
    fs.writeFileSync(OUTPUT_FILE, html);
    console.log(`✓ Generated ${OUTPUT_FILE}`);
    console.log(`  Images included: ${imageFiles.join(', ')}`);
}

function getDefaultTemplate() {
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Deepractice Brand Images</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 40px 20px;
        }
        
        h1 {
            text-align: center;
            color: white;
            margin-bottom: 40px;
            font-size: 2.5rem;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
        }
        
        .gallery {
            max-width: 1400px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
        }
        
        .image-card {
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .image-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 40px rgba(0,0,0,0.3);
        }
        
        .image-container {
            position: relative;
            width: 100%;
            height: 250px;
            background: #f0f0f0;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
        }
        
        .image-container img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
            transition: transform 0.3s ease;
        }
        
        .image-card:hover .image-container img {
            transform: scale(1.05);
        }
        
        .image-info {
            padding: 20px;
            background: white;
        }
        
        .image-name {
            font-size: 1.1rem;
            color: #333;
            margin-bottom: 8px;
            font-weight: 600;
        }
        
        .image-size {
            font-size: 0.9rem;
            color: #666;
        }
        
        .loading {
            text-align: center;
            color: white;
            font-size: 1.2rem;
            padding: 40px;
        }
        
        .error {
            text-align: center;
            color: #ff6b6b;
            background: white;
            padding: 20px;
            border-radius: 8px;
            max-width: 600px;
            margin: 40px auto;
        }
        
        .build-info {
            text-align: center;
            color: rgba(255,255,255,0.8);
            font-size: 0.9rem;
            margin-top: 40px;
        }
        
        @media (max-width: 768px) {
            h1 {
                font-size: 2rem;
            }
            
            .gallery {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <h1>Deepractice Brand Images</h1>
    <div id="gallery" class="gallery">
        <div class="loading">Loading images...</div>
    </div>
    <div class="build-info">
        Last build: <span id="buildTime"></span>
    </div>

    <script>
        const imageFiles = /* IMAGE_FILES_PLACEHOLDER */;

        function formatFileSize(bytes) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
        }

        function displayImages() {
            const gallery = document.getElementById('gallery');
            gallery.innerHTML = '';

            imageFiles.forEach(filename => {
                const card = document.createElement('div');
                card.className = 'image-card';
                
                const imageContainer = document.createElement('div');
                imageContainer.className = 'image-container';
                
                const img = document.createElement('img');
                img.src = \`images/\${filename}\`;
                img.alt = filename;
                img.loading = 'lazy';
                
                const info = document.createElement('div');
                info.className = 'image-info';
                
                const name = document.createElement('div');
                name.className = 'image-name';
                name.textContent = filename;
                
                const size = document.createElement('div');
                size.className = 'image-size';
                
                img.onload = function() {
                    size.textContent = \`\${this.naturalWidth} × \${this.naturalHeight}px\`;
                };
                
                img.onerror = function() {
                    imageContainer.innerHTML = '<div style="color: #999; padding: 20px;">Failed to load image</div>';
                };
                
                imageContainer.appendChild(img);
                info.appendChild(name);
                info.appendChild(size);
                card.appendChild(imageContainer);
                card.appendChild(info);
                gallery.appendChild(card);
            });
        }
        
        function displayBuildTime() {
            const buildTime = new Date().toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            document.getElementById('buildTime').textContent = buildTime;
        }

        document.addEventListener('DOMContentLoaded', () => {
            displayImages();
            displayBuildTime();
        });
    </script>
</body>
</html>`;
}

function watch() {
    console.log('Watching for changes...');
    generateHTML();
    
    fs.watch(IMAGES_DIR, (eventType, filename) => {
        if (filename && IMAGE_EXTENSIONS.includes(path.extname(filename).toLowerCase())) {
            console.log(`\nDetected change in images directory: ${filename}`);
            generateHTML();
        }
    });
    
    if (fs.existsSync(TEMPLATE_FILE)) {
        fs.watch(TEMPLATE_FILE, (eventType) => {
            console.log('\nDetected change in template file');
            generateHTML();
        });
    }
}

if (process.argv.includes('--watch')) {
    watch();
} else {
    generateHTML();
}