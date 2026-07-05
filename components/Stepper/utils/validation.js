// validation.js
// Defines validation rules for each step of the goal‑setting wizard.
// Supports both "task" and "habit" modes.

// ---------- Constants ----------
const DIFFICULTY_LEVELS = ['low', 'medium', 'hard', 'almost impossible'];
const ENERGY_LEVELS = ['low', 'medium', 'much', 'life or death'];

// ---------- Helpers ----------
const isNonEmptyString = (val) => typeof val === 'string' && val.trim().length > 0;
const isEnum = (val, allowed) => allowed.includes(val);
const isDate = (val) => val instanceof Date && !isNaN(val.getTime());

// ---------- Task Mode Validators ----------
/**
 * Validate the goal title (Task Step 1)
 */
export const validateTitle = (value) => {
    if (!isNonEmptyString(value)) {
        return { valid: false, error: 'Title is required.' };
    }
    const trimmed = value.trim();
    if (trimmed.length < 3) {
        return { valid: false, error: 'Title must be at least 3 characters.' };
    }
    if (trimmed.length > 80) {
        return { valid: false, error: 'Title cannot exceed 80 characters.' };
    }
    return { valid: true };
};

/**
 * Validate the reason (Task Step 2 / Habit Step 7) – optional
 */
export const validateReason = (value) => {
    if (value === undefined || value === null || value === '') {
        return { valid: true }; // optional
    }
    if (typeof value !== 'string') {
        return { valid: false, error: 'Reason must be text.' };
    }
    if (value.length > 200) {
        return { valid: false, error: 'Reason cannot exceed 200 characters.' };
    }
    return { valid: true };
};

/**
 * Validate the completion criteria (Task Step 3)
 */
export const validateCompletionCriteria = (value) => {
    if (!isNonEmptyString(value)) {
        return { valid: false, error: 'Completion criteria are required.' };
    }
    const trimmed = value.trim();
    if (trimmed.length < 3) {
        return { valid: false, error: 'Criteria must be at least 3 characters.' };
    }
    if (trimmed.length > 100) {
        return { valid: false, error: 'Criteria cannot exceed 100 characters.' };
    }
    return { valid: true };
};

/**
 * Validate difficulty (Task Step 4)
 */
export const validateDifficulty = (value) => {
    if (!value || !isEnum(value, DIFFICULTY_LEVELS)) {
        return { valid: false, error: 'Please select a difficulty level.' };
    }
    return { valid: true };
};

/**
 * Validate energy level (Task Step 5)
 */
export const validateEnergy = (value) => {
    if (!value || !isEnum(value, ENERGY_LEVELS)) {
        return { valid: false, error: 'Please select an energy level.' };
    }
    return { valid: true };
};

/**
 * Validate deadline (Task Step 6) – optional; if provided must be a valid Date.
 */
export const validateDeadline = (value) => {
    if (value === null || value === undefined) {
        return { valid: true }; // "No deadline" is allowed
    }
    if (!isDate(value)) {
        return { valid: false, error: 'Invalid date.' };
    }
    return { valid: true };
};

/**
 * Validate category (Task Step 7)
 */
export const validateCategory = (value) => {
    if (!isNonEmptyString(value)) {
        return { valid: false, error: 'Category is required.' };
    }
    return { valid: true };
};

/**
 * Validate obstacle (Task Step 8 / Habit Step 6) – optional
 */
export const validateObstacle = (value) => {
    if (value === undefined || value === null || value === '') {
        return { valid: true }; // optional
    }
    if (typeof value !== 'string') {
        return { valid: false, error: 'Obstacle must be text.' };
    }
    return { valid: true };
};

/**
 * Validate fallback plan (Task Step 8) – optional
 */
export const validateFallbackPlan = (value) => {
    if (value === undefined || value === null || value === '') {
        return { valid: true }; // optional
    }
    if (typeof value !== 'string') {
        return { valid: false, error: 'Fallback plan must be text.' };
    }
    if (value.length > 200) {
        return { valid: false, error: 'Fallback plan cannot exceed 200 characters.' };
    }
    return { valid: true };
};

// ---------- Habit Mode Validators ----------
/**
 * Validate identity (Habit Step 1)
 * @param {string} value - The identity statement
 * @returns {{ valid: boolean, error?: string }}
 */
export const validateIdentity = (value) => {
    if (!isNonEmptyString(value)) {
        return { valid: false, error: 'Identity is required.' };
    }
    const trimmed = value.trim();
    if (trimmed.length < 3) {
        return { valid: false, error: 'Identity must be at least 3 characters.' };
    }
    if (trimmed.length > 60) {
        return { valid: false, error: 'Identity cannot exceed 60 characters.' };
    }
    return { valid: true };
};

