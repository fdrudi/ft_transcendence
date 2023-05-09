import Head from "next/head";
import {
  ButtonIcon,
  ButtonText,
  TextInput,
  TextSeparator,
} from "@/components/atoms";
import { GoogleIcon, Icon42 } from "../../public/Icons";
import styled from '@emotion/styled';
// import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { signIn, signOut, useSession } from "next-auth/react";
import { Header, ModalTemplate } from "@/components/templates";

const AuthOptions = styled.div`
  width: calc(100% - 40px);
  display: grid;
  grid-template-columns: 33% 34% 33%;
  gap: 20px;
  padding: 10px;
`;
// const inter = Inter({ subsets: ["latin"] });

const Home: React.FC = () => {
	const {data: session} = useSession();
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Formular submission action here!
  } ;
  const handleSignIn42 = async () => {
    await signIn("42-school", {
      callbackUrl: "/",
    });
  };

  const handleSignInGoogle = async () => {
    await signIn("google", {
      callbackUrl: "/",
    });

  };

  const handleSignInGithub = async () => {
    await signIn("github", {
      callbackUrl: "/",
    });
  };

  return (
	<div>
	<Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    <Header/>
	<main className={styles.main}>
	  {!session && (
		<>
		  <ModalTemplate onSubmit={handleSubmit}>
          <AuthOptions>
            <ButtonIcon onClick={handleSignInGoogle}>
              <GoogleIcon />
            </ButtonIcon>
            <ButtonIcon onClick={handleSignIn42}>
              <Icon42 />
            </ButtonIcon>
            <ButtonIcon onClick={handleSignInGithub}>
              <GoogleIcon />
            </ButtonIcon>
          </AuthOptions>
          <TextSeparator text="Or create an account" />
          <ButtonText text="Login" />
        </ModalTemplate>
		</>
	  )}
	  {session && (
		<>
		<div className={styles.circle}>
		</div>
		<div>
		  <h1>Successfully signed in as {session.user.email} </h1>
		</div>
		<div>
		  <ButtonIcon onClick={signOut}>sign out</ButtonIcon>
		</div>
		</>
	  )}
	</main>
  </div>
  );
};

export default Home;