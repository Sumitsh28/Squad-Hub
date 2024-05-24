import {
  Avatar,
  Button,
  Divider,
  Flex,
  FormControl,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Portal,
  Text,
  useColorModeValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import Actions from "./Actions";
import { FaForward, FaShare } from "react-icons/fa";
import { MdBookmarkAdd, MdReportProblem } from "react-icons/md";
import { FaReply } from "react-icons/fa";
import { BsClipboard2Fill } from "react-icons/bs";
import useShowToast from "../../hooks/useShowToast";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../../atoms/UserAtoms";
import postsAtom from "../../atoms/PostsAtom";

const Comment = ({ reply, lastReply, posts, setPosts }) => {
  const toast = useToast();
  const user = useRecoilValue(userAtom);

  const showToast = useShowToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isReplying, setIsReplying] = useState(false);
  const [replyy, setReplyy] = useState("");

  const copyComment = () => {
    const copy = reply.text;

    navigator.clipboard.writeText(copy).then(() => {
      toast({
        title: "Copied",
        status: "success",
        duration: 3000,
        description: "Comment copied",
      });
    });
  };

  const handleReply = async () => {
    if (!user)
      return showToast(
        "Error",
        "You must be logged in to reply to a post",
        "error"
      );
    if (isReplying) return;
    setIsReplying(true);
    try {
      const res = await fetch("/api/posts/reply/" + post._id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: reply }),
      });
      const data = await res.json();
      if (data.error) return showToast("Error", data.error, "error");

      const updatedPosts = posts.map((p) => {
        if (p._id === post._id) {
          return { ...p, replies: [...p.replies, data] };
        }
        return p;
      });
      setPosts(updatedPosts);
      showToast("Success", "Reply posted successfully", "success");
      onClose();
      setReplyy("");
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setIsReplying(false);
    }
  };

  return (
    <>
      <Flex gap={4} py={2} my={2} w={"full"}>
        <Avatar src={reply.userProfilePic} size={"sm"} />
        <Flex gap={1} w={"full"} flexDirection={"column"}>
          <Flex
            w={"full"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Text fontSize="sm" fontWeight="bold">
              {reply.username}
            </Text>
            <Flex gap={2} alignItems={"center"}>
              {/* <Text fontSize={"sm"} color={"gray.light"}>
                {createdAt}
              </Text> */}
              <Text _hover={{ color: "#FF9900" }}>
                <Menu>
                  <MenuButton>
                    <BsThreeDots />
                  </MenuButton>
                  <Portal>
                    <MenuList bg="#000000" minWidth="60px">
                      <MenuItem
                        bg="#000000"
                        _hover={{ color: "#FF9900" }}
                        onClick={onOpen}
                      >
                        <Flex gap={2} alignItems={"center"}>
                          <FaReply />
                          Reply
                        </Flex>
                      </MenuItem>
                      <MenuItem
                        bg="#000000"
                        _hover={{ color: "#FF9900" }}
                        onClick={copyComment}
                      >
                        <Flex gap={2} alignItems={"center"}>
                          <BsClipboard2Fill />
                          Copy
                        </Flex>
                      </MenuItem>
                      <MenuItem bg="#000000" _hover={{ color: "#FF9900" }}>
                        <Flex gap={2} alignItems={"center"}>
                          <MdReportProblem />
                          Report
                        </Flex>
                      </MenuItem>
                    </MenuList>
                  </Portal>
                </Menu>
              </Text>
            </Flex>
          </Flex>
          <Text>{reply.text}</Text>
        </Flex>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent bg={useColorModeValue("gray.300", "gray.dark")}>
            <ModalHeader></ModalHeader>
            <ModalCloseButton _hover={{ color: "#FF9900" }} />
            <ModalBody pb={6} mt={1}>
              <FormControl>
                <Input
                  placeholder="Reply goes here.."
                  value={replyy}
                  onChange={(e) => setReplyy(e.target.value)}
                  focusBorderColor="#ff9900ac"
                />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button
                colorScheme="blue"
                size={"sm"}
                mr={3}
                isLoading={isReplying}
                onClick={handleReply}
                bg={"#FF9900"}
                _hover={{ color: "" }}
              >
                Reply
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Flex>
      <Divider />
    </>
  );
};

export default Comment;
