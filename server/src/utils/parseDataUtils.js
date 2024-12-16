const Ajv = require("ajv");

function validateData(data, schema) {
  const ajv = new Ajv({ allErrors: false, strict: false }); // Initialize AJV, retrieve the first error
  const validate = ajv.compile(schema); // Compile the JSON schema

  const valid = validate(data);
  if (!valid) {
    const errorText = validate.errors.map((err) => err.message).join(", ");

    return {
      isValid: false,
      errorText,
    };
  }

  return { isValid: true };
}

const removeAccents = (text) => {
  if (!text) return text;

  const regex = /[\u0300-\u036f]/g;
  return text.normalize("NFD").replace(regex, "");
};

const transformText = (text) => {
  if (!text) return NO_VALUE_DISPLAY;

  return removeAccents(text)
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[^a-zA-Z0-9α-ωΑ-Ω]/g, "");
};

function parseTextField(item, cellRef, cellValue) {
  // cellValue: text
  try {
    const trimValue = cellValue?.trim();
    if (item.isRequired && !trimValue) {
      throw new Error(`${cellRef} - Field is required.`);
    }

    if (!trimValue) {
      return { value: undefined };
    }

    let text = trimValue;

    if (!item.validationProps.textTruncate) {
      // normalize whitespace to a single space between words.
      text = text.replace(/\s+/g, " ");
    }

    if (!item?.validationProps?.allowSpaces) {
      // Remove all whitespace characters
      text = text.replace(/ /g, "");
    }

    if (!item?.validationProps?.allowSpecialCharacters) {
      // Remove all non-alphanumeric characters except basic punctuation and Greek letters
      text = text.replace(/[^\w\sά-ώΑ-Ω]/g, "");
    }

    // validate with ajv item.JSONSchema
    const { errorText }= validateData(text, item.JSONSchema);
    if (errorText) {
      throw new Error(`${cellRef} - Invalid data: value ${errorText}`);
    }

    return { value: text };
  } catch (err) {
    console.error('parseTextField', err.message);
    return { error: err.message };
  }
}

function parseMultiTextField(item, cellRef, cellValue) {
  // cellValue: "en: English text; el: Ελληνικό κείμενο"
  try {
    const trimValue = cellValue?.trim();
    if (item.isRequired && !trimValue) {
      throw new Error(`${cellRef} - Field is required.`);
    }

    if (!trimValue) {
      return { value: undefined };
    }

    const entries = trimValue?.split(";").map((entry) => entry.trim().split(":"));

    if (entries.length !== 2 && entries.some((entry) => entry.length !== 2)) {
      throw new Error(`${cellRef} - Incorrect format. Expected 'EN: text; EL: κείμενο'.`);
    }

    const parsedValue = entries.map(([key, val]) => {
      const lang = (key || "")?.trim()?.toLowerCase();
      let text = (val || "")?.trim();

      if (!["en", "el"].includes(lang)) {
        throw new Error(`${cellRef} - Unsupported language '${lang}'.`);
      }

      if (!text) {
        throw new Error(`${cellRef} - Text for '${lang}' cannot be empty.`);
      }

      if (!item?.validationProps?.textTruncate) {
        // normalize whitespace to a single space between words.
        text = text.replace(/\s+/g, " ");
      }

      if (!item?.validationProps?.allowSpaces) {
        // Remove all whitespace characters
        text = text.replace(/ /g, "");
      }

      if (!item?.validationProps?.allowSpecialCharacters) {
        // Remove all non-alphanumeric characters except basic punctuation and Greek letters
        text = text.replace(/[^\w\sά-ώΑ-Ω]/g, "");
      }

      return { languageID: lang, text };
    });

    // validate with ajv item.JSONSchema
    const { errorText }= validateData(parsedValue, item.JSONSchema);
    if (errorText) {
      throw new Error(`${cellRef} - Invalid data: value ${errorText}`);
    }

    return { value: parsedValue };
  } catch (err) {
    console.error('parseMultiTextField', err.message);
    return { error: err.message };
  }
}

function parseNumberField(item, cellRef, cellValue) {
  // cellValue: 10
  try {
    if (item.isRequired && cellValue == null) {
      throw new Error(`${cellRef} - Field is required.`);
    }

    if (cellValue == null) {
      return { value: undefined };
    }

    let number = parseFloat(cellValue);

    if (isNaN(number) || !isFinite(number)) {
      throw new Error(`${cellRef} - Not a valid number.`);
    }

    if (item.validationProps.decimalPlaces != null) {
      // This truncates the number to the specified number of decimal places
      number = parseFloat(number.toFixed(item.validationProps.decimalPlaces));
    }

    // validate with ajv item.JSONSchema
    const { errorText }= validateData(number, item.JSONSchema);
    if (errorText) {
      throw new Error(`${cellRef} - Invalid data: value ${errorText}`);
    }

    return { value: number };
  } catch (err) {
    console.error('parseNumberField', err.message);
    return { error: err.message };
  }
}

