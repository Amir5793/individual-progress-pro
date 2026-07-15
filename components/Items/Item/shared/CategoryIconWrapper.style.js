import styled from "styled-components";

export const CategoryIconWrapper = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  background: ${({ $color }) => $color};
  color: white;

  svg {
    width: 24px;
    height: 24px;
  }
`;