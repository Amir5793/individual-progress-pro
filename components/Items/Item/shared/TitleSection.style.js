import styled from "styled-components";

export const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ $gap }) => $gap ?? "5px"};
  min-width: ${({ $minWidth }) => $minWidth ?? "auto"};
  flex: ${({ $flex }) => $flex ?? "initial"};
`;