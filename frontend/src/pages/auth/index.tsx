import axios from "axios";
import { useRouter } from "next/router";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { LoginResult, LoginResultStatus } from "@/types/utils";
import { UserInfo } from "@/types/auth";
import {
  AuthAlertCollapse,
  AuthAlert,
  Loading,
  ValidationDialog,
} from "@/components/atoms";
import { Link } from "@chakra-ui/react";

const Authenticate = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [openValidationDialog, setOpenValidationDialog] = useState(false);
  const [validationUserId, setValidationUserId] = useState(0);
  const [error, setError] = useState("");
  const tryingLogin = useRef(false);

  useEffect(() => {
    if (!session || !process.env.NEXT_PUBLIC_API_URL) return;

    const urlOauth = `${process.env.NEXT_PUBLIC_API_URL}/api/auth`;

    const isGoogleOAuth = (email: string | null | undefined) =>
      email && email.includes("gmail.com");
    const isFortyTwoOAuth = (email: string | null | undefined) =>
      email && email.includes("student.42roma.it");

    const googleLogin = async () => {
      // ...
    };

    const fortyTwoLogin = async () => {
      try {
        const response = await fetch("https://api.intra.42.fr/oauth/authorize", {
          // mode: 'cors',
          method: "GET",
          credentials: "include", // Important to send cookies
        });
        const data = await response.json();
        if (response.ok) {
          processAfterLogin(data);
        } else {
          setError("An error occurred while connecting with 42 OAuth.");
        }
      } catch (error) {
        console.error("Error when connecting with 42 OAuth:", error);
        setError("An error occurred while connecting with 42 OAuth.");
      }
    };

    const loginAfterOAuth = async () => {
      if (tryingLogin.current) return;
      tryingLogin.current = true;

      if (isGoogleOAuth(session.user.email)) {
        // Set up the connection with Google OAuth (to be completed)
      } else if (isFortyTwoOAuth(session.user.email)) {
        await fortyTwoLogin();
      } else {
        setError("Authentication method not supported.");
      }

      tryingLogin.current = false;
    };

    const processAfterLogin = async (loginResult: LoginResult) => {
      if (!loginResult) {
        setError("Login Failure");
        console.log("Login Failure");
      } else if (
        loginResult.res === LoginResultStatus.NEED2FA &&
        loginResult.userId !== undefined
      ) {
        setOpenValidationDialog(true);
        setValidationUserId(loginResult.userId);
      } else {
        router.push("/dashboard"); // Redirect the user the the page after login
      }
    };

    if (status === "authenticated") loginAfterOAuth();
    else if (status === "unauthenticated") router.push("/");
  }, [status, session, router]);

  const handleClose = useCallback(() => {
    setOpenValidationDialog(false);
    setValidationUserId(0);
    signOut({ callbackUrl: "/" });
  }, []);

  if (!session || status !== "authenticated") {
    return <Loading fullHeight />;
  }

  const readyRedirect = error !== "" && !openValidationDialog;

  return (
    <>
      <AuthAlertCollapse show={readyRedirect}>
        {/* <AuthAlert
          message={error}
          setMessage={setError}
          readyRedirect={readyRedirect}
        /> */}
      </AuthAlertCollapse>
      <ValidationDialog
        open={openValidationDialog}
        userId={validationUserId}
        onClose={handleClose}
      />
		<div>
      <nav>
        <li>
          <ul>
            <Link href="/"> home </Link>
          </ul>
          <ul>
            <Link href="/Blogs"> about </Link>{" "}
          </ul>
          <ul>
            <Link href="/Blogs/1"> about 1 </Link>{" "}
          </ul>
          <ul>
            <Link href="/authors"> author </Link>{" "}
          </ul>
          <ul>
            <Link href="/authors/1"> author 1</Link>{" "}
          </ul>
        </li>
      </nav>
    </div>
    </>
  );
};

export default Authenticate;
