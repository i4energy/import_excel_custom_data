const fs = require("fs").promises;
const excelUtils = require("../utils/excelUtils");
const { cleanUpUploadsDirectory } = require("../utils/fileUtils");

exports.createTemplate = async (req, res) => {
  try {
    const workbook = await excelUtils.createExcelTemplate();
    const buffer = await workbook.xlsx.writeBuffer();

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=excel_template.xlsx"
    );
    res.send(buffer);
  } catch (error) {
    console.log("Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.createTemplateFilled = async (req, res) => {
  try {
    const workbook = await excelUtils.createExcelTemplateFilled();
    const buffer = await workbook.xlsx.writeBuffer();

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=excel_template_filled.xlsx"
    );
    res.send(buffer);
  } catch (error) {
    console.log("Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.uploadTemplate = async (req, res) => {
  try {
    // Check if a file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Parse the uploaded Excel file
    const { parsedData, errorMessages } = await excelUtils.parseUploadedExcel(req.file);

    // Generate a timestamp
    const timestamp = new Date().toISOString().replace(/[:\-T\.Z]/g, "");

    // delete the temporary file
    await fs.unlink(req.file.path);

    if (errorMessages.length > 0) {
      // Write error messages to a text file
      const errorPath = `./uploads/errors_data/errors_${timestamp}.txt`
      await fs.writeFile(errorPath, errorMessages.join('\n'), "utf8");
      cleanUpUploadsDirectory();

      // Return a response with the error file download link
      return res.status(422).download(errorPath);
    } else {      
      // Write parsed data to a JSON file
      const outputPath = `./uploads/excels_data/excel_data_${timestamp}.json`;
      await fs.writeFile(outputPath, JSON.stringify(parsedData, null, 2), 'utf8');
      cleanUpUploadsDirectory();

      // If no errors, return success
      return res.status(200).json({ success: true, message: "File processed successfully without errors." });
    }
  } catch (error) {
    console.error("Error processing uploaded Excel:", error.message);
    return res.status(500).json({ error: error.message });
  }
};
