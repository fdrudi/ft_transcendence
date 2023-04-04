import { Grid, CircularProgress } from "@chakra-ui/react";

type Props = {
  fullHeight?: boolean;
};

export const Loading = ({ fullHeight = false }: Props) => {
  const height = fullHeight ? "100vh" : "100%";

  return (
    <Grid
      templateColumns="repeat(1, 1fr)"
      justifyContent="center"
      alignItems="center"
      width="100%"
      height={height}
    >
      <Grid>
        <CircularProgress isIndeterminate />
      </Grid>
    </Grid>
  );
};

export default Loading;
