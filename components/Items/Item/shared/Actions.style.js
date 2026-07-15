import styled from "styled-components";

export const Actions = styled.div`
  display: flex;
  gap: 8px;
  align-items: ${({ $align }) => $align ?? "stretch"};
`;