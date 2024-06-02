import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import flv from "flv.js";

const LiveStream = () => {
  const [streaming, setStreaming] = useState(false);
  const videoRef = useRef(null);
  let flvPlayer = null;

  useEffect(() => {
    const socket = io("http://localhost:3000");

    socket.on("streamURL", (streamURL) => {
      if (streaming) {
        if (flvPlayer) {
          flvPlayer.unload();
          flvPlayer.detachMediaElement();
          flvPlayer.destroy();
        }

        flvPlayer = flv.createPlayer({
          type: "flv",
          url: `http://localhost:8000/live/${streamURL}.flv`, // Update with your stream URL
        });
        flvPlayer.attachMediaElement(videoRef.current);
        flvPlayer.load();
        flvPlayer.play();
      }
    });

    return () => {
      if (flvPlayer) {
        flvPlayer.unload();
        flvPlayer.detachMediaElement();
        flvPlayer.destroy();
      }
      socket.disconnect();
    };
  }, [streaming]);

  const startStream = () => {
    setStreaming(true);
  };

  const stopStream = () => {
    setStreaming(false);
    if (flvPlayer) {
      flvPlayer.pause();
    }
  };

  return (
    <div>
      <h2>Live Stream</h2>
      <video ref={videoRef} controls style={{ width: "100%" }}></video>
      <div>
        {!streaming ? (
          <button onClick={startStream}>Start Stream</button>
        ) : (
          <button onClick={stopStream}>Stop Stream</button>
        )}
      </div>
    </div>
  );
};

export default LiveStream;
