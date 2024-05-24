import Blitz from "../models/blitzModel.js";
import User from "../models/userModel.js";
import { v2 as cloudinary } from "cloudinary";

const createBlitz = async (req, res) => {
  try {
    const { postedBy, text } = req.body;
    let { vid } = req.body;

    // Check for required fields
    if (!postedBy || !text) {
      return res
        .status(400)
        .json({ error: "PostedBy and text fields are required" });
    }

    // Find the user
    const user = await User.findById(postedBy);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the authenticated user is the same as the postedBy user
    if (user._id.toString() !== req.user._id.toString()) {
      return res.status(401).json({ error: "Unauthorized to create blitz" });
    }

    // Validate text length
    const maxLength = 30;
    if (text.length > maxLength) {
      return res
        .status(400)
        .json({ error: `Text must be less than ${maxLength} characters` });
    }

    // Upload video to Cloudinary if vid is provided
    if (vid) {
      try {
        // Check if vid is a valid URL or a file path
        if (typeof vid === "string" && vid.startsWith("http")) {
          // vid is already a URL
          console.log("vid is already a URL:", vid);
        } else {
          // vid is a file path, attempt to upload to Cloudinary
          const uploadedResponse = await cloudinary.uploader.upload(vid, {
            resource_type: "video", // Ensure the resource type is set to video
          });
          vid = uploadedResponse.secure_url;
          console.log("Video uploaded to Cloudinary:", vid);
        }
      } catch (uploadError) {
        console.error("Failed to upload video to Cloudinary:", uploadError);
        return res
          .status(500)
          .json({ error: "Failed to upload video to Cloudinary" });
      }
    }

    // Create a new blitz
    const newBlitz = new Blitz({ postedBy, text, vid });
    await newBlitz.save();

    // Return the newly created blitz
    res.status(201).json(newBlitz);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

const getBlitz = async (req, res) => {
  try {
    const blitz = await Blitz.findById(req.params.id);

    if (!blitz) {
      return res.status(404).json({ error: "Blitz not found" });
    }

    res.status(200).json(blitz);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteBlitz = async (req, res) => {
  try {
    const blitz = await Blitz.findById(req.params.id);
    if (!blitz) {
      return res.status(404).json({ error: "Blitz not found" });
    }

    if (blitz.postedBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ error: "Unauthorized to delete blitz" });
    }

    if (blitz.vid) {
      const vidId = blitz.vid.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(vidId);
    }

    await Blitz.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Blitz deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const likeUnlikeBlitz = async (req, res) => {
  try {
    const { id: blitzId } = req.params;
    const userId = req.user._id;

    const blitz = await Blitz.findById(blitzId);

    if (!blitz) {
      return res.status(404).json({ error: "Blitz not found" });
    }

    const userLikedBlitz = blitz.likes.includes(userId);

    if (userLikedBlitz) {
      // Unlike post
      await Blitz.updateOne({ _id: blitzId }, { $pull: { likes: userId } });
      res.status(200).json({ message: "Blitz unliked successfully" });
    } else {
      // Like post
      blitz.likes.push(userId);
      await blitz.save();
      res.status(200).json({ message: "Blitz liked successfully" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const replyToBlitz = async (req, res) => {
  try {
    const { text } = req.body;
    const blitzId = req.params.id;
    const userId = req.user._id;
    const userProfilePic = req.user.profilePic;
    const username = req.user.username;

    if (!text) {
      return res.status(400).json({ error: "Text field is required" });
    }

    const blitz = await Blitz.findById(blitzId);
    if (!blitz) {
      return res.status(404).json({ error: "Blitz not found" });
    }

    const reply = { userId, text, userProfilePic, username };

    blitz.replies.push(reply);
    await blitz.save();

    res.status(200).json(reply);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getFeedBlitzs = async (req, res) => {
  try {
    const feedBlitzs = await Blitz.find().sort({ createdAt: -1 });

    res.status(200).json(feedBlitzs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getUserBlitzs = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const blitzs = await Blitz.find({ postedBy: user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json(blitzs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export {
  createBlitz,
  getBlitz,
  deleteBlitz,
  likeUnlikeBlitz,
  replyToBlitz,
  getFeedBlitzs,
  getUserBlitzs,
};
