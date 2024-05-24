import {
  Flex,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { IoSendSharp } from "react-icons/io5";
import useShowToast from "../../hooks/useShowToast";
import {
  conversationsAtom,
  selectedConversationAtom,
} from "../../atoms/MessagesAtom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { BsFillImageFill } from "react-icons/bs";
import usePreviewImg from "../../hooks/usePreviewImg";

const MessageInput = ({ setMessages }) => {
  const [messageText, setMessageText] = useState("");
  const showToast = useShowToast();
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const setConversations = useSetRecoilState(conversationsAtom);
  const imageRef = useRef(null);
  const { onClose } = useDisclosure();
  const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
  const [isSending, setIsSending] = useState(false);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText && !imgUrl) return;
    if (isSending) return;

    setIsSending(true);

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageText,
          recipientId: selectedConversation.userId,
          img: imgUrl,
        }),
      });
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      console.log(data);
      setMessages((messages) => [...messages, data]);

      setConversations((prevConvs) => {
        const updatedConversations = prevConvs.map((conversation) => {
          if (conversation._id === selectedConversation._id) {
            return {
              ...conversation,
              lastMessage: {
                text: messageText,
                sender: data.sender,
              },
            };
          }
          return conversation;
        });
        return updatedConversations;
      });
      setMessageText("");
      setImgUrl("");
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setIsSending(false);
    }
  };
  return (
    <Flex gap={2} alignItems={"center"}>
      <form onSubmit={handleSendMessage} style={{ flex: 95 }}>
        <InputGroup>
          <Input
            w={"full"}
            placeholder="Type a message"
            onChange={(e) => setMessageText(e.target.value)}
            value={messageText}
            focusBorderColor="#ff9900ac"
          />
          <InputRightElement onClick={handleSendMessage} cursor={"pointer"}>
            <Text _hover={{ color: "#FF9900" }}>
              <IoSendSharp />
            </Text>
          </InputRightElement>
        </InputGroup>
      </form>
      <Flex flex={5} cursor={"pointer"}>
        <Text _hover={{ color: "#FF9900" }}>
          <BsFillImageFill size={20} onClick={() => imageRef.current.click()} />
        </Text>
        <Input
          type={"file"}
          hidden
          ref={imageRef}
          onChange={handleImageChange}
        />
      </Flex>
      <Modal
        isOpen={imgUrl}
        onClose={() => {
          onClose();
          setImgUrl("");
        }}
      >
        <ModalOverlay />
        <ModalContent bg={useColorModeValue("gray.300", "gray.dark")}>
          <ModalHeader></ModalHeader>
          <ModalCloseButton _hover={{ color: "#FF9900" }} />
          <ModalBody>
            <Flex mt={5} w={"full"}>
              <Image src={imgUrl} />
            </Flex>
            <Flex justifyContent={"flex-end"} my={2}>
              {!isSending ? (
                <Text _hover={{ color: "#FF9900" }}>
                  <IoSendSharp
                    size={24}
                    cursor={"pointer"}
                    onClick={handleSendMessage}
                  />
                </Text>
              ) : (
                <Spinner size={"md"} />
              )}
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default MessageInput;
