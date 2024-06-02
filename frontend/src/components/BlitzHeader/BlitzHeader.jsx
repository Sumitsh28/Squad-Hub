import React from "react";
import { IoChevronBackOutline } from "react-icons/io5";
import { Flex, Text, Tooltip } from "@chakra-ui/react";
import { PiMusicNoteSimpleFill } from "react-icons/pi";
import { useNavigate } from "react-router-dom";

function BlitzHeader() {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate("/");
  };

  return (
    <Flex
      className="videoHeader"
      position={"absolute"}
      top={5}
      justifyContent={"center"}
      ml={5}
      zIndex={98}
    >
      <Flex
        alignItems={"center"}
        justifyContent={"center"}
        gap={"120px"}
        fontSize={"large"}
        fontWeight={"bold"}
        zIndex={96}
      >
        <Text
          cursor={"pointer"}
          _hover={{ color: "#FF9900" }}
          onClick={handleButtonClick}
        >
          <IoChevronBackOutline />
        </Text>
        <h2>Blitz</h2>
        <Tooltip
          label="Original Audio"
          bg="#ff990046"
          color="white"
          placement="right"
        >
          <Text cursor={"pointer"} _hover={{ color: "#FF9900" }}>
            <PiMusicNoteSimpleFill cursor={"pointer"} />
          </Text>
        </Tooltip>
      </Flex>
    </Flex>
  );
}

export default BlitzHeader;
