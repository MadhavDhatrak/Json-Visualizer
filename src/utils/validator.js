import Ajv from 'ajv';

const ajv = new Ajv({ allErrors: true });

/**
 * Validates JSON data against a schema
 * @param {Object} schema - The JSON schema
 * @param {Object} data - The JSON data to validate
 * @returns {Object} - Validation result with isValid flag and errors array
 */
export const validateJson = (schema, data) => {
  try {
    const validate = ajv.compile(schema);
    const isValid = validate(data);
    
    return {
      isValid,
      errors: validate.errors || []
    };
  } catch (error) {
    return {
      isValid: false,
      errors: [{ message: error.message }]
    };
  }
};