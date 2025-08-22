import React, { useEffect, useState } from "react";
import "./Blitz.css";
import { VideoPlayer } from "../components/Blitzcard/VideoPlayer";
import { Container, Box, Flex } from "@chakra-ui/react";
import { useRecoilState, useRecoilValue } from "recoil";
import useShowToast from "../../hooks/useShowToast";
import blitzsAtom from "../../atoms/BlitzsAtom";

function Blitz() {
  const [blitzs, setBlitzs] = useRecoilState(blitzsAtom);
  const [loading, setLoading] = useState(true);
  const showToast = useShowToast();
  useEffect(() => {
    const getFeedBlitzs = async () => {
      setLoading(true);
      setBlitzs([]);
      try {
        const res = await fetch("/api/blitzs/feed");
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        console.log(data);
        setBlitzs(data);
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setLoading(false);
      }
    };
    getFeedBlitzs();
  }, [showToast, setBlitzs]);

  return (
    <Flex className="app__videos" ml={"100px"}>
      <VideoPlayer />
    </Flex>
  );
}

export default Blitz;
