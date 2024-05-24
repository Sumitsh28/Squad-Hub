import React, { useEffect, useRef } from "react";
import lottie from "lottie-web";
import animationData from "../../src/assets/animation.json";
import { useNavigate } from "react-router-dom";
import { Flex, Text } from "@chakra-ui/react";

const PaymentConfirmation = () => {
  return (
    <Flex flexDirection={"column"} alignItems={"center"}>
      <Animation />
      <Text fontSize={"40"}>You are now a premium user.</Text>
    </Flex>
  );
};

const Animation = () => {
  const animationContainer = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const anim = lottie.loadAnimation({
      container: animationContainer.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: animationData, // Your animation JSON data
    });

    // Clean up animation when component unmounts
    return () => {
      anim.destroy();
    };
  }, []); // Empty dependency array ensures this effect runs only once

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate("/"); // Redirect to "/"
    }, 5000); // Adjust the timeout as needed (e.g., 5000 milliseconds for 5 seconds)

    // Clear the timeout if the component unmounts before redirection
    return () => {
      clearTimeout(timeout);
    };
  }, [navigate]);

  return (
    <div
      ref={animationContainer}
      style={{ width: "100%", height: "100%" }}
    ></div>
  );
};

export default PaymentConfirmation;
