const fs = require("fs");
const path = require("path");

const directoryPaths = [
    path.join(__dirname, "../../domains"),
    path.join(__dirname, "../../domains/AorzoHosting")
];

let combinedArray = [];

directoryPaths.forEach(function(directoryPath) {
    fs.readdir(directoryPath, function (err, files) {
        if (err) throw err;

        function removeValue(value, index, arr) {
            if (value === "reserved") {
                arr.splice(index, 1);
                return true;
            }

            return false;
        }

        files.filter(removeValue);

        files.forEach(function (file) {
            const filePath = path.join(directoryPath, file);

            fs.stat(filePath, (err, stats) => {
                if (err) throw err;

                if (stats.isFile()) {
                    fs.readFile(filePath, "utf8", (err, data) => {
                        if (err) throw err;

                        console.log("Data read from file:", data); // Logging data read from file

                        try {
                            const parsedData = JSON.parse(data);
                            parsedData.directory = path.basename(directoryPath); // Add directory name as a property

                            combinedArray.push(parsedData);

                            if (combinedArray.length === files.length) {
                                // Check if all files from all directories are read
                                const indexFilePath = path.join(__dirname, "raw/index.json");
                                fs.writeFile(indexFilePath, JSON.stringify(combinedArray), (err) => {
                                    if (err) throw err;
                                    console.log("Combined data written to index.json");
                                });
                            }
                        } catch (error) {
                            console.error("Error parsing JSON:", error);
                        }
                    });
                } else {
                    console.log(filePath + " is a directory. Skipping...");
                }
            });
        });
    });
});
