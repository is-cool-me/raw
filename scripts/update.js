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

            fs.readFile(filePath, "utf8", (err, data) => {
                if (err) throw err;
                
                console.log("Data read from file:", data); // Logging data read from file

                try {
                    const dataArray = [JSON.parse(data)];

                    for (const item of dataArray) {
                        item.owner.email = item.owner.email.replace(/@/, " (at) ");
                    }

                    combinedArray = combinedArray.concat(dataArray);

                    if (combinedArray.length === files.length) {
                        fs.writeFile("raw/index.json", JSON.stringify(combinedArray), (err) => {
                            if (err) throw err;
                        });
                    }
                } catch (error) {
                    console.error("Error parsing JSON:", error);
                }
            });
        });
    });
});
