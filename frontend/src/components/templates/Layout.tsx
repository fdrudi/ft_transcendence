import React, { ReactNode } from "react";
// import Header from '../components/Header/Header'
import styled from '@emotion/styled';

const Container = styled.div`
  max-width: 1280px;
  width: 100%;
  margin: auto;
`;

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Container>
      {/* <Header/> */}
      <main>{children}</main>
    </Container>
  );
};
