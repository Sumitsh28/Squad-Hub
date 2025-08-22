import React, { useState, useRef, useEffect, useCallback } from "react";
import { BlitzCard } from "./Blitzcard";
import { useRecoilState } from "recoil";
import blitzsAtom from "../../../atoms/BlitzsAtom"; // adjust path if needed
import "./VideoPlayer.css";
import useShowToast from "../../../hooks/useShowToast";

export const VideoPlayer = () => {
  const [blitzs, setBlitzs] = useRecoilState(blitzsAtom);
  const [loading, setLoading] = useState(true);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const containerRef = useRef(null);
  const videoRefs = useRef([]);
  const showToast = useShowToast();

  const snapToVideo = useCallback((index) => {
    const container = containerRef.current;
    if (!container) return;

    container.scrollTo({
      top: index * container.clientHeight,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, clientHeight } = container;
      const videoHeight = clientHeight;
      const newIndex = Math.round(scrollTop / videoHeight);
      if (
        newIndex !== currentVideoIndex &&
        newIndex >= 0 &&
        newIndex < blitzs.length
      ) {
        setCurrentVideoIndex(newIndex);
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [currentVideoIndex, blitzs.length]);

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
    <div className="video-player-container">
      <div ref={containerRef} className="video-scroll-container">
        {blitzs.map((video, index) => (
          <div
            key={video.id}
            ref={(el) => (videoRefs.current[index] = el)}
            className="video-item"
          >
            <BlitzCard
              video={video}
              isActive={index === currentVideoIndex}
              onVideoClick={() => snapToVideo(index)}
              postedBy={video.postedBy}
            />
          </div>
        ))}
        {blitzs.length === 0 && (
          <div className="loading-spinner-container">
            <div className="loading-spinner"></div>
          </div>
        )}
      </div>
    </div>
  );
};
