// StyledPaymentOptions.tsx
import theme from "@/themes/Style";
import React from "react";
import styled from "styled-components";

const Button = styled.button`
  padding: 17px 40px;
  background: ${theme.color.cloud};
  border-radius: 11px;
  border: 0;
`;

interface Props {
  children: React.ReactNode;
}

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
}

export const ButtonIcon: React.FC<ButtonProps> = ({ children, onClick }) => {
  return <Button onClick={onClick}>{children}</Button>;
};

export default ButtonIcon;
