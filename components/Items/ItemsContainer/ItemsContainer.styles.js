"use client";

import styled from "styled-components";

/* ==========================================================
   MAIN CONTAINER
========================================================== */

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 18px;

    width: 100%;
    min-width: 0;

    max-height: calc(100dvh - 180px);
    overflow-y: auto;

    scrollbar-width: thin;
    scrollbar-color: var(--scrollbar-thumb) transparent;

    &::-webkit-scrollbar {
        width: 6px;
    }
    &::-webkit-scrollbar-track {
        background: transparent;
    }
    &::-webkit-scrollbar-thumb {
        background: var(--scrollbar-thumb);
        border-radius: 3px;
    }

    @media (max-width: 1024px) {
        max-height: none;
        overflow: visible;
    }
`;

/* ==========================================================
   OVERVIEW GRID
========================================================== */

export const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));

    gap: 20px;

    width: 100%;

    @media (max-width: 992px) {
        grid-template-columns: 1fr;
    }
`;

/* ==========================================================
   COLUMN
========================================================== */

export const Column = styled.div`
    display: flex;
    flex-direction: column;
    gap: 18px;

    min-width: 0;
`;

/* ==========================================================
   COLUMN TITLE
========================================================== */

export const ColumnTitle = styled.h2`
    color: var(--text-primary);

    font-size: 1.25rem;
    font-weight: 700;

    margin-bottom: 4px;
`;

/* ==========================================================
   EMPTY STATE
========================================================== */

export const EmptyState = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;

    min-height: 220px;

    border: 2px dashed var(--interactive-border);
    border-radius: var(--radius-card);

    background: var(--subtle-bg);

    color: var(--text-muted);

    font-size: .95rem;
    font-weight: 500;

    text-align: center;

    transition: .2s ease;

    &:hover{
        border-color: var(--btn-secondary-hover);
        background: var(--subtle-bg-hover);
    }
`;
