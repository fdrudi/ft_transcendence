import React from "react";
import styled from "styled-components";
import theme from "@/themes/Style";

const Button = styled.button`
  padding: 17px 40px;
  border-radius: 50px;
  border: 0;
  background-color: white;
  box-shadow: ${theme.color.darkTransparent40} 0 0 8px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  font-size: 15px;
  transition: all 0.5s ease;

  &:hover {
    letter-spacing: 3px;
    background-color: hsl(261deg, 80%, 48%);
    color: ${theme.color.white};
    box-shadow: ${theme.color.mint} 0px 7px 29px 0px;
  }

  &:active {
    letter-spacing: 3px;
    background-color: hsl(261deg, 80%, 48%);
    color: ${theme.color.white};
    box-shadow: ${theme.color.mint} 0px 0px 0px 0px;
    transform: translateY(10px);
    transition: 100ms;
  }
`;

interface Props {
  text: string;
  onClick?: () => void;
  ref?: any;
}

const ButtonText: React.FC<Props> = ({ text, onClick, ref }) => {
  return (
    <Button onClick={onClick} ref={ref}>
      {text}
    </Button>
  );
};

export default ButtonText;
