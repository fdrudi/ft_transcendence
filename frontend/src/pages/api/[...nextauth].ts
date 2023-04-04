import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FortyTwoProvider from "next-auth/providers/42-school";
import GitHubProvider from "next-auth/providers/github";

export default NextAuth({
  providers: [
    FortyTwoProvider({
      clientId: process.env.NEXT_PUBLIC_FORTY_TWO_CLIENT_ID as string,
      clientSecret: process.env.API42_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID || "0",
      clientSecret: process.env.GITHUB_SECRET || "0",
    }),
  ],
  callbacks: {
    signIn() {
      return true;
    },

    jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }

      return token;
    },

    session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub;
        session.user.accessToken = token.accessToken;
      }

      return session;
    },
  },
  secret: process.env.JWT_SECRET,
});
