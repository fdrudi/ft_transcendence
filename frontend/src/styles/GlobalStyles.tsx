import { css, Global } from '@emotion/react';
import { normalize } from 'styled-normalize';

import theme from '@/themes/Style';

const globalStyles = css`
  ${normalize?.toString()};

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  html {
    font-size: 62.5%;
    scroll-behavior: smooth;
  }
  body {
    font-family: ${theme.font.main};
    font-size: 1.6rem;
    background: ${theme.color.white};
    color: ${theme.color.mint};
    cursor: default;
    transition: 0.8s ease;
  }
  h1, h2, h3, h4, h5, h6, button {
    font-family: ${theme.font.title};
    transition: 0.8s ease;
  }
  a {
    text-decoration: none;
  }
  li {
    list-style: none;
  }
`;

const GlobalStyles = () => <Global styles={globalStyles} />;

export default GlobalStyles;
