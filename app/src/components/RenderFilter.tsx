import React from "react";
import { Alert, Center } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import useGlobalStore from "../store/globalStore";

const RenderFilter: React.FC = (): JSX.Element => {
  const { selectValue } = useGlobalStore();

  return (
    <>
      {selectValue ? (
        <div>{selectValue}</div>
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
