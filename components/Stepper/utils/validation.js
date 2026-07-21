// validation.js
// Defines validation rules for each step of the Goal‑setting wizard.
// Supports both "goal" and "habit" modes.
// Error messages use translation keys (stepper.validation.*) for i18n.

// ---------- Constants ----------
const DIFFICULTY_LEVELS = ["low", "medium", "hard", "almost impossible"];
const ENERGY_LEVELS = ["low", "medium", "much", "life or death"];

// ---------- Helpers ----------
const isNonEmptyString = (val) =>
  typeof val === "string" && val.trim().length > 0;
const isEnum = (val, allowed) => allowed.includes(val);
const isDate = (val) => val instanceof Date && !isNaN(val.getTime());

// ---------- Goal Mode Validators ----------
export const validateTitle = (value) => {
  if (!isNonEmptyString(value)) {
    return { valid: false, error: "stepper.validation.title_required" };
  }
  const trimmed = value.trim();
  if (trimmed.length < 3) {
    return { valid: false, error: "stepper.validation.title_min" };
  }
  if (trimmed.length > 80) {
    return { valid: false, error: "stepper.validation.title_max" };
  }
  return { valid: true };
};

export const validateReason = (value) => {
  if (
    value === undefined ||
    value === null ||
    (typeof value === "object" && Object.keys(value).length === 0)
  ) {
    return { valid: true };
  }

  if (typeof value === "string") {
    if (value.length > 200) {
      return { valid: false, error: "stepper.validation.reason_max" };
    }
    return { valid: true };
  }

  if (typeof value !== "object" || Array.isArray(value)) {
    return { valid: false, error: "stepper.validation.reason_type" };
  }

  const fields = ["mainReason", "nowReason", "succeedReason"];
  for (const field of fields) {
    if (value[field] !== undefined && value[field] !== null) {
      if (typeof value[field] !== "string") {
        return { valid: false, error: "stepper.validation.reason_field_type" };
      }
      if (value[field].length > 200) {
        return { valid: false, error: "stepper.validation.reason_field_max" };
      }
    }
  }
  return { valid: true };
};

export const validateActions = (value) => {
  if (!Array.isArray(value) || value.length === 0) {
    return {
      valid: false,
      error: "stepper.validation.plan_required",
    };
  }
  const invalidAction = value.find((a) => !a.title || a.title.trim() === "");
  if (invalidAction) {
    return { valid: false, error: "stepper.validation.action_title_required" };
  }
  return { valid: true };
};

export const validateCompletionCriteria = (value) => {
  if (!isNonEmptyString(value)) {
    return { valid: false, error: "stepper.validation.completion_required" };
  }
  const trimmed = value.trim();
  if (trimmed.length < 3) {
    return { valid: false, error: "stepper.validation.criteria_min" };
  }
  if (trimmed.length > 100) {
    return { valid: false, error: "stepper.validation.criteria_max" };
  }
  return { valid: true };
};

export const validateDifficulty = (value) => {
  if (!value || !isEnum(value, DIFFICULTY_LEVELS)) {
    return { valid: false, error: "stepper.validation.difficulty_required" };
  }
  return { valid: true };
};

export const validateEnergy = (value) => {
  if (!value || !isEnum(value, ENERGY_LEVELS)) {
    return { valid: false, error: "stepper.validation.energy_required" };
  }
  return { valid: true };
};

export const validateDeadline = (value) => {
  if (value === null || value === undefined) {
    return { valid: true };
  }
  if (isDate(value)) {
    return { valid: true };
  }
  if (typeof value === "string") {
    const d = new Date(value);
    if (!isNaN(d.getTime())) return { valid: true };
  }
  return { valid: false, error: "stepper.validation.deadline_invalid" };
};

export const validateCategory = (value) => {
  if (!isNonEmptyString(value)) {
    return { valid: false, error: "stepper.validation.category_required" };
  }
  return { valid: true };
};

export const validateObstacle = (value) => {
  if (value === undefined || value === null || value === "") {
    return { valid: true };
  }
  if (typeof value !== "string") {
    return { valid: false, error: "stepper.validation.obstacle_type" };
  }
  return { valid: true };
};

