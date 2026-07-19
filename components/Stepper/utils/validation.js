// validation.js
// Defines validation rules for each step of the Goal‑setting wizard.
// Supports both "goal" and "habit" modes.

// ---------- Constants ----------
const DIFFICULTY_LEVELS = ["low", "medium", "hard", "almost impossible"];
const ENERGY_LEVELS = ["low", "medium", "much", "life or death"];

// ---------- Helpers ----------
const isNonEmptyString = (val) =>
  typeof val === "string" && val.trim().length > 0;
const isEnum = (val, allowed) => allowed.includes(val);
const isDate = (val) => val instanceof Date && !isNaN(val.getTime());

// ---------- Goal Mode Validators ----------
/**
 * Validate the Goal title (Goal Step 2)
 */
export const validateTitle = (value) => {
  if (!isNonEmptyString(value)) {
    return { valid: false, error: "Title is required." };
  }
  const trimmed = value.trim();
  if (trimmed.length < 3) {
    return { valid: false, error: "Title must be at least 3 characters." };
  }
  if (trimmed.length > 80) {
    return { valid: false, error: "Title cannot exceed 80 characters." };
  }
  return { valid: true };
};

/**
 * Validate the reason (Goal Step 3 / Habit Step 7) – optional
 * Accepts an object with mainReason, nowReason, succeedReason (all optional)
 */
export const validateReason = (value) => {
  // If value is undefined, null, or an empty object → valid (optional)
  if (
    value === undefined ||
    value === null ||
    (typeof value === "object" && Object.keys(value).length === 0)
  ) {
    return { valid: true };
  }

  // If it's a string (for backward compatibility), treat as mainReason
  if (typeof value === "string") {
    if (value.length > 200) {
      return { valid: false, error: "Reason cannot exceed 200 characters." };
    }
    return { valid: true };
  }

  // Must be an object
  if (typeof value !== "object" || Array.isArray(value)) {
    return { valid: false, error: "Reason must be text or an object." };
  }

  // Check each field (only if present)
  const fields = ["mainReason", "nowReason", "succeedReason"];
  for (const field of fields) {
    if (value[field] !== undefined && value[field] !== null) {
      if (typeof value[field] !== "string") {
        return { valid: false, error: `Reason '${field}' must be text.` };
      }
      if (value[field].length > 200) {
        return {
          valid: false,
          error: `Reason '${field}' cannot exceed 200 characters.`,
        };
      }
    }
  }
  return { valid: true };
};

/**
 * Validate actions (Goal Step 4 – Plan/Roadmap)
 * At least one action is required; each action must have a non‑empty title.
 */
export const validateActions = (value) => {
  if (!Array.isArray(value) || value.length === 0) {
    return {
      valid: false,
      error: "At least one action is required to build a plan.",
    };
  }
  const invalidAction = value.find((a) => !a.title || a.title.trim() === "");
  if (invalidAction) {
    return { valid: false, error: "All actions must have a title." };
  }
  return { valid: true };
};

/**
 * Validate the completion criteria (Goal Step 5)
 */
export const validateCompletionCriteria = (value) => {
  if (!isNonEmptyString(value)) {
    return { valid: false, error: "Completion criteria are required." };
  }
  const trimmed = value.trim();
  if (trimmed.length < 3) {
    return { valid: false, error: "Criteria must be at least 3 characters." };
  }
  if (trimmed.length > 100) {
    return { valid: false, error: "Criteria cannot exceed 100 characters." };
  }
  return { valid: true };
};

/**
 * Validate difficulty (Goal Step 6)
 */
export const validateDifficulty = (value) => {
  if (!value || !isEnum(value, DIFFICULTY_LEVELS)) {
    return { valid: false, error: "Please select a difficulty level." };
  }
  return { valid: true };
};

/**
 * Validate energy level (Goal Step 7)
 */
export const validateEnergy = (value) => {
  if (!value || !isEnum(value, ENERGY_LEVELS)) {
    return { valid: false, error: "Please select an energy level." };
  }
  return { valid: true };
};

