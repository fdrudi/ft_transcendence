import React, { useEffect, useState } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import Theme from "@/styles/Theme";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import axios from "axios";
import { getSession, SessionProvider, useSession } from "next-auth/react";
import { AuthProvider } from "@/contexts/AuthContext";
import type { Session } from "next-auth";
import { useRouter } from "next/router";
import { Header } from "@/components/templates";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

export interface Csrf {
  csrfToken: string;
}

const MyApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) => {
  const router = useRouter();

  console.log(session);
  return (
    <ChakraProvider>
      <QueryClientProvider client={queryClient}>
          <SessionProvider session={session}>
			{!session && <Header/>}
            <Component {...pageProps} />
          </SessionProvider>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </ChakraProvider>
  );
};
export default MyApp;
