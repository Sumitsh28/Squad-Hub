import React from "react";
import profile from "../../public/profile.jpg";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import {
  StreamVideoClient,
  StreamVideo,
  StreamCall,
  useCall,
  useCallStateHooks,
  ParticipantView,
} from "@stream-io/video-react-sdk";
import {
  Box,
  Button,
  Flex,
  Input,
  Skeleton,
  SkeletonCircle,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
const Live = () => {
  const userId = import.meta.env.VITE_USER_ID;
  const apiKey = import.meta.env.VITE_API_KEY;
  const token = import.meta.env.VITE_TOKEN;
  const callId = import.meta.env.VITE_CALL_ID;

  const user = {
    id: userId,
    name: "Sumit2",
    image: profile,
  };

  const client = new StreamVideoClient({ apiKey, user, token });
  const call = client.call("livestream", callId);
  call.camera.disable();
  call.microphone.disable();
  call.join({ create: true });
  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <MyLiveStreamUI />
      </StreamCall>
    </StreamVideo>
  );
};

export const MyLiveStreamUI = () => {
  const call = useCall();
  const { useIsCallLive, useLocalParticipant, useParticipantCount } =
    useCallStateHooks();

  const totalParticipants = useParticipantCount();
  const localParticipants = useLocalParticipant();
  const isCallLive = useIsCallLive();
  return (
    <Box>
      <Flex flexDirection={"column"} gap={"5px"}>
        <Box
          alignSelf={"flex-start"}
          color={"white"}
          backgroundColor={"black"}
          borderRadius={"8px"}
          padding={("4px", "6px")}
        >
          Live: {totalParticipants}
        </Box>
        <Box flex={1}>
          {localParticipants && (
            <ParticipantView
              participant={localParticipants}
              ParticipantViewUI={null}
            />
          )}
        </Box>
        <Box alignSelf={"center"}>
          {isCallLive ? (
            <Button onClick={() => call?.stopLive()}>Stop Livestream</Button>
          ) : (
            <Button onClick={() => call?.goLive()}>Start Livestream</Button>
          )}
        </Box>
      </Flex>
    </Box>
  );
};

export default Live;
