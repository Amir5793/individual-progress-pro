import styled from "styled-components";

export const IconButton = styled.button`
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 10px;
  background: transparent;
  color: var(--text-secondary);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: 0.18s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    color: var(--text-primary);
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;