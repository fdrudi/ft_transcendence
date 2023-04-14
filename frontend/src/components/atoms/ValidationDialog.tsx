import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  FormControl,
  FormLabel,
  Input,
  IconButton,
  Grid,
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { FC, useCallback, useRef, useState } from "react";
import axios from "axios";
import { useForm, SubmitHandler } from "react-hook-form";
import { TwoAuthForm } from "@/types/twoAuth";
import { ButtonText, Loading } from "@/components/atoms";
import { CloseIcon } from "@chakra-ui/icons";

type Props = {
  open: boolean;
  userId: number;
  onClose: () => void;
};

const ValidationDialog: FC<Props> = ({ open, userId, onClose }) => {
  const router = useRouter();
  const [isOpenErrorToast, setIsOpenErrorToast] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm<TwoAuthForm>();
  const toast = useToast();

  const handleClose = useCallback(() => {
    onClose();
    setIsOpenErrorToast(false);
  }, [onClose]);

  const handleToastClose = () => {
    setIsOpenErrorToast(false);
  };

  const onSubmit: SubmitHandler<TwoAuthForm> = async ({ authCode }) => {
    clearErrors();
    try {
      const { data } = await axios.patch<boolean>(
        `${process.env.NEXT_PUBLIC_API_URL as string}/auth/validate2fa`,
        {
          userId: userId,
          code: authCode,
        }
      );

      if (data === true) {
        await router.push("/dashboard");
      } else {
        setIsOpenErrorToast(true);
      }
    } catch {
      setIsOpenErrorToast(true);
    }
  };

  if (!router.isReady) return <Loading fullHeight />;

  const cancelRef = useRef(null);

  return (
    <>
      <AlertDialog
        isOpen={open}
        leastDestructiveRef={cancelRef}
        onClose={handleClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Enter Authorization Code
              <IconButton
                aria-label="close"
                onClick={handleClose}
                position="absolute"
                right={2}
                top={2}
                icon={<CloseIcon />}
              />
            </AlertDialogHeader>

            <AlertDialogBody>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid
                  templateColumns="repeat(2, 1fr)"
                  gap={4}
                  alignItems="center"
                  justifyContent="center"
                >
                  <FormControl isInvalid={!!errors.authCode} my={2}>
                    <FormLabel htmlFor="auth-code">6 digit code</FormLabel>
                    <Input
                      {...register("authCode")}
                      id="auth-code"
                      autoComplete="off"
                    />
                  </FormControl>
                  <ButtonText text="VERIFY" />
                </Grid>
              </form>
            </AlertDialogBody>

            <AlertDialogFooter>
              <ButtonText ref={cancelRef} onClick={handleClose} text="Cancel" />
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      {isOpenErrorToast &&
        toast({
          title: "Authorization Code Is Wrong!",
          status: "error",
          duration: 6000,
          isClosable: true,
          onCloseComplete: handleToastClose,
        })}
    </>
  );
};

export default ValidationDialog;
