"use client";

import {
    GraduationCap, Code2, Heart, Dumbbell, Wallet, User, Briefcase, BookOpen, Brain, Laptop, Circle,
} from "lucide-react";


/* ==========================================================
   CATEGORY CONFIG
========================================================== */

export const categories = {
    Learning: {
        icon: GraduationCap, color: "var(--accent-purple)",
    },

    Coding: {
        icon: Code2, color: "var(--accent-blue)",
    },

    Career: {
        icon: Briefcase, color: "var(--accent-blue)",
    },

    Health: {
        icon: Heart, color: "var(--accent-green)",
    },

    Fitness: {
        icon: Dumbbell, color: "var(--accent-green)",
    },

    Finance: {
        icon: Wallet, color: "var(--accent-yellow)",
    },

    Personal: {
        icon: User, color: "var(--accent-red)",
    },

    Reading: {
        icon: BookOpen, color: "var(--accent-purple)",
    },

    Knowledge: {
        icon: Brain, color: "var(--accent-purple)",
    },

    Programming: {
        icon: Laptop, color: "var(--accent-blue)",
    },
};

const defaultCategory = {
    icon: Circle, color: "var(--text-muted)",
};

export function getCategoryConfig(category) {
    return categories[category] || defaultCategory;
}

export function getCategoryIcon(category) {
    return getCategoryConfig(category).icon;
}

export function getCategoryColor(category) {
    return getCategoryConfig(category).color;
}
