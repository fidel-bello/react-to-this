import React from "react";
import { Image, Center, Button, Flex } from "@mantine/core";
import useGlobalStore from "../store/globalStore";

const RenderImage: React.FC = (): JSX.Element => {
  const { imageUrl, reset } = useGlobalStore();

  if (!imageUrl) {
    return <div>You must select an image first</div>;
  }
  return (
    <Center>
      <Flex gap="md" direction="column">
        <Image height={112} width={112} src={imageUrl} />
        <Button onClick={reset} size="md">
          Reset
        </Button>
      </Flex>
    </Center>
  );
};

export default RenderImage;
