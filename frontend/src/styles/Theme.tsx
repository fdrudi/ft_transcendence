import { ReactNode } from 'react';
import { ThemeProvider } from '@emotion/react'
// import {ThemeP} from '@emotion/styled';
import theme from '../themes/Style';
import GlobalStyles from './GlobalStyles';

interface ThemeProps {
  children: ReactNode;
}

const Theme = ({ children }: ThemeProps) => (
  <ThemeProvider theme={theme}>
    <GlobalStyles />
    {children}
  </ThemeProvider>
);

export default Theme;
