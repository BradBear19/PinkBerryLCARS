const fs = require("fs");
const path = require("path");

function dirToJsonOneLayer(dirPath) {
  try {
    if (!fs.existsSync(dirPath)) {
      return { error: true, message: `Path does not exist: ${dirPath}` };
    }

    const stats = safeStatSync(dirPath);
    if (!stats || !stats.isDirectory()) {
      return { error: true, message: `Not a directory: ${dirPath}` };
    }

    // Normalize the directory path
    const resolvedPath = path.resolve(dirPath);

    // For root drives, use the full path as name; otherwise, use basename
    const name =
      resolvedPath === path.parse(resolvedPath).root
        ? resolvedPath
        : path.basename(resolvedPath);

    const children = fs.readdirSync(resolvedPath).map((childName) => {
      const fullPath = path.join(resolvedPath, childName);
      const childStats = safeStatSync(fullPath);

      return {
        name: childName,
        type: childStats
          ? childStats.isDirectory()
            ? "Directory"
            : "File"
          : "Inaccessible",
        path: fullPath,
      };
    });

    return {
      name,
      type: "Directory",
      path: resolvedPath,
      children,
    };
  } catch (err) {
    return { error: true, message: err.message, path: dirPath, children: [] };
  }
}

function safeStatSync(p) {
  try {
    return fs.statSync(p);
  } catch {
    return null;
  }
}

// Get directory from command line argument
const targetDir = process.argv[2] || "C:\\";
console.log(JSON.stringify(dirToJsonOneLayer(targetDir), null, 2));
