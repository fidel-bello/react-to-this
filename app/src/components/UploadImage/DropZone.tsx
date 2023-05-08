import { useRef } from "react";
import { Text, Group, Button, rem } from "@mantine/core";
import { Dropzone, MIME_TYPES } from "@mantine/dropzone";
import { IconCloudUpload, IconX, IconDownload } from "@tabler/icons-react";
import useStyles from "./styles";
import useGlobalStore from "../../store/globalStore";

const DropzoneButton: React.FC = (): JSX.Element => {
  const { file, setFile, setImageUrl, setActive } = useGlobalStore();
  const { classes, theme } = useStyles();
  const openRef = useRef<() => void>(null);

  if (file) {
    setActive(2 - 1);
  }
  const handleDrop = (file: File[]) => {
    setFile(file[0]);
    const imageUrl = URL.createObjectURL(file[0]);
    setImageUrl(imageUrl);
  };
  return (
    <div className={classes.wrapper}>
      <Dropzone
        openRef={openRef}
        onDrop={handleDrop}
        className={classes.dropzone}
        radius="md"
        accept={[MIME_TYPES.jpeg, MIME_TYPES.png]}
        maxSize={30 * 1024 ** 2}
      >
        <div style={{ pointerEvents: "none" }}>
          <Group position="center">
            <Dropzone.Accept>
              <IconDownload
                size={rem(50)}
                color={theme.colors[theme.primaryColor][6]}
                stroke={1.5}
              />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <IconX size={rem(50)} color={theme.colors.red[6]} stroke={1.5} />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <IconCloudUpload
                size={rem(50)}
                color={
                  theme.colorScheme === "dark"
                    ? theme.colors.dark[0]
                    : theme.black
                }
                stroke={1.5}
              />
            </Dropzone.Idle>
          </Group>

          <Text ta="center" fw={700} fz="lg" mt="xl">
            <Dropzone.Accept>Drop files here</Dropzone.Accept>
            <Dropzone.Reject>Only pngs or jpegs</Dropzone.Reject>
            <Dropzone.Idle>Upload photo</Dropzone.Idle>
          </Text>
          <Text ta="center" fz="sm" mt="xs" c="dimmed">
            Drag&apos;n&apos;drop files here to upload. Accepts only <i>.png</i>{" "}
            and <i>.jpeg</i> files that are less than 30mb in size.
          </Text>
        </div>
      </Dropzone>

      <Button
        className={classes.control}
        size="md"
        radius="xl"
        onClick={() => openRef.current?.()}
      >
        Select files
      </Button>
    </div>
  );
};

export default DropzoneButton;
