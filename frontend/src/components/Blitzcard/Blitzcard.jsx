import React, { useState, useRef, useEffect } from "react";
import "./Blitzcard.css";
import {
  Heart,
  MessageCircle,
  Share,
  MoreHorizontal,
  Volume2,
  VolumeX,
  Bookmark,
  Flag,
  Star,
} from "lucide-react";
import { CommentModal } from "./CommentModal";
import useShowToast from "../../../hooks/useShowToast";
import userAtom from "../../../atoms/UserAtoms";
import blitzsAtom from "../../../atoms/BlitzsAtom";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";

export const BlitzCard = ({ video, isActive, onVideoClick, postedBy }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [user, setUser] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(video.likes.length);
  const [isLiking, setIsLiking] = useState(false);
  const [showFashionModal, setShowFashionModal] = useState(false);
  const [loadingFashion, setLoadingFashion] = useState(false);
  const [fashionData, setFashionData] = useState([]);

  const showToast = useShowToast();
  const currentUser = useRecoilValue(userAtom);
  const [blitzs, setBlitzs] = useRecoilState(blitzsAtom);
  const navigate = useNavigate();
  const videoRef = useRef(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleVideoPlayback = async () => {
      try {
        videoElement.pause();

        if (isActive) {
          await videoElement.play();
          setIsPlaying(true);
        } else {
          setIsPlaying(false);
        }
      } catch (err) {
        console.error("Video play error:", err);
      }
    };

    handleVideoPlayback();
  }, [isActive]);

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

  useEffect(() => {
    if (currentUser && video?.likes) {
      setIsLiked(video.likes.includes(currentUser._id));
    }
  }, [currentUser, video.likes]);

  if (!user) return null;

  const handleLikeAndUnlike = async () => {
    if (!currentUser)
      return showToast(
        "Error",
        "You must be logged in to like a post",
        "error"
      );

    if (isLiking) return;

    setIsLiking(true);

    try {
      const res = await fetch("/api/blitzs/like/" + video._id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: currentUser._id }),
      });

      const data = await res.json();

      if (data.error) return showToast("Error", data.error, "error");

      const updatedIsLiked = !isLiked;
      setIsLiked(updatedIsLiked);
      setLikesCount((prev) => prev + (updatedIsLiked ? 1 : -1));

      const updatedBlitzs = blitzs.map((b) =>
        b._id === video._id
          ? {
              ...b,
              likes: updatedIsLiked
                ? [...b.likes, currentUser._id]
                : b.likes.filter((id) => id !== currentUser._id),
            }
          : b
      );

      setBlitzs(updatedBlitzs);
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setIsLiking(false);
    }
  };

  const togglePlayPause = () => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    if (isPlaying) {
      videoElement.pause();
      setIsPlaying(false);
    } else {
      videoElement.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    videoElement.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const formatCount = (count) => {
    if (count >= 1000000) return (count / 1000000).toFixed(1) + "M";
    if (count >= 1000) return (count / 1000).toFixed(1) + "K";
    return count;
  };

  const handleFashionScan = async () => {
    try {
      setLoadingFashion(true);
      setShowFashionModal(true);
      const res = await fetch("/api/analyze-fashion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoUrl: video.vid }),
      });

      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        setFashionData([]);
      } else {
        setFashionData(data.items || []);
      }
    } catch (err) {
      showToast("Error", "Could not analyze fashion items", "error");
    } finally {
      setLoadingFashion(false);
    }
  };

  return (
    <div className="video-container">
      <video
        ref={videoRef}
        className="video-element"
        src={video.vid}
        loop
        muted={isMuted}
        playsInline
        poster={video.thumbnail}
        onClick={togglePlayPause}
      />

      <div className="overlay-gradient" />

      <div className="top-bar">
        <div className="top-content">
          <div className="reels-title">Blitz</div>
          <button onClick={toggleMute} className="mute-button">
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
        </div>
      </div>

      <div className="bottom-bar">
        <div className="bottom-content">
          <div className="left-section">
            <div className="user-info">
              <img
                src={user?.profilePic}
                alt={user.username}
                className="user-avatar"
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/${user.username}`);
                }}
              />
              <div>
                <div className="username-row">
                  <span className="username">{user.username}</span>
                  {user.isVerified && <span className="verified-badge">✓</span>}
                </div>
                <button
                  onClick={() => setIsFollowing(!isFollowing)}
                  className={`follow-btn ${isFollowing ? "following" : ""}`}
                >
                  {isFollowing ? "Following" : "Follow"}
                </button>
              </div>
            </div>

            <p className="description">{video.text}</p>

            {video.music ? (
              <div className="music-info">
                <span>♪</span>
                <span className="music-text">{video.music}</span>
              </div>
            ) : (
              <div className="music-info">
                <span>♪</span>
                <span className="music-text">Original Music</span>
              </div>
            )}
          </div>

          <div className="right-section">
            <button onClick={handleLikeAndUnlike} className="action-button">
              <div className={`icon-bg ${isLiked ? "liked" : ""}`}>
                <Heart
                  size={24}
                  className={`icon ${isLiked ? "filled" : ""}`}
                />
              </div>
              <span className="count">{formatCount(likesCount)}</span>
            </button>

            <button
              onClick={() => setShowComments(true)}
              className="action-button"
            >
              <div className="icon-bg">
                <MessageCircle size={24} className="icon" />
              </div>
              <span className="count">{formatCount(video.comments)}</span>
            </button>

            {true ? (
              <>
                <button onClick={handleFashionScan} className="action-button">
                  <div className="icon-bg">
                    <Star size={24} className="icon" />
                  </div>
                  <span className="count">Style</span>
                </button>

                {showFashionModal && (
                  <div
                    className="modal-backdrop"
                    onClick={() => setShowFashionModal(false)}
                  >
                    <div
                      className="modal-content"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <h3>Detected Fashion Items</h3>
                      {loadingFashion ? (
                        <p>Analyzing video...</p>
                      ) : fashionData.length === 0 ? (
                        <p>No fashion items found.</p>
                      ) : (
                        <ul>
                          {fashionData.map((item, idx) => (
                            <li key={idx}>
                              {item.links && item.links.length > 0 ? (
                                item.links.map((link, i) => (
                                  <a
                                    key={i}
                                    href={link}
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    {item.item} — View
                                  </a>
                                ))
                              ) : (
                                <a
                                  href={`https://www.google.com/search?q=buy+${item.item}+online`}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  {item.item} — Search Online
                                </a>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                      <button
                        className="close-btn"
                        onClick={() => setShowFashionModal(false)}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <button
                onClick={() => console.log("Share video")}
                className="action-button"
              >
                <div className="icon-bg">
                  <Share size={24} className="icon" />
                </div>
                <span className="count">{formatCount(video.shares)}</span>
              </button>
            )}

            <div className="menu-wrapper">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="icon-bg"
              >
                <MoreHorizontal size={24} className="icon" />
              </button>

              {showMenu && (
                <>
                  <div
                    className="menu-overlay"
                    onClick={() => setShowMenu(false)}
                  />
                  <div className="menu-dropdown">
                    <button className="menu-item">
                      <Bookmark size={16} className="menu-icon" />
                      Save
                    </button>
                    <button className="menu-item">
                      <Flag size={16} className="menu-icon" />
                      Report
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {!isPlaying && isActive && (
        <div className="play-overlay">
          <div className="play-icon" />
        </div>
      )}

      {showComments && (
        <CommentModal video={video} onClose={() => setShowComments(false)} />
      )}
    </div>
  );
};
