import {
  Flex,
  Image,
  Link,
  useColorMode,
  Avatar,
  Button,
  useColorModeValue,
  Menu,
  MenuButton,
  IconButton,
  MenuList,
  MenuItem,
  Text,
  useMediaQuery,
} from "@chakra-ui/react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../../atoms/UserAtoms";
import { AiFillHome, AiFillNotification } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { useState } from "react";
import { FiLogOut } from "react-icons/fi";
import useLogout from "../../hooks/useLogout";
import authScreenAtom from "../../atoms/AuthAtoms";
import { BsBookmarksFill, BsFillChatQuoteFill } from "react-icons/bs";
import {
  AddIcon,
  EditIcon,
  ExternalLinkIcon,
  HamburgerIcon,
  RepeatIcon,
} from "@chakra-ui/icons";
import { IoIosFastforward } from "react-icons/io";
import { MdStars } from "react-icons/md";
import { GrSettingsOption } from "react-icons/gr";
import { HiOutlineMenu } from "react-icons/hi";

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const user = useRecoilValue(userAtom);
  const [isHovered, setIsHovered] = useState(false);
  const logout = useLogout();
  const setAuthScreen = useSetRecoilState(authScreenAtom);
  const [isLargerThan768] = useMediaQuery("(min-width: 987px)");
  const location = useLocation();
  return (
    <Flex
      mt={6}
      mb="12"
      alignItems={"center"}
      gap={{ base: 70, lg: 40 }}
      justifyContent={{
        base: "space-between",
        md: "space-evenly",
        lg: "space-evenly",
      }}
    >
      {user && !isLargerThan768 && (
        <Flex alignItems={"center"} gap={4}>
          <Link as={RouterLink} to={`/${user.username}`}>
            <Avatar
              name={user.name}
              src={user.profilePic}
              size={"sm"}
              boxShadow={
                isHovered
                  ? "0 0 3px 3px #ff9900d7, 0 0 3px 3px #ff990076, 0 0 1px 1px #ff990058"
                  : "md"
              }
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            />
          </Link>
        </Flex>
      )}
      {!user && (
        <Link
          as={RouterLink}
          onClick={() => setAuthScreen("login")}
          to={"/auth"}
        >
          Login
        </Link>
      )}
      <Image
        cursor={"pointer"}
        alt="logo"
        w={180}
        src={colorMode === "dark" ? "/l.svg" : "/light.svg"}
        onClick={toggleColorMode}
        display={"flex"}
        alignItems={"center"}
        justifyItems={"center"}
      />

      {user && !isLargerThan768 && (
        <Menu>
          <MenuButton
            _hover={{ color: "#FF9900" }}
            fontSize={"x-large"}
            mr={10}
          >
            <HiOutlineMenu />
          </MenuButton>
          <MenuList
            bg={colorMode === "dark" ? "#000000" : "gray.300"}
            zIndex={50}
          >
            <MenuItem
              bg={colorMode === "dark" ? "#000000" : "gray.300"}
              _hover={{ color: "#FF9900" }}
            >
              <Link
                as={RouterLink}
                to="/"
                _hover={{ color: "#FF9900" }}
                color={location.pathname === "/" ? "#FF9900" : ""}
              >
                <Flex alignItems={"center"} justifyItems={"center"} gap={3}>
                  <AiFillHome size={25} />
                  <Text>Home</Text>
                </Flex>
              </Link>
            </MenuItem>
            <MenuItem
              bg={colorMode === "dark" ? "#000000" : "gray.300"}
              _hover={{ color: "#FF9900" }}
            >
              <Link
                as={RouterLink}
                to="/chat"
                _hover={{ color: "#FF9900" }}
                color={location.pathname === "/chat" ? "#FF9900" : ""}
              >
                <Flex alignItems={"center"} justifyItems={"center"} gap={3}>
                  <BsFillChatQuoteFill size={25} />
                  <Text>Chats</Text>
                </Flex>
              </Link>
            </MenuItem>
            <MenuItem
              bg={colorMode === "dark" ? "#000000" : "gray.300"}
              _hover={{ color: "#FF9900" }}
            >
              <Link
                as={RouterLink}
                to="/notifications"
                _hover={{ color: "#FF9900" }}
                color={location.pathname === "/notifications" ? "#FF9900" : ""}
              >
                <Flex alignItems={"center"} justifyItems={"center"} gap={3}>
                  <AiFillNotification size={25} />
                  <Text>Notifications</Text>
                </Flex>
              </Link>
            </MenuItem>
            <MenuItem
              bg={colorMode === "dark" ? "#000000" : "gray.300"}
              _hover={{ color: "#FF9900" }}
            >
              <Link
                as={RouterLink}
                to="/bookmarks"
                _hover={{ color: "#FF9900" }}
                color={location.pathname === "/bookmarks" ? "#FF9900" : ""}
              >
                <Flex alignItems={"center"} justifyItems={"center"} gap={3}>
                  <BsBookmarksFill size={25} />
                  <Text>Bookmarks</Text>
                </Flex>
              </Link>
            </MenuItem>
            <MenuItem
              bg={colorMode === "dark" ? "#000000" : "gray.300"}
              _hover={{ color: "#FF9900" }}
            >
              <Link
                as={RouterLink}
                to="/blitz"
                _hover={{ color: "#FF9900" }}
                color={location.pathname === "/blitz" ? "#FF9900" : ""}
              >
                <Flex alignItems={"center"} justifyItems={"center"} gap={3}>
                  <IoIosFastforward size={25} />
                  <Text>Blitz</Text>
                </Flex>
              </Link>
            </MenuItem>
            <MenuItem
              bg={colorMode === "dark" ? "#000000" : "gray.300"}
              _hover={{ color: "#FF9900" }}
            >
              <Link
                as={RouterLink}
                to="/premium"
                _hover={{ color: "#FF9900" }}
                color={
                  location.pathname.startsWith("/premium") ? "#FF9900" : ""
                }
              >
                <Flex alignItems={"center"} justifyItems={"center"} gap={3}>
                  <MdStars size={25} />
                  <Text>Premium User</Text>
                </Flex>
              </Link>
            </MenuItem>
            <MenuItem
              bg={colorMode === "dark" ? "#000000" : "gray.300"}
              _hover={{ color: "#FF9900" }}
            >
              <Link
                as={RouterLink}
                to="/settings"
                _hover={{ color: "#FF9900" }}
                color={location.pathname === "/settings" ? "#FF9900" : ""}
              >
                <Flex alignItems={"center"} justifyItems={"center"} gap={3}>
                  <GrSettingsOption size={25} />
                  <Text>Settings</Text>
                </Flex>
              </Link>
            </MenuItem>

            <MenuItem
              bg={colorMode === "dark" ? "#000000" : "gray.300"}
              _hover={{ color: "#FF9900" }}
            >
              <Button
                size={"xs"}
                onClick={logout}
                _hover={{ color: "#FF9900" }}
                bg={useColorModeValue("gray.300", "gray.dark")}
                py={3.5}
              >
                <FiLogOut size={20} />
              </Button>
            </MenuItem>
          </MenuList>
        </Menu>
      )}

      {!user && (
        <Link
          as={RouterLink}
          to={"/auth"}
          onClick={() => setAuthScreen("signup")}
        >
          Signup
        </Link>
      )}
    </Flex>
  );
};

export default Header;
