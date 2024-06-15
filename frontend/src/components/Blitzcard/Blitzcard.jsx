import React, { useEffect, useRef, useState } from "react";
import "./Blitzcard.css";
import avatarSrc from "../../../public/profile.jpg";
import BlitzHeader from "../BlitzHeader/BlitzHeader";
import BlitzActions from "../BlitzActions";
import {
  Avatar,
  Box,
  Button,
  Flex,
  FormControl,
  Grid,
  GridItem,
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
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { FaHeart, FaRegComment, FaShare } from "react-icons/fa6";
import {
  BsFillSendFill,
  BsThreeDots,
  BsThreeDotsVertical,
  BsVolumeMute,
} from "react-icons/bs";
import { GrSend } from "react-icons/gr";
import useShowToast from "../../../hooks/useShowToast";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../../../atoms/UserAtoms";
import blitzsAtom from "../../../atoms/BlitzsAtom";
import { useNavigate } from "react-router-dom";
import { DeleteIcon } from "@chakra-ui/icons";
import { MdBookmarkAdd, MdReportProblem } from "react-icons/md";
import { GoUnmute } from "react-icons/go";

function Blitzcard({ blitz, postedBy }) {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [reply, setReply] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLiking, setIsLiking] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);

  const [user, setUser] = useState(null);
  const showToast = useShowToast();
  const currentUser = useRecoilValue(userAtom);
  const [blitzs, setBlitzs] = useRecoilState(blitzsAtom);
  const navigate = useNavigate();
  const [liked, setLiked] = useState(blitz.likes.includes(user?._id));

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch("/api/users/profile/" + postedBy);
        const data = await res.json();

        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setUser(data);
      } catch (error) {
        showToast("Error", error.message, "error");

        setUser(null);
      }
    };

    getUser();
  }, [postedBy, showToast]);

  if (!user) return null;

  const handleDeleteBlitz = async (e) => {
    try {
      if (!window.confirm("Are you sure you want to delete this post?")) return;

      const res = await fetch(`/api/blitzs/${blitz._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      showToast("Success", "Post deleted", "success");
      setBlitzs(blitzs.filter((p) => p._id !== blitz._id));
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };

  const onVideoPress = () => {
    if (isVideoPlaying) {
      videoRef.current.pause();
      setIsVideoPlaying(false);
    } else {
      videoRef.current.play();
      setIsVideoPlaying(true);
    }
  };

  const handleLikeAndUnlike = async () => {
    if (!user)
      return showToast(
        "Error",
        "You must be logged in to like a post",
        "error"
      );
    if (isLiking) return;
    setIsLiking(true);
    try {
      const res = await fetch("/api/blitzs/like/" + blitz._id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.error) return showToast("Error", data.error, "error");

      if (!liked) {
        // add the id of the current user to post.likes array
        const updatedBlitzs = blitzs.map((p) => {
          if (p._id === blitz._id) {
            return { ...p, likes: [...p.likes, user._id] };
          }
          return p;
        });
        setBlitzs(updatedBlitzs);
      } else {
        // remove the id of the current user from post.likes array
        const updatedBlitzs = blitzs.map((p) => {
          if (p._id === blitz._id) {
            return { ...p, likes: p.likes.filter((id) => id !== user._id) };
          }
          return p;
        });
        setBlitzs(updatedBlitzs);
      }

      setLiked(!liked);
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setIsLiking(false);
    }
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
      const res = await fetch("/api/blitzs/reply/" + blitz._id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: reply }),
      });
      const data = await res.json();
      if (data.error) return showToast("Error", data.error, "error");

      const updatedBlitzs = blitzs.map((p) => {
        if (p._id === blitz._id) {
          return { ...p, replies: [...p.replies, data] };
        }
        return p;
      });
      setBlitzs(updatedBlitzs);
      showToast("Success", "Reply posted successfully", "success");
      onClose();
      setReply("");
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setIsReplying(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    videoRef.current.muted = !isMuted;
  };

  return (
    <div className="videoCard">
      <BlitzHeader />
      <div className="overlay">
        <Grid
          templateColumns="3fr 1fr" // Adjust the width of the left column here
          gap={6}
          p={6}
          m="auto"
          position={"absolute"}
          top={0}
          left={0}
          right={0}
          bottom={0}
        >
          <GridItem colSpan={1} alignSelf="flex-end">
            <Flex flexDirection={"column"} gap={3}>
              <Flex
                alignItems={"center"}
                justifyContent={"center"}
                gap={10}
                bottom={"2%"}
              >
                <Flex
                  gap={3}
                  alignItems={"center"}
                  justifyContent={"center"}
                  flexDirection={"row"}
                  zIndex={60}
                >
                  <Avatar
                    src={user?.profilePic}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(`/${user.username}`);
                    }}
                    cursor={"pointer"}
                  />
                  <Text fontWeight={"bold"}>{user.name}</Text>
                </Flex>
                <Button zIndex={60}>Follow</Button>
              </Flex>
              <Text ml={5} fontSize={20} fontWeight={"bold"}>
                {blitz.text}
              </Text>
            </Flex>
          </GridItem>

          <GridItem colSpan={1} onClick={(e) => e.preventDefault()} zIndex={96}>
            <Flex
              p={4}
              flexDirection="column"
              mt={"350px"}
              fontSize={"x-large"}
              gap={9}
              ml={"30px"}
            >
              <Flex
                flexDirection={"column"}
                alignItems={"center"}
                justifyItems={"center"}
                gap={2}
              >
                <Text _hover={{ color: "#FF9900" }}>
                  <svg
                    aria-label="Like"
                    color={liked ? "rgb(237, 73, 86)" : ""}
                    fill={liked ? "rgb(237, 73, 86)" : "transparent"}
                    height="19"
                    role="img"
                    viewBox="0 0 24 22"
                    width="20"
                    onClick={handleLikeAndUnlike}
                  >
                    <path
                      d="M1 7.66c0 4.575 3.899 9.086 9.987 12.934.338.203.74.406 1.013.406.283 0 .686-.203 1.013-.406C19.1 16.746 23 12.234 23 7.66 23 3.736 20.245 1 16.672 1 14.603 1 12.98 1.94 12 3.352 11.042 1.952 9.408 1 7.328 1 3.766 1 1 3.736 1 7.66Z"
                      stroke="currentColor"
                      strokeWidth="2"
                    ></path>
                  </svg>
                </Text>
                <Text fontSize={16}>{blitz.likes?.length}</Text>
              </Flex>
              <Flex
                flexDirection={"column"}
                alignItems={"center"}
                justifyItems={"center"}
                gap={2}
              >
                <Text _hover={{ color: "#FF9900" }}>
                  <svg
                    aria-label="Comment"
                    color=""
                    fill=""
                    height="20"
                    role="img"
                    viewBox="0 0 24 24"
                    width="20"
                    onClick={onOpen}
                  >
                    <path
                      d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z"
                      fill="none"
                      stroke="currentColor"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    ></path>
                  </svg>
                </Text>
                <Text fontSize={16}>{blitz.replies?.length}</Text>
              </Flex>

              <Menu placement="bottom">
                <MenuButton _hover={{ color: "#FF9900" }}>
                  <BsThreeDots />
                </MenuButton>

                <MenuList bg="#000000" minWidth="60px">
                  <MenuItem bg="#000000" _hover={{ color: "#FF9900" }}>
                    <Flex gap={2} alignItems={"center"}>
                      {currentUser?._id === user._id && (
                        <Text
                          onClick={handleDeleteBlitz}
                          display={"flex"}
                          alignItems={"center"}
                          gap={2}
                        >
                          <DeleteIcon size={20} />
                          <Text>Delete</Text>
                        </Text>
                      )}
                    </Flex>
                  </MenuItem>
                  <MenuItem bg="#000000" _hover={{ color: "#FF9900" }}>
                    <Flex gap={2} alignItems={"center"}>
                      <FaShare />
                      Share
                    </Flex>
                  </MenuItem>
                  <MenuItem bg="#000000" _hover={{ color: "#FF9900" }}>
                    <Flex gap={2} alignItems={"center"}>
                      <MdBookmarkAdd />
                      Save
                    </Flex>
                  </MenuItem>
                  {currentUser?._id !== user._id && (
                    <MenuItem bg="#000000" _hover={{ color: "#FF9900" }}>
                      <Flex gap={2} alignItems={"center"}>
                        <MdReportProblem />
                        Report
                      </Flex>
                    </MenuItem>
                  )}
                </MenuList>
              </Menu>

              <Text _hover={{ color: "#FF9900" }} onClick={toggleMute}>
                {isMuted ? <BsVolumeMute /> : <GoUnmute />}
              </Text>
            </Flex>
          </GridItem>
        </Grid>
      </div>
      <video
        ref={videoRef}
        onClick={onVideoPress}
        className="videoCard__player"
        src={blitz.vid}
        loop
        autoPlay
        muted={isMuted}
      />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg={useColorModeValue("gray.300", "gray.dark")}>
          <ModalHeader></ModalHeader>
          <ModalCloseButton _hover={{ color: "#FF9900" }} />
          <ModalBody pb={6} mt={1}>
            <FormControl>
              <Input
                placeholder="Reply goes here.."
                value={reply}
                onChange={(e) => setReply(e.target.value)}
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
    </div>
  );
}

export default Blitzcard;
