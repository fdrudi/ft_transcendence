import { ReactNode } from "react";
import { Box, Collapse } from "@chakra-ui/react";

type Props = {
  show: boolean;
  children: ReactNode;
};

const AuthAlertCollapse = ({ show, children }: Props) => {
  return (
    <Box sx={{ width: "100%" }}>
      <Collapse in={show}>{children}</Collapse>
    </Box>
  );
};

export default AuthAlertCollapse;
