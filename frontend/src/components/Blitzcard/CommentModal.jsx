import React, { useState, useRef, useEffect } from "react";
import "./CommentModal.css";
import { X, Heart, MoreHorizontal, Send } from "lucide-react";

export const CommentModal = ({ video, onClose }) => {
  const [comments, setComments] = useState([]); // truncate for brevity
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const inputRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    if (replyingTo && inputRef.current) {
      inputRef.current.focus();
    }
  }, [replyingTo]);

  const handleCommentSubmit = () => {};
  const handleReplySubmit = (commentId) => {};
  const toggleLike = (commentId, isReply = false, replyId) => {};
  const toggleReplies = (commentId) => {};

  return (
    <div className="modal-overlay">
      <div ref={modalRef} className="modal-container">
        <div className="modal-header">
          <h2 className="modal-title">Comments</h2>
          <button onClick={onClose} className="modal-close">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {comments.map((comment) => (
            <div key={comment.id} className="comment-wrapper">
              <div className="comment-main">
                <img
                  src={comment.user.avatar}
                  alt={comment.user.username}
                  className="avatar"
                />
                <div className="comment-content">
                  <div className="comment-header">
                    <span className="username">{comment.user.username}</span>
                    {comment.user.isVerified && (
                      <span className="verified">✓</span>
                    )}
                    <span className="timestamp">{comment.timestamp}</span>
                  </div>
                  <p className="comment-text">{comment.text}</p>
                  <div className="comment-actions">
                    <button
                      onClick={() => toggleLike(comment.id)}
                      className="action-btn"
                    >
                      <Heart
                        size={12}
                        className={comment.isLiked ? "liked" : ""}
                      />
                      <span>{comment.likes > 0 ? comment.likes : ""}</span>
                    </button>
                    <button
                      onClick={() => setReplyingTo(comment.id)}
                      className="reply-btn"
                    >
                      Reply
                    </button>
                    {comment.replies.length > 0 && (
                      <button
                        onClick={() => toggleReplies(comment.id)}
                        className="reply-btn"
                      >
                        {comment.showReplies ? "Hide" : "View"}{" "}
                        {comment.replies.length}{" "}
                        {comment.replies.length === 1 ? "reply" : "replies"}
                      </button>
                    )}
                  </div>
                </div>
                <button className="more-options">
                  <MoreHorizontal size={16} className="icon-muted" />
                </button>
              </div>

              {comment.showReplies &&
                comment.replies.map((reply) => (
                  <div key={reply.id} className="reply">
                    <img
                      src={reply.user.avatar}
                      alt={reply.user.username}
                      className="avatar-sm"
                    />
                    <div className="reply-content">
                      <div className="reply-header">
                        <span className="username">{reply.user.username}</span>
                        <span className="timestamp">{reply.timestamp}</span>
                      </div>
                      <p className="reply-text">{reply.text}</p>
                      <button
                        onClick={() => toggleLike(comment.id, true, reply.id)}
                        className="action-btn"
                      >
                        <Heart
                          size={12}
                          className={reply.isLiked ? "liked" : ""}
                        />
                        <span>{reply.likes > 0 ? reply.likes : ""}</span>
                      </button>
                    </div>
                  </div>
                ))}

              {replyingTo === comment.id && (
                <div className="reply-input">
                  <img src="..." alt="You" className="avatar-sm" />
                  <div className="reply-field">
                    <input
                      ref={inputRef}
                      type="text"
                      placeholder={`Reply to ${comment.user.username}...`}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleReplySubmit(comment.id)
                      }
                      className="input"
                    />
                    <button
                      onClick={() => handleReplySubmit(comment.id)}
                      className="send-btn"
                    >
                      <Send size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="modal-footer">
          <img src="..." alt="You" className="avatar" />
          <div className="comment-field">
            <input
              type="text"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleCommentSubmit()}
              className="input"
            />
            <button
              onClick={handleCommentSubmit}
              className="send-btn"
              disabled={!newComment.trim()}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
