import theme from "@/themes/Style";
import React from "react";
import styled from '@emotion/styled';

const Modal = styled.div`
  width: fit-content;
  height: fit-content;
  background: ${theme.color.white};
  box-shadow: 0px 187px 75px rgba(0, 0, 0, 0.01),
    0px 105px 63px rgba(0, 0, 0, 0.05), 0px 47px 47px rgba(0, 0, 0, 0.09),
    0px 12px 26px rgba(0, 0, 0, 0.1), 0px 0px 0px rgba(0, 0, 0, 0.1);
  border-radius: 26px;
  max-width: 450px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
`;

interface Props {
  children: React.ReactNode;
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => "";
}

const ModalTemplate: React.FC<Props> = ({ children, onSubmit }) => (
  <Modal>
    <Form onSubmit={onSubmit}>{children}</Form>
  </Modal>
);

export default ModalTemplate;
