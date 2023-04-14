import theme from "@/themes/Style";
import React, { ChangeEvent, useState } from "react";
import styled from '@emotion/styled';

const InputGroup = styled.div`
  font-family: ${theme.font.main};
  margin: 1em 0 1em 0;
  width: 100%;
  position: relative;
`;

const Input = styled.input`
  font-size: 100%;
  padding: 0.8em;
  outline: none;
  border: 2px solid ${theme.color.steel20};
  background-color: transparent;
  border-radius: 20px;
  width: 100%;

  &:focus,
  &:valid {
    border-color: ${theme.color.navy};
  }
`;

const Label = styled.label<{ isFocusedOrFilled: boolean }>`
  font-size: 100%;
  position: absolute;
  left: 0;
  padding: 0.8em;
  margin-left: 0.5em;
  pointer-events: none;
  transition: all 0.3s ease;
  color: ${theme.color.dark};

  ${(props) =>
    props.isFocusedOrFilled &&
    `
    transform: translateY(-50%) scale(0.9);
    margin: 0em;
    margin-left: 1.3em;
    padding: 0.4em;
    background-color: ${theme.color.white};
  `}
`;

interface Props {
  label: string;
  isPassword?: boolean;
  inputValue: string;
  setInputValue: (value: string) => void;
}

const TextInput: React.FC<Props> = ({
  label,
  inputValue,
  setInputValue,
  isPassword,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const isFocusedOrFilled = isFocused || inputValue !== "";

  return (
    <InputGroup>
      <Input
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setInputValue(e.target.value)
        }
        required
        type={isPassword ? "password" : "text"}
      />
      {label ? (
        <Label isFocusedOrFilled={isFocusedOrFilled}>{label}</Label>
      ) : null}
    </InputGroup>
  );
};

export default TextInput;
