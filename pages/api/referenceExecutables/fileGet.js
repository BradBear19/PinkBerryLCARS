// co-pilot
const fs = require('fs');
const path = require('path');

/**
 * Get a JSON representation of a directory (one layer deep)
 * @param {string} dirPath - Path to the directory
 * @returns {object} JSON object with parent and children
 */
function dirToJsonOneLayer(dirPath) {
    try {
        // Validate that the path exists and is a directory
        if (!fs.existsSync(dirPath)) {
            throw new Error(`Path does not exist: ${dirPath}`);
        }
        if (!fs.statSync(dirPath).isDirectory()) {
            throw new Error(`Path is not a directory: ${dirPath}`);
        }

        const children = fs.readdirSync(dirPath).map(name => {
            const fullPath = path.join(dirPath, name);
            const isDir = fs.statSync(fullPath).isDirectory();
            return {
                name,
                type: isDir ? 'directory' : 'file',
                path: fullPath
            };
        });

        return {
            name: path.basename(dirPath),
            type: 'directory',
            path: dirPath,
            children
        };
    } catch (err) {
        console.error(`Error reading directory: ${err.message}`);
        return null;
    }
}

// Example usage:
const targetDir = process.argv[2] || __dirname; // Default to current folder
const result = dirToJsonOneLayer(targetDir);

if (result) {
    console.log(JSON.stringify(result, null, 2));
}

