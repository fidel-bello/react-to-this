import React from "react";
import { Select, Center } from "@mantine/core";
import useGlobalStore from "../store/globalStore";

const data = [
  { value: "Hop", label: "Hop" },
  { value: "hopper", label: "Hopper"}
];

const ImageFilter: React.FC = (): JSX.Element => {
    const { selectValue, setValue } = useGlobalStore();
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
