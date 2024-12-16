const fs = require("fs").promises;

async function cleanUpUploadsDirectory() {
  const directory = "./uploads";

  fs.readdir(directory, (err, files) => {
    if (err) {
      console.error("Unable to scan directory: " + err);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(directory, file);
      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error("Error getting file stats: " + err);
          return;
        }

        if (stats.isFile()) {
          // This ensures we're only deleting files directly within the 'uploads' directory
          fs.unlink(filePath, (err) => {
            if (err) {
              console.error("Error deleting file: " + err);
            } else {
              console.log(`Deleted file: ${filePath}`);
            }
          });
        }
      });
    });
  });
}

module.exports = {
  cleanUpUploadsDirectory,
};
