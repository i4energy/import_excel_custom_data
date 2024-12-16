const ExcelJS = require("exceljs");
const { getPD_ExcelItems, getExcelIdentifier } = require("./generateUtils");
const { generateMockRows } = require("./generateRowsUtils");
const { 
  parseNumberField, 
  findOptionFromList, 
  parseTextField, 
  parseMultiTextField, 
  parseFileField, 
  parseMapField, 
  parseSingleDateField, 
  parsePeriodDateField, 
  parseMeasurementField 
} = require("./parseDataUtils");

async function createExcelTemplate() {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Template");

  // This is actually information that we will receive from the custom data template.
  const { templateId, templateVersion } = getExcelIdentifier();

  // Get the dynamically created excel items, form fromDesigner of custom data template.
  const excelItems = getPD_ExcelItems();

  // Set the worksheet columns based on excelItems
  worksheet.columns = excelItems.map((item) => ({
    header: item.header,
    key: item.id,
    width: item.width,
  }));

  // Style headers
  const headerRow = worksheet.getRow(1);
  headerRow.eachCell((cell) => {
    cell.font = { bold: true };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFCCCCCC" },
    };
    cell.alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true,
    };
  });

  // Add notes and data validations
  excelItems.forEach((item, index) => {
    // Add note to header cell (row 1)
    const cell = headerRow.getCell(index + 1);
    if (item.note) {
      cell.note = item.note;
    }

    // If there's a dropdown list, add data validation
    if (item.dropdownList && item.dropdownList.length > 0) {
      const column = worksheet.getColumn(index + 1);
      const columnLetter = column.letter;
      const listFormula = `"${item.dropdownList.join(",")}"`;

      // Apply data validation from row 2 to row 100 (adjust as needed)
      worksheet.dataValidations.add(`${columnLetter}2:${columnLetter}100`, {
        type: "list",
        allowBlank: true,
        formulae: [listFormula],
      });
    }
  });

  // Create a hidden sheet for template metadata
  const metadataSheet = workbook.addWorksheet("Metadata");
  workbook.worksheets[1].state = 'veryHidden'; // Makes the sheet very hidden which can only be made visible through VBA or API
  metadataSheet.getCell('A1').value = 'Template ID';
  metadataSheet.getCell('B1').value = templateId;
  metadataSheet.getCell('A2').value = 'Template Version';
  metadataSheet.getCell('B2').value = templateVersion;

  return workbook;
}

async function createExcelTemplateFilled() { 
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Template");

  // This is actually information that we will receive from the custom data template.
  const { templateId, templateVersion } = getExcelIdentifier();
  
  // Get the dynamically created excel items, form fromDesigner of custom data template.
  const excelItems = getPD_ExcelItems();

  // Set the worksheet columns based on excelItems
  worksheet.columns = excelItems.map((item) => ({
    header: item.header,
    key: item.id,
    width: item.width,
  }));

  // Style headers
  const headerRow = worksheet.getRow(1);
  headerRow.eachCell((cell) => {
    cell.font = { bold: true };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFCCCCCC" },
    };
    cell.alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true,
    };
  });

  // Add notes and data validations
  excelItems.forEach((item, index) => {
    const cell = headerRow.getCell(index + 1);
    if (item.note) {
      cell.note = item.note;
    }

    if (item.dropdownList && item.dropdownList.length > 0) {
      const column = worksheet.getColumn(index + 1);
      const columnLetter = column.letter;
      const listFormula = `"${item.dropdownList.join(",")}"`;

      worksheet.dataValidations.add(`${columnLetter}2:${columnLetter}100`, {
        type: "list",
        allowBlank: true,
        formulae: [listFormula],
      });
    }
  });

  // Generate mock data
  const mockData = generateMockRows();

  // Add mock data rows to the worksheet
  mockData.forEach((dataEntry) => {
    const rowData = [];
    excelItems.forEach((item) => {
      rowData.push(dataEntry[item.header] || '');
    });
    worksheet.addRow(rowData);
  });

  // Create a hidden sheet for template metadata
  const metadataSheet = workbook.addWorksheet("Metadata");
  workbook.worksheets[1].state = 'veryHidden'; // Makes the sheet very hidden which can only be made visible through VBA or API
  metadataSheet.getCell('A1').value = 'Template ID';
  metadataSheet.getCell('B1').value = templateId;
  metadataSheet.getCell('A2').value = 'Template Version';
  metadataSheet.getCell('B2').value = templateVersion;

  return workbook;
}