export const validateFallbackPlan = (value) => {
  if (value === undefined || value === null || value === "") {
    return { valid: true };
  }
  if (typeof value !== "string") {
    return { valid: false, error: "stepper.validation.fallback_type" };
  }
  if (value.length > 200) {
    return { valid: false, error: "stepper.validation.fallback_max" };
  }
  return { valid: true };
};

// ---------- Habit Mode Validators ----------
export const validateIdentity = (value) => {
  if (!isNonEmptyString(value)) {
    return { valid: false, error: "stepper.validation.identity_required" };
  }
  const trimmed = value.trim();
  if (trimmed.length < 3) {
    return { valid: false, error: "stepper.validation.identity_min" };
  }
  if (trimmed.length > 60) {
    return { valid: false, error: "stepper.validation.identity_max" };
  }
  return { valid: true };
};

export const validateMinimumAction = (value) => {
  if (!isNonEmptyString(value)) {
    return { valid: false, error: "stepper.validation.minimum_action_required" };
  }
  const trimmed = value.trim();
  if (trimmed.length < 1) {
    return { valid: false, error: "stepper.validation.min_action_min" };
  }
  if (trimmed.length > 60) {
    return { valid: false, error: "stepper.validation.min_action_max" };
  }
  return { valid: true };
};

export const validateTarget = (value) => {
  if (value === undefined || value == null || value === "") {
    return { valid: true };
  }
  if (typeof value !== "string") {
    return { valid: false, error: "stepper.validation.target_type" };
  }
  const trimmed = value.trim();
  if (trimmed.length < 1) {
    return { valid: false, error: "stepper.validation.target_min" };
  }
  if (trimmed.length > 60) {
    return { valid: false, error: "stepper.validation.target_max" };
  }
  return { valid: true };
};

export const validateTrigger = (value) => {
  if (value === undefined || value == null || value === "") {
    return { valid: true };
  }
  if (typeof value !== "string") {
    return { valid: false, error: "stepper.validation.trigger_type" };
  }
  const trimmed = value.trim();
  if (trimmed.length < 1) {
    return { valid: false, error: "stepper.validation.trigger_min" };
  }
  return { valid: true };
};

// ---------- Overall Validation ----------
export const validateGoalData = (data, mode = "goal", goalOrTask) => {
  const errors = {};
  let isValid = true;

  if (mode === "goal") {
    const titleResult = validateTitle(data.title);
    if (!titleResult.valid) { errors.title = titleResult.error; isValid = false; }

    const reasonResult = validateReason(data.reason);
    if (!reasonResult.valid) { errors.reason = reasonResult.error; isValid = false; }

    if (!goalOrTask) {
      const actionsResult = validateActions(data.actions);
      if (!actionsResult.valid) { errors.plan = actionsResult.error; isValid = false; }
    }

    const criteriaResult = validateCompletionCriteria(data.completionCriteria);
    if (!criteriaResult.valid) { errors.completionCriteria = criteriaResult.error; isValid = false; }

    const difficultyResult = validateDifficulty(data.difficulty);
    if (!difficultyResult.valid) { errors.difficulty = difficultyResult.error; isValid = false; }

    const energyResult = validateEnergy(data.energy);
    if (!energyResult.valid) { errors.energy = energyResult.error; isValid = false; }

    const deadlineResult = validateDeadline(data.deadline);
    if (!deadlineResult.valid) { errors.deadline = deadlineResult.error; isValid = false; }

    const categoryResult = validateCategory(data.category);
    if (!categoryResult.valid) { errors.category = categoryResult.error; isValid = false; }

    const obstacleResult = validateObstacle(data.obstacle);
    if (!obstacleResult.valid) { errors.obstacle = obstacleResult.error; isValid = false; }

    const fallbackResult = validateFallbackPlan(data.fallbackPlan);
    if (!fallbackResult.valid) { errors.fallbackPlan = fallbackResult.error; isValid = false; }
  } else if (mode === "habit") {
    const identityResult = validateIdentity(data.identity);
    if (!identityResult.valid) { errors.identity = identityResult.error; isValid = false; }

    const titleResult = validateTitle(data.title);
    if (!titleResult.valid) { errors.title = titleResult.error; isValid = false; }

    const minActionResult = validateMinimumAction(data.minimumAction);
    if (!minActionResult.valid) { errors.minimumAction = minActionResult.error; isValid = false; }

    const targetResult = validateTarget(data.target);
    if (!targetResult.valid) { errors.target = targetResult.error; isValid = false; }

    const triggerResult = validateTrigger(data.trigger);
    if (!triggerResult.valid) { errors.trigger = triggerResult.error; isValid = false; }

    const categoryResult = validateCategory(data.category);
    if (!categoryResult.valid) { errors.category = categoryResult.error; isValid = false; }

    const obstacleResult = validateObstacle(data.obstacle);
    if (!obstacleResult.valid) { errors.obstacle = obstacleResult.error; isValid = false; }

    const reasonResult = validateReason(data.reason);
    if (!reasonResult.valid) { errors.reason = reasonResult.error; isValid = false; }
  }

  return { valid: isValid, errors };
};

