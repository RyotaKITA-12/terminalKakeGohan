import styled from "styled-components";

type color = {
  color: string;
};

const ColorButton = styled.div<color>`
  background-color: ${(p) => p.color};
`;

export { ColorButton };
