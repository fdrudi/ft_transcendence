// StyledPaymentOptions.tsx
import React from 'react';
import styled from 'styled-components';

const Button = styled.button`
  height: 55px;
  background: #f2f2f2;
  border-radius: 11px;
  padding: 0;
  border: 0;
  outline: none;

  svg {
    height: 18px;
  }

  &:last-child svg {
    height: 22px;
  }
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
