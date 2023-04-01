import theme from '@/themes/Style';
import React, { useState } from 'react';
import styled from 'styled-components';

const InputGroup = styled.div`
  font-family: ${theme.font.main};
  margin: 1em 0 1em 0;
  width: 280px;
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
}

const TextInput: React.FC<Props> = ({ label }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const isFocusedOrFilled = isFocused || inputValue !== '';

  return (
    <InputGroup>
      <Input
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChange={(e) => setInputValue(e.target.value)}
        required
      />
      {label ? <Label isFocusedOrFilled={isFocusedOrFilled}>{label}</Label> : null}
    </InputGroup>
  );
};

export default TextInput;