/**
 * Validate deadline (Goal Step 8) – optional; if provided must be a valid Date.
 */
export const validateDeadline = (value) => {
  if (value === null || value === undefined) {
    return { valid: true }; // "No deadline" is allowed
  }
  if (isDate(value)) {
    return { valid: true };
  }
  if (typeof value === "string") {
    const d = new Date(value);
    if (!isNaN(d.getTime())) return { valid: true };
  }
  return { valid: false, error: "Invalid date." };
};

/**
 * Validate category (Goal Step 9)
 */
export const validateCategory = (value) => {
  if (!isNonEmptyString(value)) {
    return { valid: false, error: "Category is required." };
  }
  return { valid: true };
};

/**
 * Validate obstacle (Goal Step 10 / Habit Step 6) – optional
 */
export const validateObstacle = (value) => {
  if (value === undefined || value === null || value === "") {
    return { valid: true }; // optional
  }
  if (typeof value !== "string") {
    return { valid: false, error: "Obstacle must be text." };
  }
  return { valid: true };
};

/**
 * Validate fallback plan (Goal Step 10) – optional
 */
export const validateFallbackPlan = (value) => {
  if (value === undefined || value === null || value === "") {
    return { valid: true }; // optional
  }
  if (typeof value !== "string") {
    return { valid: false, error: "Fallback plan must be text." };
  }
  if (value.length > 200) {
    return {
      valid: false,
      error: "Fallback plan cannot exceed 200 characters.",
    };
  }
  return { valid: true };
};

// ---------- Habit Mode Validators ----------
/**
 * Validate identity (Habit Step 1)
 */
export const validateIdentity = (value) => {
  if (!isNonEmptyString(value)) {
    return { valid: false, error: "Identity is required." };
  }
  const trimmed = value.trim();
  if (trimmed.length < 3) {
    return { valid: false, error: "Identity must be at least 3 characters." };
  }
  if (trimmed.length > 60) {
    return { valid: false, error: "Identity cannot exceed 60 characters." };
  }
  return { valid: true };
};

/**
 * Validate minimum action (Habit Step 3)
 */
export const validateMinimumAction = (value) => {
  if (!isNonEmptyString(value)) {
    return { valid: false, error: "Minimum action is required." };
  }
  const trimmed = value.trim();
  if (trimmed.length < 1) {
    return {
      valid: false,
      error: "Minimum action must be at least 1 character.",
    };
  }
  if (trimmed.length > 60) {
    return {
      valid: false,
      error: "Minimum action cannot exceed 60 characters.",
    };
  }
  return { valid: true };
};

/**
 * Validate target (Habit Step 4) – optional
 */
export const validateTarget = (value) => {
  if (value === undefined || value == null || value === "") {
    return { valid: true }; // optional
  }
  if (typeof value !== "string") {
    return { valid: false, error: "Target must be text." };
  }
  const trimmed = value.trim();
  if (trimmed.length < 1) {
    return { valid: false, error: "Target must be at least 1 character." };
  }
  if (trimmed.length > 60) {
    return { valid: false, error: "Target cannot exceed 60 characters." };
  }
  return { valid: true };
};

/**
 * Validate trigger (Habit Step 5) – optional
 */
export const validateTrigger = (value) => {
  if (value === undefined || value == null || value === "") {
    return { valid: true }; // optional
  }
  if (typeof value !== "string") {
    return { valid: false, error: "Trigger must be text." };
  }
  const trimmed = value.trim();
  if (trimmed.length < 1) {
    return { valid: false, error: "Trigger must be at least 1 character." };
  }
  return { valid: true };
};

// ---------- Overall Validation (for both modes) ----------
/**
 * Validate all fields of a Goal/habit object.
 * @param {Object} data - The data object with all fields
 * @param {string} mode - 'goal' or 'habit'
 * @returns {{ valid: boolean, errors: Object.<string, string> }}
 */
