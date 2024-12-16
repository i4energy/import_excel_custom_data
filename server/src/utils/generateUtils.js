const { custom_data_template } = require("../mocks/mockData");

const formFieldItemTypes = [
  "FormEmailField",
  "FormPasswordField",
  "FormPhoneField",
  "FormMaskTextField",
  "FormImageField",
  "FormFileField",
  "FormDynamicDropdownField",
  "FormDropdownField",
  "FormRegisterField",
  "FormTextField",
  "FormMultiTextField",
  "FormNumberField",
  "FormMeasurementField",
  "FormCategoryField",
  "FormFileUploadField",
  "FormSingleDateField",
  "FormPeriodDateField",
  "FormMapField",
  "FormVcdField",
  "FormNestedRecordsField",
];

const excelSupportItemTypes = [
  "FormMultiTextField",
  "FormTextField",
  "FormNumberField",
  "FormDropdownField",
  "FormMeasurementField",
  "FormCategoryField",
  "FormSingleDateField",
  "FormPeriodDateField",
  "FormMapField",
  "FormFileUploadField",
];

const categoryOptions = [
  { label: "category_1", value: 1 },
  { label: "category_2", value: 2 },
  { label: "category_3", value: 3 },
  { label: "category_4", value: 4 },
  { label: "category_5", value: 5 },
  { label: "category_6", value: 6 },
  { label: "category_7", value: 7 },
  { label: "category_8", value: 8 },
  { label: "category_9", value: 9 },
  { label: "category_10", value: 10 }
];

const isFormItem = (itemType) => (itemType ?? "").startsWith("Form");
const isWrapperItem = (itemType) => itemType === "WrapperItem";
const isTabWrapperItem = (itemType) => itemType === "TabWrapper";

function filterNullUndefined(obj) {
  const filtered = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== null && value !== undefined) {
      filtered[key] = value;
    }
  }
  return filtered;
}

const generateExampleDate = (dateType, dateFormat) => {
  // You can expand this function to generate more accurate examples based on the dateFormat.
  switch (dateType) {
    case "dateTime":
      return "2024-01-15 14:45:00"; // Adjust the format as needed
    case "date":
      return "2024-01-15";
    case "time":
      return "14:45:00";
    default:
      return "2024-01-15"; // Default fallback
  }
};

const generatePeriodExampleDate = (dateType, dateFormat) => {
    // Example logic can be adjusted to better fit specific date formats
    switch (dateType) {
        case 'dateTime':
            return 'FROM: 2024-01-01 00:00:00; TO: 2024-01-31 23:59:59';
        case 'date':
            return 'FROM: 2024-01-01; TO: 2024-01-31';
        case 'time':
            return 'FROM: 00:00:00; TO: 23:59:59';
        default:
            return 'FROM: 2024-01-01; TO: 2024-01-31'; // Default fallback if not specified
    }
};

const getNoteTextsMap = (item) => {
  const dateType = item.itemOptions?.data?.dateType;
  const dateFormat = item.itemOptions?.data?.dateFormat;
  const measureType = item.itemOptions?.data?.measurementOptions?.unitType;

  const noteTextsMap = {
    FormMultiTextField:
      'MultiText Field\nEnter multiple languages, separated by ";".\nExample: "EN: English text; EL: Ελληνικό κείμενο"',
    FormTextField: "Text Field\nEnter text",
    FormNumberField: "Number Field\nEnter number",
    FormDropdownField:
      "Dropdown Field\nSelect one of the provided options from the dropdown.",
    FormCategoryField:
      "Category Field\nSelect one of the provided categories from the dropdown.",
    FormMeasurementField: `Measurement Field\nEnter number with the ${measureType} measurement right.\nExample: 1200 ${
      measureType === "single" ? "kw" : "kw/h"
    }`,
    FormSingleDateField: `SingleDate Field\nEnter a single ${dateType} in ${dateFormat} format.\nExample: ${generateExampleDate(
      dateType,
      dateFormat
    )}`,
    FormPeriodDateField: `PeriodDate Field\nEnter a period ${dateType} in ${dateFormat} format, separated by ";".\nExample: "${generatePeriodExampleDate(dateType, dateFormat)}"`,
    FormMapField:
      'Map Field\nEnter latitude and longitude, separated by ";".\nExample: "LAT: 38.0827; LNG: 23.7744"',
    FormFileUploadField: "File Field\nEnter src file server path.",
  };

  return noteTextsMap;
};

const getItemValidationProps = (item) => {
  const { data, validation } = item.itemOptions || {};
  const { JSONSchema } = validation || {};

  const rawProps = {
    required: validation?.required || null,
    textTruncate: data?.allowSpaces,
    allowSpaces: data?.allowSpaces ? null : data?.allowSpaces,
    allowSpecialCharacters: data?.allowSpaces ? null : data?.allowSpaces,
    decimalPlaces: data?.decimalPlaces,
    decimalRequired: data?.decimalRequired || null,
    maxLength: JSONSchema?.maxLength,
    minLength: JSONSchema?.minLength,
    maximum: JSONSchema?.maximum,
    minimum: JSONSchema?.minimum,
    greaterThanOrEqual: JSONSchema?.["x-validation"]?.find(
      (obj) => obj.method === "greaterThanOrEqual"
    )?.params[0],
    lessThanOrEqual: JSONSchema?.["x-validation"]?.find(
      (obj) => obj.method === "lessThanOrEqual"
    )?.params[0],
  };

  return filterNullUndefined(rawProps);
};

