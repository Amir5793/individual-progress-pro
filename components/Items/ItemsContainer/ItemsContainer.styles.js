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

    max-height: calc(100vh - 120px);
    overflow-y: auto;

    scrollbar-width: thin;
    scrollbar-color: rgba(255,255,255,.15) transparent;

    &::-webkit-scrollbar {
        width: 6px;
    }
    &::-webkit-scrollbar-track {
        background: transparent;
    }
    &::-webkit-scrollbar-thumb {
        background: rgba(255,255,255,.15);
        border-radius: 3px;
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

    border: 2px dashed rgba(255,255,255,.08);
    border-radius: var(--radius-card);

    background: rgba(255,255,255,.02);

    color: var(--text-muted);

    font-size: .95rem;
    font-weight: 500;

    text-align: center;

    transition: .2s ease;

    &:hover{
        border-color: rgba(255,255,255,.12);
        background: rgba(255,255,255,.03);
    }
`;