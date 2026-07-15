import styled from "styled-components";

export const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${({ $gap }) => $gap ?? "0"};
  flex-wrap: ${({ $wrap }) => $wrap ?? "nowrap"};
`;