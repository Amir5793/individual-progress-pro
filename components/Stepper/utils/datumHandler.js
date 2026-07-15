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
    reasonMode, // 'main', 'now', 'succeed' (only used when key === 'reason' and mode === 'goal')
    setErrors,
    setTitle,
    setReason,      // main reason
    setReasonNow,
    setReasonSucceed,
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
    setTrigger,
) => {
    // 1. Select validator
    let validator;
    if (mode === 'goal') {
        const goalValidators = {
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
        validator = goalValidators[key];
    } else if (mode === 'habit') {
        const habitValidators = {
            identity: validateIdentity,
            title: validateTitle,
            minimumAction: validateMinimumAction,
            target: validateTarget,
            trigger: validateTrigger,
            reason: validateReason,
            obstacle: validateObstacle,
            fallbackPlan: validateFallbackPlan,
        };
        validator = habitValidators[key];
    }

    // 2. Validate (but we validate the full reason object, not partial)
    // For reason, we'll validate on final submission; skip per‑field validation to avoid false errors.
    // So we only run validation if not dealing with a partial reason update.
    if (validator && !(key === 'reason' && mode === 'goal')) {
        const result = validator(value);
        if (!result.valid) {
            setErrors((prev) => ({ ...prev, [key]: result.error }));
        } else {
            setErrors((prev) => ({ ...prev, [key]: undefined }));
        }
    } else {
        // Clear any previous error for this field
        setErrors((prev) => ({ ...prev, [key]: undefined }));
    }

    // 3. Update individual state(s)
    if (key === 'reason' && mode === 'goal') {
        // Handle partial reason updates: merge with existing reason object
        const currentReason = {
            mainReason: setReason.state || '', // not ideal; better to use a ref, but we'll use the current state from component
            nowReason: setReasonNow?.state || '',
            succeedReason: setReasonSucceed?.state || '',
        };
        // Since we can't easily get current states, we'll rely on the component to pass the full object when needed.
        // Instead, we'll update the individual states based on reasonMode.
        if (reasonMode === 'main') {
            setReason(value.mainReason || '');
        } else if (reasonMode === 'now') {
            setReasonNow(value.now || ''); // the component sends { now: val }
        } else if (reasonMode === 'succeed') {
            setReasonSucceed(value.succeedReason || '');
        }
        // Also update datumCopy with merged object
        setDatum((prev) => {
            const copy = { ...prev };
            const newReason = { ...(copy.reason || {}) };
            if (reasonMode === 'main') {
                newReason.mainReason = value.mainReason || '';
            } else if (reasonMode === 'now') {
                newReason.nowReason = value.now || '';
            } else if (reasonMode === 'succeed') {
                newReason.succeedReason = value.succeedReason || '';
            }
            copy.reason = newReason;
            return copy;
        });
        return; // handled
    }

    // For other keys, update the corresponding setter
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

    // 4. Update datumCopy for non‑reason fields
    setDatum((prev) => {
        const copy = { ...prev };
        copy[key] = value;
        return copy;
    });
};

export { datumHandler };