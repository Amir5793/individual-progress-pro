import styled from "styled-components";

export const LeftSection = styled.div`
  display: flex;
  gap: 16px;
  flex: 1;
  min-width: ${({ $minWidth }) => $minWidth ?? "auto"};
`;