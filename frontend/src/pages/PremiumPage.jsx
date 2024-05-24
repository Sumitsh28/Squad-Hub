import React from "react";
import PriceCard from "../components/PriceCard";
import Box from "next-auth/providers/box";
import { Flex } from "@chakra-ui/react";

const PremiumPage = () => {
  return (
    <Flex
      gap={20}
      mt={36}
      flexDirection={{ base: "column", sm: "row" }}
      alignItems={"center"}
    >
      <PriceCard price={199} duration={"month"} />
      <PriceCard price={999} duration={"year"} />
    </Flex>
  );
};

export default PremiumPage;
