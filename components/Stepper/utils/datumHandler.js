import {
    validateTitle,
    validateReason,
    validateCompletionCriteria,
    validateDifficulty,
    validateEnergy,
    validateDeadline,
    validateCategory,
    validateObstacle,
    validateFallbackPlan,
    validateIdentity,
    validateMinimumAction,
    validateTarget,
    validateTrigger,
} from './validation.js';

const datumHandler = (
    key,
    value,
    setDatum,
    mode,
    setErrors,
    setTitle,
    setReason,
    setCompletionCriteria,
    setDifficulty,
    setEnergy,
    setDeadline,
    setCategory,
    setObstacle,
    setFallbackPlan,
    setIdentity,
    setMinimumAction,
    setTarget,
    setTrigger,) => {
    // 1. Select the correct validator based on mode and field name
    let validator;
    if (mode === 'task') {
        const taskValidators = {
            title: validateTitle,
            reason: validateReason,
            completionCriteria: validateCompletionCriteria,
            difficulty: validateDifficulty,
            energy: validateEnergy,
            deadline: validateDeadline,
            category: validateCategory,
            obstacle: validateObstacle,
            fallbackPlan: validateFallbackPlan,
        };
        validator = taskValidators[key];
    } else if (mode === 'habit') {
        const habitValidators = {
            identity: validateIdentity,
            title: validateTitle,
            minimumAction: validateMinimumAction,
            target: validateTarget,
            trigger: validateTrigger,
            reason: validateReason,
            obstacle: validateObstacle,
            // fallbackPlan is not used in habit by default, but keep if needed
            fallbackPlan: validateFallbackPlan,
        };
        validator = habitValidators[key];
    }

    // 2. Run validation (if a validator exists for this field)
    if (validator) {
        const result = validator(value);
        if (!result.valid) {
            // Set error for this field
            setErrors((prev) => ({...prev, [key]: result.error}));
        } else {
            // Clear error for this field
            setErrors((prev) => ({...prev, [key]: undefined}));
        }
    } else {
        // No validator – clear any existing error for this field
        setErrors((prev) => ({...prev, [key]: undefined}));
    }

    // 3. Update the individual state (to keep UI inputs in sync)
    const setters = {
        title: setTitle,
        reason: setReason,
        completionCriteria: setCompletionCriteria,
        difficulty: setDifficulty,
        energy: setEnergy,
        deadline: setDeadline,
        category: setCategory,
        obstacle: setObstacle,
        fallbackPlan: setFallbackPlan,
        identity: setIdentity,
        minimumAction: setMinimumAction,
        target: setTarget,
        trigger: setTrigger,
    };
    const setter = setters[key];
    if (setter) {
        setter(value);
    }

    // 4. Update the datumCopy (the full object used for submission)
    setDatum((prev) => {
        const copy = {...prev};
        copy[key] = value;
        return copy;
    });
};
export {datumHandler}