import React, { useState } from "react";
import { Stepper, Button, Group, rem } from "@mantine/core";
import UploadImage from "./UploadImage/UploadImage";
import ImageFilter from "./ImageFilter";
import RenderImage from "./RenderImage";
import DownloadImage from "./Downloadmage";

const Header: React.FC = (): JSX.Element => {
  const [active, setActive] = useState(0);

  const next = () => setActive((curr) => (curr < 3 ? curr + 1 : curr));
  const prev = () => setActive((curr) => (curr > 0 ? curr - 1 : curr));

  return (
    <>
      <Stepper active={active} onStepClick={setActive} breakpoint="sm" >
        <Stepper.Step label="First step" description="Add an Image">
         <UploadImage />
        </Stepper.Step>
        <Stepper.Step label="Second step" description="Verify email">
          <ImageFilter />
        </Stepper.Step>
        <Stepper.Step label="Final step" description="Get full access">
          <RenderImage />
        </Stepper.Step>
        <Stepper.Completed>
          <DownloadImage />
        </Stepper.Completed>
      </Stepper>
      <Group position="center" mt={rem(50)}>
        <Button variant="default" onClick={prev}>
          Back
        </Button>
        <Button onClick={next}>Next step</Button>
      </Group>
    </>
  );
};

export default Header;