const getItemNoteText = (item) => {
  const noteTextsMap = getNoteTextsMap(item);

  const baseNote = noteTextsMap[item.itemType];
  const validationProps = getItemValidationProps(item);

  if (!baseNote) return "--";

  // If there are validation props, format them to appear on the same line after "Validations:"
  const validationKeys = Object.keys(validationProps);
  if (validationKeys.length > 0) {
    let validationText = "\nValidations: ";
    validationText += validationKeys
      .map((key) => `${key}: ${validationProps[key]}`)
      .join(", ");
    return baseNote + validationText;
  }

  return baseNote;
};

const getLanguageText = (langId = "en", texts = []) => {
  const result = texts?.find((n) => n.languageID === langId) || {
    text: "--",
  };

  return result?.text || "--";
};

const getDropdownList = (langId = "en", item = {}) => {
  if (item.itemType === "FormCategoryField") {
    return categoryOptions.map(obj => obj.label);  
  }

  if (item.itemType === "FormDropdownField") {
    return item.itemOptions?.data?.dropdownOptionsList?.map((obj) => {
      return getLanguageText(langId, obj.label);
    });
  }

  return null;
};

const getFullDropdownList = (langId = "en", item = {}) => {
  if (item.itemType === "FormCategoryField") {
    return categoryOptions.map(obj => ({ label: obj.label, value: obj.value }));  
  }

  if (item.itemType === "FormDropdownField") {
    return item.itemOptions?.data?.dropdownOptionsList?.map((obj) => {
      return { label: getLanguageText(langId, obj.label), value: obj.value };
    });
  }

  return null;
};

const getPD_FlattenItems = (items) => {
  const flattenedItems = [];

  const flatten = (itemArr) => {
    // Iterate over each item in the array
    itemArr?.forEach((item) => {
      // If the item is not a wrapper or tab wrapper, add it to the result
      if (!isWrapperItem(item.itemType) && !isTabWrapperItem(item.itemType)) {
        flattenedItems.push(item);
      }

      // If it's a wrapper item, recursively flatten its children
      if (isWrapperItem(item.itemType)) {
        const options = item.itemOptions;
        flatten(options?.items);
      }

      // If it's a tab wrapper item, flatten items within its tabs
      if (isTabWrapperItem(item.itemType)) {
        const options = item.itemOptions;
        options?.tabs?.forEach((tab) => {
          flatten(tab?.wrapperItemOptions?.items);
        });
      }
    });
  };

  // Start flattening with the top-level items
  flatten(items);

  return flattenedItems;
};

const getPD_ExcelSupportItems = (items) => {
  // Filter items to include only those whose itemType exists in the excelSupportItemTypes array
  return items.filter((item) => excelSupportItemTypes.includes(item.itemType));
};

const getPD_OrderedItems = (items) => {
  // Define the item ordering rules
  const itemIdPriority = ["name", "description", "category"];
  const itemTypePriority = [
    "FormMultiTextField",
    "FormTextField",
    "FormNumberField",
    "FormMeasurementField",
    "FormDropdownField",
    "FormSingleDateField",
    "FormPeriodDateField",
    "FormMapField",
  ];

  // Sort the items based on the defined priorities
  const orderedItems = items.sort((a, b) => {
    // Check itemID priority
    const aIDIndex = itemIdPriority.indexOf(a.itemID);
    const bIDIndex = itemIdPriority.indexOf(b.itemID);
    if (aIDIndex !== -1 || bIDIndex !== -1) {
      return (
        (aIDIndex === -1 ? Infinity : aIDIndex) -
        (bIDIndex === -1 ? Infinity : bIDIndex)
      );
    }

    // Check itemType priority
    const aTypeIndex = itemTypePriority.indexOf(a.itemType);
    const bTypeIndex = itemTypePriority.indexOf(b.itemType);
    return (
      (aTypeIndex === -1 ? Infinity : aTypeIndex) -
      (bTypeIndex === -1 ? Infinity : bTypeIndex)
    );
  });

  return orderedItems;
};

const buildExcelItemProps = (items) => {
  const result = [];

  items.forEach((item) => {
    const isRequired = item.itemOptions?.validation?.required;
    let headerName = getLanguageText("en", item.itemOptions?.display?.label);

    result.push({
      isRequired,
      id: item.itemID,
      type: item.itemType,
      note: getItemNoteText(item),
      header: isRequired ? `${headerName}*` : headerName,
      dropdownList: getDropdownList("en", item),
      fullDropdownList: getFullDropdownList("en", item),
      JSONSchema: item.itemOptions?.validation?.JSONSchema,
      measureType:item.itemOptions?.data?.measurementOptions?.unitType,
      validationProps: getItemValidationProps(item),
      width: item.itemType === 'FormMultiTextField' ? 35 : 25,
    });
  });

  return result;
};

const getPD_ExcelItems = () => {
  // Get mock items and to interact with
  const templateItems = custom_data_template.formDesigner.items;

  // Flatten the items to make sure all nested items are included
  const flattenItems = getPD_FlattenItems(templateItems);

  // Filter out only the Excel-supported items
  const excelSupportItems = getPD_ExcelSupportItems(flattenItems);

  // Order the Excel-supported items based on some rules
  const orderedItems = getPD_OrderedItems(excelSupportItems);

  // Order the items with desired props for excel usage
  const finalExcelItems = buildExcelItemProps(orderedItems);

  // console.log('finalExcelItems', JSON.stringify(finalExcelItems));
  return finalExcelItems;
};

const getExcelIdentifier = () => {
  return { templateId: custom_data_template.id, templateVersion: custom_data_template.version }
}

module.exports = {
  getPD_ExcelItems,
  getExcelIdentifier
};
