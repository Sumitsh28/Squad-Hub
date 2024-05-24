import { motion } from "framer-motion";
import {
  Box,
  Button,
  Center,
  Text,
  chakra,
  useColorModeValue,
} from "@chakra-ui/react";
import { MdStar, MdStars } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const MotionBox = chakra(motion.div);
const MotionButton = chakra(motion.button);
const MotionSvg = chakra(motion.svg);
const MotionCircle = chakra(motion.circle);
const MotionEllipse = chakra(motion.ellipse);

const PriceCard = ({ price, duration }) => {
  return (
    <Box
      bg={useColorModeValue("#CBD5E0", "#1e1e1e")}
      px={4}
      py={12}
      w={"400px"}
      borderRadius={"2xl"}
    >
      <Center>
        <Card price={price} duration={duration} />
      </Center>
    </Box>
  );
};

const Card = ({ price, duration }) => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate("/premium/payment");
  };

  return (
    <MotionBox
      whileHover="hover"
      transition={{
        duration: 1,
        ease: "backInOut",
      }}
      variants={{
        hover: {
          scale: 1.05,
        },
      }}
      position="relative"
      h="96"
      w="80"
      overflow="hidden"
      rounded="xl"
      bg="indigo.500"
      p={8}
    >
      <Box position="relative" zIndex={10} color="white">
        <Box
          mb={3}
          w="fit-content"
          rounded="full"
          bg="whiteAlpha.300"
          px={3}
          py={0.5}
          fontSize="sm"
          fontWeight="light"
          color="white"
          display={"flex"}
          alignItems={"center"}
          gap={"2"}
        >
          <MdStars />
          Premium
        </Box>
        <MotionBox
          initial={{ scale: 0.85 }}
          variants={{
            hover: {
              scale: 1,
            },
          }}
          transition={{
            duration: 1,
            ease: "backInOut",
          }}
          my={2}
          fontFamily="mono"
          fontSize="6xl"
          fontWeight="black"
          lineHeight="1.2"
          color="#fff"
        >
          ₹{price}/
          <br />
          {duration}
        </MotionBox>
        <Text>Join now and become a Premium User to get more benefits.</Text>
      </Box>
      <MotionButton
        position="absolute"
        bottom={4}
        left={4}
        right={4}
        zIndex={20}
        rounded="xl"
        bg="#FF9900"
        py={2}
        textAlign="center"
        fontFamily="mono"
        fontWeight="black"
        textTransform="uppercase"
        color="gray.800"
        _hover={{
          bg: "#ff990052",
          color: "white",
        }}
        backdropBlur="lg"
        onClick={handleButtonClick}
      >
        Get it now
      </MotionButton>
      <Background />
    </MotionBox>
  );
};

const Background = () => {
  return (
    <MotionSvg
      width="320"
      height="384"
      viewBox="0 0 320 384"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      position="absolute"
      inset={0}
      zIndex={0}
      variants={{
        hover: {
          scale: 1.5,
        },
      }}
      transition={{
        duration: 1,
        ease: "backInOut",
      }}
    >
      <MotionCircle
        variants={{
          hover: {
            scaleY: 0.5,
            y: -25,
          },
        }}
        transition={{
          duration: 1,
          ease: "backInOut",
          delay: 0.2,
        }}
        cx="160.5"
        cy="114.5"
        r="101.5"
        fill="#000000"
      />
      <MotionEllipse
        variants={{
          hover: {
            scaleY: 2.25,
            y: -25,
          },
        }}
        transition={{
          duration: 1,
          ease: "backInOut",
          delay: 0.2,
        }}
        cx="160.5"
        cy="265.5"
        rx="101.5"
        ry="43.5"
        fill="#000000"
      />
    </MotionSvg>
  );
};

export default PriceCard;
