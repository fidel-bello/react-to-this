import React from "react";
import { Stepper } from "@mantine/core";
import UploadImage from "./UploadImage/UploadImage";
import ImageFilter from "./ImageFilter";
import RenderImage from "./RenderImage";
import DownloadImage from "./Downloadmage";
import useGlobalStore from "../store/globalStore";
import ButtonGroup from "./Buttons/ButtonGroup";
import RenderFilter from "./RenderFilter";

const Header: React.FC = (): JSX.Element => {
  const { active, setActive } = useGlobalStore();

  return (
    <>
      <Stepper active={active} onStepClick={setActive} breakpoint="sm">
        <Stepper.Step label="First step" description="Add an Image">
          <UploadImage />
        </Stepper.Step>
        <Stepper.Step label="Second step" description="Verify Image">
          <RenderImage />
        </Stepper.Step>
        <Stepper.Step label="Third step" description="Verify Filter">
          <ImageFilter />
        </Stepper.Step>
        <Stepper.Step label="Fourth step" description="Verify Image">
          <RenderFilter />
        </Stepper.Step>
        <Stepper.Completed>
          <DownloadImage />
        </Stepper.Completed>
      </Stepper>
      <ButtonGroup />
    </>
  );
};

export default Header;
