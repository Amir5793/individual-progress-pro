import { WIZARD_SET_FIELD, WIZARD_NEXT_STEP, WIZARD_PREV_STEP, WIZARD_RESET } from "./types";

function createBaseItem(mode) {
    const base = {
        id: "",
        type: mode,
        period: "daily",
        title: "",
        category: "",
        reason: {},
        obstacle: "",
        fallbackPlan: "",
        createdAt: new Date(),
    };

    if (mode === "goal") {
        return {
            ...base,
            completionCriteria: "",
            difficulty: "",
            energy: "",
            deadline: null,
            completed: false,
            completedAt: null,
        };
    }

    return {
        ...base,
        identity: "",
        minimumAction: "",
        target: "",
        trigger: "",
        preferredTime: "",
        streak: 0,
        completions: [],
    };
}

export const initialWizardState = {
    step: 1,
    mode: null,
    data: {},
    errors: {},
    isAchieveAbleInOneAction: false,
    showCalendar: false,
    actions: [],
    editingIndex: null,
    isEditing: false,
    showAddForm: false,
    newAction: {
        title: "",
        doneWhen: "",
        estimatedMinutes: 30,
        difficulty: "medium",
        resources: [],
        dependsOn: [],
        completed: false,
        completedAt: null,
    },
};

export function wizardReducer(state, action) {
    switch (action.type) {
        case WIZARD_SET_FIELD:
            return {
                ...state,
                data: {
                    ...state.data,
                    [action.field]: action.value,
                },
                errors: {
                    ...state.errors,
                    [action.field]: undefined,
                },
            };

        case WIZARD_NEXT_STEP:
            return {
                ...state,
                step: state.step + 1,
            };

        case WIZARD_PREV_STEP:
            return {
                ...state,
                step: Math.max(1, state.step - 1),
            };

        case WIZARD_RESET:
            return {
                ...initialWizardState,
                mode: action.mode,
                data: createBaseItem(action.mode),
            };

        default:
            return state;
    }
}
