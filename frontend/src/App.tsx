import React from "react";
import { Button } from "@chakra-ui/react";

const auth = async () => {
  try {
    return await fetch("/auth").then((res: any) => console.log(res));
  } catch (error) {
    console.error("Auth Error: ", error);
  }
  // fetch("/auth").then((res: any) => console.log(res));
  return console.log("OKAY");
};

const App = () => {
  return (
    <Button onClick={auth} colorScheme="blue">
      Click me sempai UWU!
    </Button>
  );
};

export default App;
