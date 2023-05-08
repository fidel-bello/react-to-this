import React, { useEffect, useRef } from "react";
import { Alert, Center } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import useGlobalStore from "../store/globalStore";

const RenderFilter: React.FC = (): JSX.Element => {

  const { selectValue, imageUrl, CANVAS_HEIGHT, CANVAS_WIDTH } = useGlobalStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas && imageUrl) {
      const context = canvas.getContext("2d");
      const image = new Image();
      image.src = imageUrl;
      image.onload = () => {
        context?.drawImage(image, 0, 0, canvas.width, canvas.height);
      };
    }
  }, [imageUrl]);
  return (
    <>
      {selectValue ? (
        <canvas
          ref={canvasRef}
          height={CANVAS_HEIGHT}
          width={CANVAS_WIDTH}
          style={{ border: "1px solid black" }}
        />
      ) : (
        <Center>
          <Alert
            sx={{ width: "50%" }}
            icon={<IconAlertCircle size="1rem" />}
            title="Bummer!"
            color="red"
          >
            You must select a filter!
          </Alert>
        </Center>
      )}
    </>
  );
};

export default RenderFilter;
