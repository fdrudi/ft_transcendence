import React from "react";
import styled from '@emotion/styled';

const SeparatorContainer = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
`;

const SeparatorLine = styled.div`
  flex-grow: 1;
  height: 1px;
  background-color: #000;
`;

const SeparatorText = styled.span`
  padding: 0 10px;
`;

interface TextSeparatorProps {
  text: string;
}

const TextSeparator: React.FC<TextSeparatorProps> = ({ text }) => {
  return (
    <SeparatorContainer>
      <SeparatorLine />
      <SeparatorText>{text}</SeparatorText>
      <SeparatorLine />
    </SeparatorContainer>
  );
};

export default TextSeparator;
