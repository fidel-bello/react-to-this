import React from "react";
import { Group, Button, rem } from "@mantine/core";
import { useGiphyContext } from "../../context/GiphyContext";

const LastStep: React.FC = (): JSX.Element => {
  const { prev  } = useGiphyContext();
  return (
    <Group position="center" mt={rem(50)}>
      <Button variant="default" onClick={prev}>
        Back
      </Button>
    </Group>
  );
};

export default LastStep;
