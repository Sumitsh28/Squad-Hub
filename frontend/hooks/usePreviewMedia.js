import { useState } from "react";
import useShowToast from "./useShowToast";

const usePreviewMedia = () => {
  const [vidUrl, setVidUrl] = useState(null);
  const showToast = useShowToast();

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    console.log(file);

    if (file && file.type.startsWith("video/")) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setVidUrl(reader.result);
      };

      reader.readAsDataURL(file);
    } else {
      showToast("Invalid file type", " Please select an video file", "error");
      setVidUrl(null);
    }
  };

  return { handleVideoChange, vidUrl, setVidUrl };
};

export default usePreviewMedia;
