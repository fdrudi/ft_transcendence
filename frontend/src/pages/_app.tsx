import * as React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { AppProps } from 'next/app';
import './index.tsx';
import Theme from '@/styles/Theme';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <Theme>
        <Component {...pageProps} />
      </Theme>
    </ChakraProvider>
  );
}

export default MyApp;
