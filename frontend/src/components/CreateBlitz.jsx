import { AddIcon } from "@chakra-ui/icons";
import {
  Button,
  CloseButton,
  Flex,
  FormControl,
  Image,
  Box,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import usePreviewMedia from "../../hooks/usePreviewMedia";
import { BsFillCameraVideoFill, BsFillImageFill } from "react-icons/bs";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../../atoms/UserAtoms";
import useShowToast from "../../hooks/useShowToast";
import blitzsAtom from "../../atoms/BlitzsAtom";
import { useLocation, useParams } from "react-router-dom";

const MAX_CHAR = 30;

function CreateBlitz() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [blitzText, setBlitzText] = useState("");
  const { handleVideoChange, vidUrl, setVidUrl } = usePreviewMedia();
  const videoRef = useRef(null);
  const [remainingChar, setRemainingChar] = useState(MAX_CHAR);
  const user = useRecoilValue(userAtom);
  const showToast = useShowToast();
  const [loading, setLoading] = useState(false);
  const [blitzs, setBlitzs] = useRecoilState(blitzsAtom);
  const { username } = useParams();

  const handleTextChange = (e) => {
    const inputText = e.target.value;

    if (inputText.length > MAX_CHAR) {
      const truncatedText = inputText.slice(0, MAX_CHAR);
      setBlitzText(truncatedText);
      setRemainingChar(0);
    } else {
      setBlitzText(inputText);
      setRemainingChar(MAX_CHAR - inputText.length);
    }
  };

  const handleCreateBlitz = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/blitzs/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postedBy: user._id,
          text: blitzText,
          vid: vidUrl,
        }),
      });

      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      showToast("Success", "Blitz created successfully", "success");
      if (username === user.username) {
        setPosts([data, ...blitzs]);
      }
      onClose();
      setBlitzText("");
      setVidUrl("");
    } catch (error) {
      showToast("Error", error, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        bg={useColorModeValue("gray.300", "gray.dark")}
        onClick={onOpen}
        _hover={{ color: "" }}
        size={{ base: "sm", sm: "md" }}
        rounded={"full"}
        p={8}
      >
        <Flex _hover={{ color: "#FF9900" }} alignItems={"center"} gap={3}>
          Create Blitz
          <AddIcon />
        </Flex>
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />

        <ModalContent bg={useColorModeValue("gray.300", "gray.dark")}>
          <ModalHeader>Create Blitz</ModalHeader>
          <ModalCloseButton _hover={{ color: "#FF9900" }} />
          <ModalBody pb={6}>
            <FormControl>
              <Textarea
                placeholder="Blitz title goes here.."
                onChange={handleTextChange}
                value={blitzText}
                focusBorderColor="#ff9900ac"
              />
              <Text
                fontSize="xs"
                fontWeight="bold"
                textAlign={"right"}
                m={"1"}
                color={"#FF9900"}
              >
                {remainingChar}/{MAX_CHAR}
              </Text>

              <Input
                type="file"
                hidden
                ref={videoRef}
                onChange={handleVideoChange}
              />
              <Text _hover={{ color: "#FF9900" }}>
                <BsFillCameraVideoFill
                  style={{ marginLeft: "5px", cursor: "pointer" }}
                  size={16}
                  onClick={() => videoRef.current.click()}
                />
              </Text>
            </FormControl>

            {vidUrl && (
              <Flex mt={5} w={"full"} position={"relative"}>
                <Box
                  as="video"
                  src={vidUrl}
                  alt="vid"
                  controls
                  width="100%"
                  maxW="600px"
                  mx="auto"
                  mt={4}
                  borderRadius="md"
                  boxShadow="lg"
                />
                <CloseButton
                  onClick={() => {
                    setVidUrl("");
                  }}
                  bg={"gray.800"}
                  position={"absolute"}
                  top={2}
                  right={2}
                  _hover={{ color: "#FF9900" }}
                />
              </Flex>
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              bg={"#FF9900"}
              mr={3}
              onClick={handleCreateBlitz}
              isLoading={loading}
              _hover={{ color: "" }}
            >
              Post
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default CreateBlitz;