function findOptionFromList(item, cellRef, cellValue, list, scope) {
  try {
    const trimValue = cellValue?.trim();
    if (item.isRequired && !trimValue) {
      throw new Error(`${cellRef} - Field is required.`);
    }

    if (!trimValue) {
      return { value: undefined };
    }

    const option = list.find((opt) => {
      return transformText(opt.label) === transformText(trimValue);
    });

    if (!option) {
      throw new Error(`${cellRef} - No related option found. check options list.`);
    }

    if (scope === "category") {
      const parsedValue = { id: option.value, text: option.label };

      // validate with ajv item.JSONSchema
      const { errorText }= validateData(parsedValue, item.JSONSchema);
      if (errorText) {
        throw new Error(`${cellRef} - Invalid data: value ${errorText}`);
      }

      return { value: parsedValue };
    }

    return { value: option.value };
  } catch (err) {
    console.error('findOptionFromList', err.message);
    return { error: err.message };
  }
}

function parseFileField(item, cellRef, cellValue) {
  // cellValue: report_final_version.pdf
  try {
    const trimValue = cellValue?.trim();
    if (item.isRequired && !trimValue) {
      throw new Error(`${cellRef} - Field is required.`);
    }

    if (!trimValue) {
      return { value: undefined };
    }

    const parsedValue = { fileSrc: trimValue };

    // validate with ajv item.JSONSchema
    const { errorText }= validateData(parsedValue, item.JSONSchema);
    if (errorText) {
      throw new Error(`${cellRef} - Invalid data: value ${errorText}`);
    }

    return { value: parsedValue };
  } catch (err) {
    console.error('parseFileField', err.message);
    return { error: err.message };
  }
}

function parseMapField(item, cellRef, cellValue) {
  // cellValue: "LAT: 38.0827; LNG: 23.7744"
  try {
    const trimValue = cellValue?.trim();
    if (item.isRequired && !trimValue) {
      throw new Error(`${cellRef} - Field is required.`);
    }

    if (!trimValue) {
      return { value: undefined };
    }

    const entries = trimValue
      ?.split(";")
      .map((entry) => entry.trim().split(":"))
      .reduce((acc, [key, val]) => {
        key = (key || "")?.trim().toLowerCase();
        val = (val || "")?.trim();

        if (!["lat", "lng"].includes(key)) {
          throw new Error(`${cellRef} - Unexpected key '${key}'. Only 'LAT' and 'LNG' are acceptable.`);
        }

        acc[key] = val;
        return acc;
      }, {});

    if (Object.keys(entries).length !== 2 || entries.lat == null || !entries.lng == null) {
      throw new Error(`${cellRef} - Incorrect format. Expected 'LAT: value; LNG: value'.` );
    }

    const lat = parseFloat(entries.lat);
    const lng = parseFloat(entries.lng);

    if (isNaN(lat) || isNaN(lng)) {
      throw new Error(`${cellRef} - Latitude and Longitude must be valid numbers.`);
    }

    if (lat < -90 || lat > 90) {
      throw new Error( `${cellRef} - Latitude '${lat}' out of bounds. Must be between -90 and 90.`);
    }

    if (lng < -180 || lng > 180) {
      throw new Error(`${cellRef} - Longitude '${lng}' out of bounds. Must be between -180 and 180.`);
    }

    const parsedValue = { latitude: lat, longitude: lng };

    // validate with ajv item.JSONSchema
    const { errorText }= validateData(parsedValue, item.JSONSchema);
    if (errorText) {
      throw new Error(`${cellRef} - Invalid data: value ${errorText}`);
    }

    return { value: parsedValue };
  } catch (err) {
    console.error('parseMapField', err.message);
    return { error: err.message };
  }
}

function parseSingleDateField(item, cellRef, cellValue) {
  // cellValue: "2024-01-01 00:00:00"
  try {
    const trimValue = cellValue?.trim();
    if (item.isRequired && !trimValue) {
      throw new Error(`${cellRef} - Field is required.`);
    }

    if (!trimValue) {
      return { value: undefined };
    }

    // Convert string parts to dates
    let date_value = new Date(trimValue);

    // Validate that date_value are real date and not 'Invalid Date'
    const isValidDate = date_value.toString() !== "Invalid Date";

    if (!isValidDate) {
      throw new Error(`${cellRef} - Invalid date.`);
    }

    const parsedValue = date_value.toISOString();

    // validate with ajv item.JSONSchema
    const { errorText }= validateData(parsedValue, item.JSONSchema);
    if (errorText) {
      throw new Error(`${cellRef} - Invalid data: value ${errorText}`);
    }

    return { value: parsedValue };
  } catch (err) {
    console.error('parseSingleDateField', err.message);
    return { error: err.message };
  }
}

