import {
  Flex,
  Image,
  Link,
  useColorMode,
  Avatar,
  Button,
  useColorModeValue,
  Text,
  Box,
  useMediaQuery,
  IconButton,
  Switch,
  Container,
  UnorderedList,
  List,
  ListItem,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../../atoms/UserAtoms";
import { AiFillHome } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { useRef, useState } from "react";
import { FiLogOut } from "react-icons/fi";
import useLogout from "../../hooks/useLogout";
import authScreenAtom from "../../atoms/AuthAtoms";
import { BsFillChatQuoteFill } from "react-icons/bs";
import { AiFillNotification } from "react-icons/ai";
import { BsBookmarksFill } from "react-icons/bs";
import { IoIosFastforward } from "react-icons/io";
import { MdStars } from "react-icons/md";
import { GrSettingsOption } from "react-icons/gr";
import CreatePost from "./CreatePost";
import CreateBlitz from "./CreateBlitz";

const MyComponent = () => {
  const [isLargerThan768] = useMediaQuery("(min-width: 987px)");

  return <div>{isLargerThan768 ? <Menuu /> : <MobileContent />}</div>;
};

const Menuu = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const user = useRecoilValue(userAtom);
  const [isHovered, setIsHovered] = useState(false);
  const logout = useLogout();
  const setAuthScreen = useSetRecoilState(authScreenAtom);
  const location = useLocation();
  return (
    <Flex
      flexDirection={"column"}
      gap={200}
      alignItems={"start"}
      position={"fixed"}
      ml={10}
    >
      <Flex
        mt={28}
        mb="12"
        alignItems={"start"}
        flexDirection={"column"}
        justifyContent={"center"}
        gap={10}
      >
        {location.pathname === "/blitz" ? <CreateBlitz /> : <CreatePost />}

        <Link
          as={RouterLink}
          to="/"
          _hover={{ color: "#FF9900" }}
          color={location.pathname === "/" ? "#FF9900" : ""}
        >
          <Flex justifyContent={"center"} alignItems={"center"} gap={5}>
            <AiFillHome size={25} />

            <Text fontWeight={"bold"}>Home</Text>
          </Flex>
        </Link>

        <Link
          as={RouterLink}
          to="/chat"
          _hover={{ color: "#FF9900" }}
          color={location.pathname === "/chat" ? "#FF9900" : ""}
        >
          <Flex justifyContent={"center"} alignItems={"center"} gap={5}>
            <BsFillChatQuoteFill size={25} />

            <Text fontWeight={"bold"}>Chats</Text>
          </Flex>
        </Link>

        <Link
          as={RouterLink}
          to="/notifications"
          _hover={{ color: "#FF9900" }}
          color={location.pathname === "/notifications" ? "#FF9900" : ""}
        >
          <Flex justifyContent={"center"} alignItems={"center"} gap={5}>
            <AiFillNotification size={25} />

            <Text fontWeight={"bold"}>Notifications</Text>
          </Flex>
        </Link>

        <Link
          as={RouterLink}
          to="/bookmarks"
          _hover={{ color: "#FF9900" }}
          color={location.pathname === "/bookmarks" ? "#FF9900" : ""}
        >
          <Flex justifyContent={"center"} alignItems={"center"} gap={5}>
            <BsBookmarksFill size={25} />

            <Text fontWeight={"bold"}>Bookmarks</Text>
          </Flex>
        </Link>

        <Link
          as={RouterLink}
          to="/blitz"
          _hover={{ color: "#FF9900" }}
          color={location.pathname === "/blitz" ? "#FF9900" : ""}
        >
          <Flex justifyContent={"center"} alignItems={"center"} gap={5}>
            <IoIosFastforward size={25} />

            <Text fontWeight={"bold"}>Blitz</Text>
          </Flex>
        </Link>

        <Link
          as={RouterLink}
          to="/premium"
          _hover={{ color: "#FF9900" }}
          color={location.pathname.startsWith("/premium") ? "#FF9900" : ""}
        >
          <Flex justifyContent={"center"} alignItems={"center"} gap={5}>
            <MdStars size={25} />

            <Text fontWeight={"bold"}>Premium User</Text>
          </Flex>
        </Link>

        <Link
          as={RouterLink}
          to="/settings"
          _hover={{ color: "#FF9900" }}
          color={location.pathname === "/settings" ? "#FF9900" : ""}
        >
          <Flex justifyContent={"center"} alignItems={"center"} gap={5}>
            <GrSettingsOption size={25} />

            <Text fontWeight={"bold"}>Settings</Text>
          </Flex>
        </Link>
      </Flex>

      <Flex alignItems={"center"} gap={16}>
        <Flex alignItems={"center"} gap={4}>
          <Link as={RouterLink} to={`/${user.username}`}>
            <Avatar
              name={user.name}
              src={user.profilePic}
              size={"md"}
              boxShadow={
                isHovered
                  ? "0 0 3px 3px #ff9900d7, 0 0 3px 3px #ff990076, 0 0 1px 1px #ff990058"
                  : "md"
              }
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            />
          </Link>
          <Flex flexDirection={"column"}>
            <Text fontSize={20} fontWeight={"bold"}>
              {user.name}
            </Text>
            <Text fontSize={15} color={"gray.light"}>
              @{user.username}
            </Text>
          </Flex>
        </Flex>

        <Button
          size={"xs"}
          onClick={logout}
          _hover={{ color: "#FF9900" }}
          bg={useColorModeValue("gray.300", "gray.dark")}
          py={3.5}
        >
          <FiLogOut size={20} />
        </Button>
      </Flex>
    </Flex>
  );
};

const MobileContent = () => {
  return;
};

export default MyComponent;