// ---------- Step Validation ----------
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
  return { valid: false, error: "stepper.validation.unknown_mode" };
};

const validateGoalStep = (currentStep, value, goalOrTask) => {
  switch (currentStep) {
    case 1:
      return { valid: true };
    case 2:
      return runSingleValidator(value, validateTitle, "title");
    case 3:
      return runSingleValidator(value, validateReason, "reason");
    case 4:
      return runSingleValidator(value, validateCompletionCriteria, "completionCriteria");
    case 5:
      if (!goalOrTask) {
        return runSingleValidator(value, validateActions, "plan");
      } else if (goalOrTask) {
        return runSingleValidator(value, validateDifficulty, "difficulty");
      }
      break;
    case 6:
      if (!goalOrTask) {
        return runSingleValidator(value, validateDifficulty, "difficulty");
      } else if (goalOrTask) {
        return runSingleValidator(value, validateEnergy, "energy");
      }
      break;
    case 7:
      if (!goalOrTask) {
        return runSingleValidator(value, validateEnergy, "energy");
      } else if (goalOrTask) {
        return runSingleValidator(value, validateDeadline, "deadline");
      }
      break;
    case 8:
      if (!goalOrTask) {
        return runSingleValidator(value, validateDeadline, "deadline");
      } else if (goalOrTask) {
        return runSingleValidator(value, validateCategory, "category");
      }
      break;
    case 9:
      if (!goalOrTask) {
        return runSingleValidator(value, validateCategory, "category");
      } else if (goalOrTask) {
        return validateObstacleBundle(value);
      }
      break;
    case 10: {
      if (!goalOrTask) {
        return validateObstacleBundle(value);
      } else if (goalOrTask) {
        return { valid: true };
      }
      break;
    }
    case 11:
      return { valid: true };
    default:
      return { valid: false, error: "stepper.validation.unknown_goal_step" };
  }
};

const validateHabitStep = (currentStep, value) => {
  switch (currentStep) {
    case 1:
      return runSingleValidator(value, validateIdentity, "identity");
    case 2:
      return runSingleValidator(value, validateTitle, "title");
    case 3:
      return runSingleValidator(value, validateMinimumAction, "minimumAction");
    case 4:
      return runSingleValidator(value, validateTarget, "target");
    case 5:
      return runSingleValidator(value, validateTrigger, "trigger");
    case 6:
      return runSingleValidator(value, validateCategory, "category");
    case 7:
      return validateObstacleBundle(value);
    case 8:
      return runSingleValidator(value, validateReason, "reason");
    case 9:
    case 10:
      return { valid: true };
    default:
      return { valid: false, error: "stepper.validation.unknown_habit_step" };
  }
};

// ---------- Helpers ----------
const validateObstacleBundle = (value) => {
  const errors = {};
  let valid = true;

  if (value?.obstacle !== undefined && value.obstacle !== null) {
    const result = validateObstacle(value.obstacle);
    if (!result.valid) { errors.obstacle = result.error; valid = false; }
  }
  if (value?.fallbackPlan !== undefined && value.fallbackPlan !== null) {
    const result = validateFallbackPlan(value.fallbackPlan);
    if (!result.valid) { errors.fallbackPlan = result.error; valid = false; }
  }
  return {
    valid,
    errors: Object.keys(errors).length ? errors : undefined,
  };
};

const runSingleValidator = (value, validator, fieldName) => {
  const result = validator(value);
  return {
    valid: result.valid,
    error: result.valid ? undefined : result.error,
  };
};
