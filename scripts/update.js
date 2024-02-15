const fs = require("fs");
const path = require("path");

const directoryPath = path.join(__dirname, "../../domains");

let combinedArray = [];

function readFiles(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
            readFiles(filePath); // Recursively read files in subdirectories
        } else {
            const data = fs.readFileSync(filePath, "utf8");
            const dataArray = [JSON.parse(data)];
            for (const item of dataArray) {
                item.owner.email = item.owner.email.replace(/@/, " (at) ");
            }
            combinedArray = combinedArray.concat(dataArray);
        }
    });
}

readFiles(directoryPath);

fs.writeFileSync("raw/index.json", JSON.stringify(combinedArray));
