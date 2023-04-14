import React, { useEffect } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import Theme from "@/styles/Theme";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import axios from "axios";
import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "@/contexts/AuthContext";
import type { Session } from "next-auth";
import { useRouter } from "next/router";

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

  // useEffect(() => {
  //   axios.defaults.withCredentials = true;
  //   localStorage.debug = process.env.NEXT_PUBLIC_DEBUG as string;

  //   const getCsrfToken = async () => {
  //     if (process.env.NEXT_PUBLIC_API_URL) {
  //       const { data } = await axios.get<Csrf>(
  //         `${process.env.NEXT_PUBLIC_API_URL}/auth/csrf`
  //       );
  //       axios.defaults.headers.common["csrf-token"] = data.csrfToken;
  //     }
  //   };

  //   getCsrfToken();
  // }, [router, session]);

  return (
    <ChakraProvider>
      <QueryClientProvider client={queryClient}>
        {/* <AuthProvider> */}
          <SessionProvider session={session}>
            <Component {...pageProps} />
          </SessionProvider>
        {/* </AuthProvider> */}
        <ReactQueryDevtools />
      </QueryClientProvider>
    </ChakraProvider>
  );
};
export default MyApp;
