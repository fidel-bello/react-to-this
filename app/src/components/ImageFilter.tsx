import React from "react";
import { Select, Center } from "@mantine/core";
import { useGiphyContext } from "../context/GiphyContext";

const data = [
  { value: "Hop", label: "Hop" },
  { value: "Hopper", label: "Hopper"},
  { value: "Wiggle", label: "Wiggle" },
  { value: "Overheat", label: "Overheat" }
];

const ImageFilter: React.FC = (): JSX.Element => {
    const { selectValue, setValue, imageUrl } = useGiphyContext();

    if (!imageUrl) {
      return <div>You must select an image first</div>;
    }
    
  return (
    <Center>
      <Select
        style={{ width: "50%" }}
        label="Pick a filter"
        placeholder="Pick one"
        value={selectValue}
        onChange={setValue}
        clearable
        data={data}
      />
    </Center>
  );
};

export default ImageFilter;
