import {
  Avatar,
  Box,
  Flex,
  Icon,
  Text,
  VStack,
  useToast,
  Button,
  useColorModeValue,
  Tooltip,
  Menu,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  useDisclosure,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
  Image,
} from "@chakra-ui/react";
import { CgMoreO } from "react-icons/cg";
import { IoMdLink } from "react-icons/io";
import { useRecoilValue } from "recoil";
import userAtoms from "../../atoms/UserAtoms";
import { Link, Link as RouterLink } from "react-router-dom";
import { useState } from "react";
import useShowToast from "../../hooks/useShowToast";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import { IoQrCode } from "react-icons/io5";
import { motion } from "framer-motion";

const UserHeader = ({ user }) => {
  const toast = useToast();
  const currentUser = useRecoilValue(userAtoms); //logged in user
  const [isHovered, setIsHovered] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  function handleFlip() {
    if (!isAnimating) {
      setIsFlipped(!isFlipped);
      setIsAnimating(true);
    }
  }
  const [following, setFollowing] = useState(
    user.followers.includes(currentUser?._id)
  );
  const [updating, setUpdating] = useState(false);
  const showToast = useShowToast();
  const {
    isOpen: isOpenModal1,
    onOpen: onOpenModal1,
    onClose: onCloseModal1,
  } = useDisclosure();
  const {
    isOpen: isOpenModal2,
    onOpen: onOpenModal2,
    onClose: onCloseModal2,
  } = useDisclosure();
  const copyURL = () => {
    const copy = window.location.href;

    navigator.clipboard.writeText(copy).then(() => {
      toast({
        title: "Copied",
        status: "success",
        duration: 3000,
        description: "Profile link copied",
      });
    });
  };

  const handleFollowUnfollow = async () => {
    if (!currentUser) {
      showToast("Error", "Please login to follow", "error");
      return;
    }
    if (updating) return;

    setUpdating(true);
    try {
      const res = await fetch(`/api/users/follow/${user._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }

      console.log(data);

      if (following) {
        showToast("Success", `Unfollowed ${user.name}`, "success");
        user.followers.pop(); // simulate removing from followers
      } else {
        showToast("Success", `Followed ${user.name}`, "success");
        user.followers.push(currentUser?._id); // simulate adding to followers
      }
      setFollowing(!following);
    } catch (error) {
      showToast("Error", error, "error");
    } finally {
      setUpdating(false);
    }
  };

  const openImg = () => {};

  return (
    <VStack gap={4} alignItems={"start"}>
      <Flex justifyContent={"space-between"} w={"full"}>
        <Flex alignItems={"start"} flexDir={"column"} gap={2}>
          <Text fontSize={"2xl"} fontWeight={"bold"}>
            {user.name}
          </Text>
          <Flex gap={2} alignItems={"center"}>
            <Text
              fontSize={"xs"}
              bg={useColorModeValue("gray.300", "gray.dark")}
              color={"gray.light"}
              p={2}
              borderRadius={"full"}
              _hover={{ color: "#FF9900" }}
            >
              @{user.username}
            </Text>
          </Flex>
        </Flex>
        <Box onClick={openImg} cursor={"pointer"}>
          {user.profilePic && (
            <>
              <Avatar
                name={user.name}
                src={user.profilePic}
                size={{
                  base: "lg",
                  md: "xl",
                }}
                boxShadow={
                  isHovered
                    ? "0 0 5px 5px #ff9900d7, 0 0 10px 10px #ff990076, 0 0 1px 1px #ff990058"
                    : "md"
                }
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={onOpenModal1}
              />

              <Modal isOpen={isOpenModal1} onClose={onCloseModal1}>
                <ModalOverlay />

                <ModalContent
                  bg={useColorModeValue("#0000000", "#0000000")}
                  h="400px"
                  display={"flex"}
                >
                  <ModalCloseButton _hover={{ color: "#FF9900" }} />
                  <ModalBody
                    pb={6}
                    mt={20}
                    display="flex"
                    justifyContent="center"
                  >
                    <Image
                      name={user.name}
                      src={user.profilePic}
                      style={{
                        width: "78%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "50%",
                        overflow: "hidden",
                      }}
                    />
                  </ModalBody>
                </ModalContent>
              </Modal>
            </>
          )}
          {!user.profilePic && (
            <Avatar
              name={user.name}
              src="https://bit.ly/broken-link"
              size={{
                base: "lg",
                md: "xl",
              }}
              boxShadow={
                isHovered
                  ? "0 0 5px 5px #ff9900d7, 0 0 10px 10px #ff990076, 0 0 1px 1px #ff990058"
                  : "md"
              }
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            />
          )}
        </Box>
      </Flex>
      <Text> {user.bio}</Text>
      {currentUser?._id === user._id && (
        <Link as={RouterLink} to="/update">
          <Button
            size={"sm"}
            _hover={{ color: "#FF9900" }}
            bg={useColorModeValue("gray.300", "gray.dark")}
          >
            Update Profile
          </Button>
        </Link>
      )}

      {currentUser?._id !== user._id && (
        <Button
          size={"sm"}
          onClick={handleFollowUnfollow}
          isLoading={updating}
          _hover={{ color: "#FF9900" }}
        >
          {following ? "Unfollow" : "Follow"}
        </Button>
      )}

      <Flex w={"full"} justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text color={"gray.light"}>{user.followers.length} followers</Text>
          <Box w="1" h="1" bg={"gray.light"} borderRadius={"full"}></Box>
          <Text color={"gray.light"}>{user.following.length} following</Text>
        </Flex>
        <Flex gap={10} justifyContent={"center"} alignItems={"center"}>
          <Text cursor="pointer" _hover={{ color: "#FF9900" }}>
            <IoQrCode onClick={onOpenModal2} />
            <Modal isOpen={isOpenModal2} onClose={onCloseModal2}>
              <ModalOverlay />

              <ModalContent
                bg={useColorModeValue("#0000000", "#0000000")}
                h="400px"
                display={"flex"}
              >
                <ModalCloseButton _hover={{ color: "#FF9900" }} />
                <ModalBody
                  pb={6}
                  mt={20}
                  display="flex"
                  justifyContent="center"
                >
                  <Image
                    name={user.name}
                    src={`https://quickchart.io/qr?text=${window.location.href}&size=200`}
                    style={{
                      width: "78%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "50%",
                      overflow: "hidden",
                    }}
                  />
                </ModalBody>
              </ModalContent>
            </Modal>
          </Text>
          <Menu placement="left">
            <MenuButton cursor="pointer" _hover={{ color: "#FF9900" }}>
              <CgMoreO size={20} />
            </MenuButton>
            <MenuList
              minWidth="50px"
              placement="left"
              style={{ display: "flex" }}
              bg="#0000000"
            >
              <MenuItem
                flex="1"
                display="flex"
                alignItems="center"
                justifyContent="center"
                bg="#0000000"
              >
                <Text _hover={{ color: "#FF9900" }}>
                  <FaFacebook size={20} />
                </Text>
              </MenuItem>
              <MenuItem
                flex="1"
                display="flex"
                alignItems="center"
                justifyContent="center"
                bg="#0000000"
              >
                <Text _hover={{ color: "#FF9900" }}>
                  <FaLinkedin size={20} />
                </Text>
              </MenuItem>
              <MenuItem
                flex="1"
                display="flex"
                alignItems="center"
                justifyContent="center"
                bg="#0000000"
              >
                <Text _hover={{ color: "#FF9900" }}>
                  <FaTwitter size={20} />
                </Text>
              </MenuItem>
              <MenuItem
                flex="1"
                display="flex"
                alignItems="center"
                justifyContent="center"
                bg="#0000000"
              >
                <Text _hover={{ color: "#FF9900" }}>
                  <FaInstagram
                    size={20}
                    style={{ marginBottom: "8px", marginTop: "8px" }}
                  />
                </Text>
              </MenuItem>
            </MenuList>
          </Menu>

          <Icon
            as={IoMdLink}
            boxSize={6}
            cursor="pointer"
            _hover={{ color: "#FF9900" }}
            onClick={copyURL}
          />
        </Flex>
      </Flex>

      <Flex w={"full"} mt={5}>
        <Flex
          flex={1}
          borderBottom={"1.5px solid #FF9900"}
          justifyContent={"center"}
          pb="3"
          cursor={"pointer"}
        >
          <Text fontWeight={"bold"}>Posts</Text>
        </Flex>
        <Flex
          flex={1}
          borderBottom={"1.5px solid #ff990069"}
          justifyContent={"center"}
          pb="3"
          cursor={"pointer"}
          color={"gray.light"}
        >
          <Text fontWeight={"bold"}>Replies</Text>
        </Flex>
      </Flex>
    </VStack>
  );
};

export default UserHeader;