export const validateGoalData = (data, mode = "goal", goalOrTask) => {
  const errors = {};
  let isValid = true;

  if (mode === "goal") {
    // Goal mode validation
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
    if (!goalOrTask){
    const actionsResult = validateActions(data.actions);
    if (!actionsResult.valid) {
      errors.plan = actionsResult.error;
      isValid = false;
    }
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
  } else if (mode === "habit") {
    // Habit mode validation
    const identityResult = validateIdentity(data.identity);
    if (!identityResult.valid) {
      errors.identity = identityResult.error;
      isValid = false;
    }

    const titleResult = validateTitle(data.title);
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
 * @param {string} mode - 'goal' or 'habit' (default: 'goal')
 * @param {number} [nextStep] - (Optional) next step, for future use.
 * @returns {{ valid: boolean, error?: string, errors?: Object }}
 */
export const validateStepInput = (
  currentStep,
  value,
  mode = "goal",
  goalOrTask = false,
) => {
  if (mode === "goal") {
    return validateGoalStep(currentStep, value, goalOrTask);
  } else if (mode === "habit") {
    return validateHabitStep(currentStep, value);
  }
  return { valid: false, error: `Unknown mode: ${mode}` };
};

// ---------- Goal Mode Step Validation ----------
const validateGoalStep = (currentStep, value, goalOrTask) => {
  switch (currentStep) {
    case 1:
      return { valid: true };
    case 2:
      return runSingleValidator(value, validateTitle, "title");
    case 3:
      return runSingleValidator(value, validateReason, "reason");
    case 4:
      return runSingleValidator(
        value,
        validateCompletionCriteria,
        "completionCriteria",
      );

    case 5:
      if (!goalOrTask) {
        return runSingleValidator(value, validateActions, "plan");
      } else if (goalOrTask) {
        return runSingleValidator(value, validateDifficulty, "difficulty");
      }

    case 6:
      if (!goalOrTask) {
        return runSingleValidator(value, validateDifficulty, "difficulty");
      } else if (goalOrTask) {
        return runSingleValidator(value, validateEnergy, "energy");
      }
    case 7:
      if (!goalOrTask) {
        return runSingleValidator(value, validateEnergy, "energy");
      } else if (goalOrTask) {
        return runSingleValidator(value, validateDeadline, "deadline");
      }
    case 8:
      if (!goalOrTask) {
        return runSingleValidator(value, validateDeadline, "deadline");
      } else if (goalOrTask) {
        return runSingleValidator(value, validateCategory, "category");
      }
    case 9:
      if (!goalOrTask) {
        return runSingleValidator(value, validateCategory, "category");
      } else if (goalOrTask) {
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
        return {
          valid,
          errors: Object.keys(errors).length ? errors : undefined,
        };
      }
    case 10: {
      if (!goalOrTask) {
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
        return {
          valid,
          errors: Object.keys(errors).length ? errors : undefined,
        };
      } else if (goalOrTask) {
        return { valid: true };
      }
      // value is an object with obstacle and fallbackPlan (both optional)
    }
    case 11:
      return { valid: true };
    default:
      return { valid: false, error: `Unknown goal step: ${currentStep}` };
  }
};
// ---------- Habit Mode Step Validation ----------
const validateHabitStep = (currentStep, value) => {
  switch (currentStep) {
    case 1: // Identity
      return runSingleValidator(value, validateIdentity, "identity");
    case 2: // Habit Action
      return runSingleValidator(value, validateTitle, "title");
    case 3: // Tiny Habit (Minimum Action)
      return runSingleValidator(value, validateMinimumAction, "minimumAction");
    case 4: // Ideal Target (optional)
      return runSingleValidator(value, validateTarget, "target");
    case 5: // Cue/Trigger (optional)
      return runSingleValidator(value, validateTrigger, "trigger");
    case 6: // Category
      return runSingleValidator(value, validateCategory, "category");
    case 7: // Obstacles (optional – IF/THEN pattern)
    {
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
      return {
        valid,
        errors: Object.keys(errors).length ? errors : undefined,
      };
    }
    case 8: // Motivation & Review (reason + summary)
      return runSingleValidator(value, validateReason, "reason");
    case 9:
    case 10:
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