/**
 * Validate minimum action (Habit Step 3)
 * @param {string} value - The smallest doable version
 * @returns {{ valid: boolean, error?: string }}
 */
export const validateMinimumAction = (value) => {
    if (!isNonEmptyString(value)) {
        return { valid: false, error: 'Minimum action is required.' };
    }
    const trimmed = value.trim();
    if (trimmed.length < 1) {
        return { valid: false, error: 'Minimum action must be at least 1 character.' };
    }
    if (trimmed.length > 60) {
        return { valid: false, error: 'Minimum action cannot exceed 60 characters.' };
    }
    return { valid: true };
};

/**
 * Validate target (Habit Step 4) – optional
 * @param {string} value - The ideal target
 * @returns {{ valid: boolean, error?: string }}
 */
export const validateTarget = (value) => {
    if (value === undefined || value == null || value === '') {
        return { valid: true }; // optional
    }
    if (typeof value !== 'string') {
        return { valid: false, error: 'Target must be text.' };
    }
    const trimmed = value.trim();
    if (trimmed.length < 1) {
        return { valid: false, error: 'Target must be at least 1 character.' };
    }
    if (trimmed.length > 60) {
        return { valid: false, error: 'Target cannot exceed 60 characters.' };
    }
    return { valid: true };
};

/**
 * Validate trigger (Habit Step 5) – optional
 * @param {string} value - The cue/trigger
 * @returns {{ valid: boolean, error?: string }}
 */
export const validateTrigger = (value) => {
    if (value === undefined || value == null || value === '') {
        return { valid: true }; // optional
    }
    if (typeof value !== 'string') {
        return { valid: false, error: 'Trigger must be text.' };
    }
    const trimmed = value.trim();
    if (trimmed.length < 1) {
        return { valid: false, error: 'Trigger must be at least 1 character.' };
    }
    return { valid: true };
};

// ---------- Overall Validation (for both modes) ----------
/**
 * Validate all fields of a goal/habit object.
 * @param {Object} data - The data object with all fields
 * @param {string} mode - 'task' or 'habit'
 * @returns {{ valid: boolean, errors: Object.<string, string> }}
 */
export const validateGoalData = (data, mode = 'task') => {
    const errors = {};
    let isValid = true;

    if (mode === 'task') {
        // Task mode validation
        const titleResult = validateTitle(data.title);
        if (!titleResult.valid) {
            errors.title = titleResult.error;
            isValid = false;
        }

        const reasonResult = validateReason(data.reason);
        if (!reasonResult.valid) {
            errors.reason = reasonResult.error;
            isValid = false;
        }

        const criteriaResult = validateCompletionCriteria(data.completionCriteria);
        if (!criteriaResult.valid) {
            errors.completionCriteria = criteriaResult.error;
            isValid = false;
        }

        const difficultyResult = validateDifficulty(data.difficulty);
        if (!difficultyResult.valid) {
            errors.difficulty = difficultyResult.error;
            isValid = false;
        }

        const energyResult = validateEnergy(data.energy);
        if (!energyResult.valid) {
            errors.energy = energyResult.error;
            isValid = false;
        }

        const deadlineResult = validateDeadline(data.deadline);
        if (!deadlineResult.valid) {
            errors.deadline = deadlineResult.error;
            isValid = false;
        }

        const categoryResult = validateCategory(data.category);
        if (!categoryResult.valid) {
            errors.category = categoryResult.error;
            isValid = false;
        }

        const obstacleResult = validateObstacle(data.obstacle);
        if (!obstacleResult.valid) {
            errors.obstacle = obstacleResult.error;
            isValid = false;
        }

        const fallbackResult = validateFallbackPlan(data.fallbackPlan);
        if (!fallbackResult.valid) {
            errors.fallbackPlan = fallbackResult.error;
            isValid = false;
        }
    } else if (mode === 'habit') {
        // Habit mode validation
        const identityResult = validateIdentity(data.identity);
        if (!identityResult.valid) {
            errors.identity = identityResult.error;
            isValid = false;
        }

        const titleResult = validateTitle(data.title); // Habit Action uses same rules as title
        if (!titleResult.valid) {
            errors.title = titleResult.error;
            isValid = false;
        }

        const minActionResult = validateMinimumAction(data.minimumAction);
        if (!minActionResult.valid) {
            errors.minimumAction = minActionResult.error;
            isValid = false;
        }

        const targetResult = validateTarget(data.target);
        if (!targetResult.valid) {
            errors.target = targetResult.error;
            isValid = false;
        }

        const triggerResult = validateTrigger(data.trigger);
        if (!triggerResult.valid) {
            errors.trigger = triggerResult.error;
            isValid = false;
        }

        const obstacleResult = validateObstacle(data.obstacle);
        if (!obstacleResult.valid) {
            errors.obstacle = obstacleResult.error;
            isValid = false;
        }

        const reasonResult = validateReason(data.reason);
        if (!reasonResult.valid) {
            errors.reason = reasonResult.error;
            isValid = false;
        }
    }

    return { valid: isValid, errors };
};

