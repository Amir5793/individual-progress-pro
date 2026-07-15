import styled, { css } from "styled-components";

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ $gap }) => $gap ?? "18px"};

  padding: 22px;
  background: var(--card);
  border: 1px solid var(--card-border);
  border-radius: var(--radius-card);
  box-shadow: 0 2px 14px rgba(0, 0, 0, 0.22);
  cursor: pointer;

  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    border-color 0.18s ease;

  ${({ $completed }) =>
    $completed &&
    css`
      opacity: 0.72;
    `}

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.28);
    border-color: rgba(255, 255, 255, 0.12);
  }
`;