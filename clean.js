const fs = require('fs');
const path = require('path');

const DIST_DIR = path.join(__dirname, 'dist');

function removeDirectory(dir) {
    if (fs.existsSync(dir)) {
        fs.readdirSync(dir).forEach(file => {
            const filePath = path.join(dir, file);
            if (fs.lstatSync(filePath).isDirectory()) {
                removeDirectory(filePath);
            } else {
                fs.unlinkSync(filePath);
            }
        });
        fs.rmdirSync(dir);
    }
}

console.log('Cleaning dist directory...');
removeDirectory(DIST_DIR);
console.log('✓ Cleaned dist directory');