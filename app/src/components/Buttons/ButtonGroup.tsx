import React from "react";
import { Group, Button, rem, Tooltip } from "@mantine/core";
import useGlobalStore from "../../store/globalStore";

const ButtonGroup: React.FC = (): JSX.Element => {
  const { prev, file, next } = useGlobalStore();
  return (
    <Group position="center" mt={rem(50)}>
      <Button variant="default" onClick={prev}>
        Back
      </Button>
      {file ? (
        <Button onClick={next}>Next step</Button>
      ) : (
        <Tooltip
          label="You must select an image to advance to the next step."
          color="red"
          withArrow
          arrowPosition="center"
        >
          <Button
            data-disabled
            sx={{ "&[data-disabled]": { pointerEvents: "all" } }}
            onClick={(event) => event.preventDefault()}
          >
            Next step
          </Button>
        </Tooltip>
      )}
    </Group>
  );
};

export default ButtonGroup;
