import { Alert, AlertTitle, AlertDescription } from "@chakra-ui/react";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";

type Props = {
  displayingTime?: number;
  message: string;
  setMessage: (message: string) => void;
  readyRedirect: boolean;
};

const DEFAULT_DISPLAYING_TIME = 3000;

const AuthAlert = ({
  displayingTime = DEFAULT_DISPLAYING_TIME,
  message,
  setMessage,
  readyRedirect,
}: Props) => {
  const [timeId, setTimeId] = useState<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    if (!readyRedirect) return;

    const id = setTimeout(() => {
      signOut({ callbackUrl: "/" });
    }, displayingTime);

    setTimeId(id);

    return () => {
      clearTimeout(timeId);
    };
  }, [readyRedirect, displayingTime]);

  useEffect(() => {
    if (message !== "" && !readyRedirect) {
      setMessage("");
      clearTimeout(timeId);
    }
  }, [message, readyRedirect, setMessage]);

  return (
    <Alert status="error" mb={2}>
      <AlertTitle>Authorization Error</AlertTitle>
      <AlertDescription>
        {message} -{" "}
        <strong>It will automatically redirect to login page</strong>
      </AlertDescription>
    </Alert>
  );
};

export default AuthAlert;