async function parseUploadedExcel(file) {
  const workbook = new ExcelJS.Workbook();

  // Read the uploaded file
  await workbook.xlsx.readFile(file.path);

  // Validate Metadata for template ID and version
  const metadataSheet = workbook.getWorksheet("Metadata");
  if (!metadataSheet) {
    throw new Error("Metadata sheet not found in the uploaded Excel file.");
  }
  
  const uploadedTemplateId = metadataSheet.getCell('B1').value; // Assuming template ID is in cell B1
  const uploadedTemplateVersion = metadataSheet.getCell('B2').value; // Assuming template version is in cell B2

    // This is actually information that we will receive from the custom data template.
    const { templateId, templateVersion } = getExcelIdentifier();
  
  if (templateId !== uploadedTemplateId || templateVersion !== uploadedTemplateVersion) {
    throw new Error("Template ID or version does not match the expected values.");
  }

  // Access the 'Template' worksheet
  const worksheet = workbook.getWorksheet("Template");
  if (!worksheet) {
    throw new Error("Template sheet not found in the uploaded Excel file.");
  }

  // Get the dynamically created excel items, form fromDesigner of custom data template.
  const excelItems = getPD_ExcelItems();
  const parsedData = [];
  const errorMessages = [];

  // Validate headers
  const headers = worksheet.getRow(1).values;
  const expectedHeaders = excelItems.map(item => item.header);
  if (!headers.every((header, index) => header === expectedHeaders[index - 1])) {
    throw new Error("Headers do not match the template specification.");
  }

  // Check for data rows
  if (worksheet.rowCount <= 1) { // Only header row present, no data rows
    throw new Error("No data rows found in the uploaded Excel file.");
  }

  // Iterate through each row in the worksheet, starting from row 2 (skip header)
  worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
    if (rowNumber > 1) {
      // skip header row
      let rowData = {};

      excelItems.forEach((item, columnIndex) => {
        const cellRef = row.getCell(columnIndex + 1).address;
        const cellValue = row.getCell(columnIndex + 1).value;
        const { fullDropdownList } = item;

        let transformedData;

        switch (item.type) {
          case "FormTextField":
            transformedData = parseTextField(item, cellRef, cellValue);
            break;
          case "FormMultiTextField":
            transformedData = parseMultiTextField(item, cellRef, cellValue);
            break;
          case "FormCategoryField":
            transformedData = findOptionFromList(item, cellRef, cellValue, fullDropdownList, 'category');
            break;
          case "FormNumberField":
            transformedData = parseNumberField(item, cellRef, cellValue);
            break;
          case "FormMeasurementField":
            transformedData = parseMeasurementField(item, cellRef, cellValue);
            break;
          case "FormDropdownField":
            transformedData = findOptionFromList(item, cellRef, cellValue, fullDropdownList);
            break;
          case "FormSingleDateField":
            transformedData = parseSingleDateField(item, cellRef, cellValue);
            break;
          case "FormPeriodDateField":
            transformedData = parsePeriodDateField(item, cellRef, cellValue);
            break;
          case "FormMapField":
            transformedData = parseMapField(item, cellRef, cellValue);
            break;
          case "FormFileUploadField":
            transformedData = parseFileField(item, cellRef, cellValue);
            break;
          default:
            transformedData = cellValue;
            break;
        }

        if(transformedData?.error) {
          errorMessages.push(transformedData?.error);
        }

        rowData[item.id] = transformedData?.value;
      });

      parsedData.push(rowData);
    }
  });

  return { parsedData, errorMessages};
}

module.exports = {
  createExcelTemplate,
  createExcelTemplateFilled,
  parseUploadedExcel,
};