// ---------- Step Validation (for stepper) ----------
/**
 * Validate the data for a given step.
 * @param {number} currentStep - The step number (1‑based).
 * @param {any} value - The data collected at this step.
 * @param {string} mode - 'task' or 'habit' (default: 'task')
 * @param {number} [nextStep] - (Optional) next step, for future use.
 * @returns {{ valid: boolean, error?: string, errors?: Object }}
 */
export const validateStepInput = (currentStep, value, mode = 'task', nextStep) => {
    if (mode === 'task') {
        return validateTaskStep(currentStep, value);
    } else if (mode === 'habit') {
        return validateHabitStep(currentStep, value);
    }
    return { valid: false, error: `Unknown mode: ${mode}` };
};

// ---------- Task Mode Step Validation ----------
const validateTaskStep = (currentStep, value) => {
    switch (currentStep) {
        case 1:
            return runSingleValidator(value, validateTitle, 'title');
        case 2:
            return runSingleValidator(value, validateReason, 'reason');
        case 3:
            return runSingleValidator(value, validateCompletionCriteria, 'completionCriteria');
        case 4:
            return runSingleValidator(value, validateDifficulty, 'difficulty');
        case 5:
            return runSingleValidator(value, validateEnergy, 'energy');
        case 6:
            return runSingleValidator(value, validateDeadline, 'deadline');
        case 7:
            return runSingleValidator(value, validateCategory, 'category');
        case 8: {
            // value is an object with obstacle and fallbackPlan (both optional)
            const errors = {};
            let valid = true;

            if (value?.obstacle !== undefined && value.obstacle !== null) {
                const result = validateObstacle(value.obstacle);
                if (!result.valid) {
                    errors.obstacle = result.error;
                    valid = false;
                }
            }
            if (value?.fallbackPlan !== undefined && value.fallbackPlan !== null) {
                const result = validateFallbackPlan(value.fallbackPlan);
                if (!result.valid) {
                    errors.fallbackPlan = result.error;
                    valid = false;
                }
            }
            return { valid, errors: Object.keys(errors).length ? errors : undefined };
        }
        case 9:
            return { valid: true }; // Review step – no input
        default:
            return { valid: false, error: `Unknown task step: ${currentStep}` };
    }
};

// ---------- Habit Mode Step Validation ----------
const validateHabitStep = (currentStep, value) => {
    switch (currentStep) {
        case 1: // Identity
            return runSingleValidator(value, validateIdentity, 'identity');
        case 2: // Habit Action
            return runSingleValidator(value, validateTitle, 'title');
        case 3: // Tiny Habit (Minimum Action)
            return runSingleValidator(value, validateMinimumAction, 'minimumAction');
        case 4: // Ideal Target (optional)
            return runSingleValidator(value, validateTarget, 'target');
        case 5: // Cue/Trigger (optional)
            return runSingleValidator(value, validateTrigger, 'trigger');
        case 6: // Obstacles (optional – single field, no fallback)
            return runSingleValidator(value, validateObstacle, 'obstacle');
        case 7: // Motivation & Review (reason + summary)
            // value is the reason string (optional)
            return runSingleValidator(value, validateReason, 'reason');
        case 8: // No step 8 in habit mode
        case 9: // No step 9 in habit mode
            return { valid: true };
        default:
            return { valid: false, error: `Unknown habit step: ${currentStep}` };
    }
};

// ---------- Helper ----------
/**
 * Helper to validate a single field using a validator.
 * @param {any} value - The value to validate.
 * @param {Function} validator - A validator function.
 * @param {string} fieldName - Name of the field (for error reporting).
 * @returns {{ valid: boolean, error?: string }}
 */
const runSingleValidator = (value, validator, fieldName) => {
    const result = validator(value);
    return {
        valid: result.valid,
        error: result.valid ? undefined : result.error,
    };
};