function parsePeriodDateField(item, cellRef, cellValue) {
  // cellValue: "FROM: 2024-01-01 00:00:00; TO: 2024-01-31 23:59:59"
  try {
    const trimValue = cellValue?.trim();
    if (item.isRequired && !trimValue) {
      throw new Error(`${cellRef} - Field is required.`);
    }

    const entries = trimValue
    ?.split(";")
    .map((entry) => {
        const index = entry.indexOf(':');
        if (index === -1) {
            throw new Error(`${cellRef} - Incorrect format. Each entry must contain a colon ':' separating the key and value.`);
        }
        const key = entry.substring(0, index).trim().toLowerCase();
        const value = entry.substring(index + 1).trim();
        return [key, value];
    });

    if (entries.length !== 2 || entries.some((entry) => entry.length !== 2)) {
      throw new Error(`${cellRef} - Incorrect format. Expected 'FROM: date; TO: date'.`);
    }

    const dateEntries = {};
    entries.forEach(([key, val]) => {
      let dateKey = (key || "").trim().toLowerCase();
      let dateStr = (val || "").trim();

      if (!["from", "to"].includes(dateKey)) {
        throw new Error(`${cellRef} - Unsupported date key '${dateKey}'. Only 'FROM' and 'TO' are accepted.`);
      }

      const date = new Date(dateStr);
      if (date.toString() === "Invalid Date") {
        throw new Error(`${cellRef} - Invalid date format for '${dateKey}'.`);
      }
      dateEntries[dateKey] = date;
    });

    if (!dateEntries.from || !dateEntries.to) {
      throw new Error(`${cellRef} - Both 'FROM' and 'TO' dates must be provided.`);
    }

    const parsedValue = { 
      dateFrom: dateEntries.from.toISOString(), 
      dateTo: dateEntries.to .toISOString()
    };

    // validate with ajv item.JSONSchema
    const { errorText }= validateData(parsedValue, item.JSONSchema);
    if (errorText) {
      throw new Error(`${cellRef} - Invalid data: value ${errorText}`);
    }

    return parsedValue;
  } catch (err) {
    console.error('parsePeriodDateField', err.message);
    return { error: err.message };
  }
}

function parseMeasurementField(item, cellRef, cellValue) {
  // cellValue: "1000 kW/h" or "1000 kW"
  try {
    const trimValue = cellValue?.trim();
    if (item.isRequired && !trimValue) {
      throw new Error(`${cellRef} - Field is required.`);
    }

    if (!trimValue) {
      return { value: undefined };
    }

    const parts = trimValue.split(" ").map((el) => el?.trim());
    if (parts.length !== 2) {
      throw new Error(`${cellRef} - Incorrect format. Expected 'value unit'.`);
    }

    let [numberStr, unit] = parts;
    let number = parseFloat(numberStr);

    if (isNaN(number) || !isFinite(number)) {
      throw new Error(`${cellRef} - Not a valid number.`);
    }

    if (item.validationProps.decimalPlaces != null) {
      // This truncates the number to the specified number of decimal places
      number = parseFloat(number.toFixed(item.validationProps.decimalPlaces));
    }

    if (item.measureType === "single" && unit.includes("/")) {
      throw new Error(`${cellRef} - Fraction not allowed for single measurement.`);
    }

    if (item.measureType === "fraction" && !unit.includes("/")) {
      throw new Error(`${cellRef} - Fraction required for measurement.`);
    }

    let numerator = null;
    let denominator = null;
    if (unit.includes("/")) {
      [numerator, denominator] = unit.split("/");
      if (!denominator) {
        throw new Error(`${cellRef} - Denominator is missing in fraction.`);
      }
    } else {
      numerator = unit;
    }

    const parsedValue = {
      value: number,
      numerator: 1,
      denominator: 2,
    };

    // validate with ajv item.JSONSchema
    const { errorText }= validateData(parsedValue, item.JSONSchema);
    if (errorText) {
      throw new Error(`${cellRef} - Invalid data: value ${errorText}`);
    }

    return { value: parsedValue };
  } catch (err) {
    console.error('parseMeasurementField', err.message);
    return { error: err.message };
  }
}

module.exports = {
  parseFileField,
  parseMapField,
  parseTextField,
  parseMultiTextField,
  parseNumberField,
  findOptionFromList,
  parseSingleDateField,
  parsePeriodDateField,
  parseMeasurementField,
};
