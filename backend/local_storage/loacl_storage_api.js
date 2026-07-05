/**
 * localStorage RESTful API handler with optional validation.
 * @param {string} method - 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'
 * @param {string} key - The storage key
 * @param {*} [value] - The value to store (required for POST, PUT, PATCH)
 * @param {Function} [validation] - Optional validation function for POST and PUT.
 *   Must return `true` or `{ valid: true }` on success,
 *   or `false`, `{ valid: false, error?: string }` on failure.
 * @returns {{ success: boolean, data?: any, error?: string, status?: number }}
 */
export function localStorageHandler(method, key, value, validation) {
    // Validate key for all methods except GET all
    if (method !== 'GET' && !key) {
        return { success: false, error: 'Key is required for this method.', status: 400 };
    }

    // For POST and PUT, if validation is provided, run it
    if (['POST', 'PUT'].includes(method.toUpperCase()) && validation) {
        if (typeof validation !== 'function') {
            return { success: false, error: 'Validation must be a function.', status: 400 };
        }
        const result = validation(value);
        // Check result: boolean or object
        const isValid = typeof result === 'boolean' ? result : result?.valid === true;
        if (!isValid) {
            const errorMsg = typeof result === 'object' && result.error ? result.error : 'Validation failed.';
            return { success: false, error: errorMsg, status: 400 };
        }
    }

    try {
        switch (method.toUpperCase()) {
            case 'GET': {
                if (!key) {
                    // Get all keys and values
                    const allData = {};
                    for (let i = 0; i < localStorage.length; i++) {
                        const k = localStorage.key(i);
                        try {
                            allData[k] = JSON.parse(localStorage.getItem(k));
                        } catch {
                            allData[k] = localStorage.getItem(k);
                        }
                    }
                    return { success: true, data: allData, status: 200 };
                }
                const item = localStorage.getItem(key);
                if (item === null) {
                    return { success: false, error: `Item with key "${key}" not found.`, status: 404 };
                }
                try {
                    const parsed = JSON.parse(item);
                    return { success: true, data: parsed, status: 200 };
                } catch {
                    return { success: true, data: item, status: 200 };
                }
            }

            case 'POST': {
                if (localStorage.getItem(key) !== null) {
                    return { success: false, error: `Item with key "${key}" already exists. Use PUT to update.`, status: 409 };
                }
                const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
                localStorage.setItem(key, stringValue);
                return { success: true, data: { key, value }, status: 201 };
            }

            case 'PUT': {
                const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
                localStorage.setItem(key, stringValue);
                return { success: true, data: { key, value }, status: 200 };
            }

            case 'PATCH': {
                const existing = localStorage.getItem(key);
                if (existing === null) {
                    return { success: false, error: `Item with key "${key}" not found.`, status: 404 };
                }
                let existingData;
                try {
                    existingData = JSON.parse(existing);
                } catch {
                    return { success: false, error: 'Cannot PATCH a non‑JSON value.', status: 400 };
                }
                if (typeof existingData !== 'object' || Array.isArray(existingData)) {
                    return { success: false, error: 'PATCH only works on plain objects.', status: 400 };
                }
                const patchData = typeof value === 'object' && !Array.isArray(value) ? value : JSON.parse(value);
                const merged = { ...existingData, ...patchData };
                localStorage.setItem(key, JSON.stringify(merged));
                return { success: true, data: merged, status: 200 };
            }

            case 'DELETE': {
                if (localStorage.getItem(key) === null) {
                    return { success: false, error: `Item with key "${key}" not found.`, status: 404 };
                }
                localStorage.removeItem(key);
                return { success: true, data: { key }, status: 200 };
            }

            default:
                return { success: false, error: `Unsupported method: ${method}`, status: 400 };
        }
    } catch (error) {
        return { success: false, error: error.message, status: 500 };
    }
}

// Convenience methods with validation support
export const get = (key) => localStorageHandler('GET', key);
export const post = (key, value, validation) => localStorageHandler('POST', key, value, validation);
export const put = (key, value, validation) => localStorageHandler('PUT', key, value, validation);
export const patch = (key, value) => localStorageHandler('PATCH', key, value);
export const del = (key) => localStorageHandler('DELETE', key);