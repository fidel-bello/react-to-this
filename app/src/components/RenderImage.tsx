import React from "react";
import useGlobalStore from "../store/globalStore";

const RenderImage: React.FC = (): JSX.Element => {
  const { imageUrl } = useGlobalStore();
  if (!imageUrl) {
    return <div>You must select an image first</div>;
  }
  return <img src={imageUrl} alt="Uploaded file" />;
};

export default RenderImage;
