import React, { useRef, useEffect, useState } from "react";
import { ActionIcon, Alert, Button, Center, Flex, Tooltip, rem } from "@mantine/core";
import { IconAlertCircle, IconArrowBackUp } from "@tabler/icons-react";
import { filters } from "../helpers/filters";
import useGlobalStore from "../store/globalStore";
import GIF from "gif.js";

const RenderFilter: React.FC = (): JSX.Element | null => {
  const { selectValue, imageUrl, CANVAS_HEIGHT, CANVAS_WIDTH, reset } = useGlobalStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [creating, setCreating] = useState<boolean>(false);
  const framesRef = useRef<ImageData[]>([]);
  const framesCountRef = useRef<number>(0);

  const gif = new GIF({ workers: 5, width: CANVAS_WIDTH, height: CANVAS_WIDTH, quality: 10 });
  const image = new Image();

  image.src = imageUrl as string;

  const setTexture = (gl: WebGLRenderingContext, program: WebGLProgram) => {
    image.onload = () => {
      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.uniform1i(gl.getUniformLocation(program, "emote"), 0);
    };

    image.onerror = () => {
      console.error("Error loading image:", imageUrl);
    };
  };

  const render = (time: number) => {
    if (selectValue && imageUrl) {
      const canvas = canvasRef.current as HTMLCanvasElement;
      const gl = canvas.getContext("webgl");
      if (!gl) {
        console.error("Unable to initialize WebGL.");
        return null;
      }

      const filter = filters[selectValue];

      const vertexShader = gl.createShader(gl.VERTEX_SHADER) as WebGLShader;
      gl.shaderSource(vertexShader, filter.vertex);
      gl.compileShader(vertexShader);
      if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.error("An error occurred compiling the vertex shader.", gl.getShaderInfoLog(vertexShader));
        return null;
      }

      const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER) as WebGLShader;
      gl.shaderSource(fragmentShader, filter.fragment);
      gl.compileShader(fragmentShader);
      if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error("An error occurred compiling the fragment shader.", gl.getShaderInfoLog(fragmentShader));
        return null;
      }

      const program = gl.createProgram() as WebGLProgram;
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error("Unable to initialize the shader program.", gl.getProgramInfoLog(program));
        return null;
      }

      gl.useProgram(program);

      setTexture(gl, program);
      // Set up vertex data
      const vertexData = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
      const positionAttributeLocation = gl.getAttribLocation(program, "meshPosition");
      const positionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);
      gl.enableVertexAttribArray(positionAttributeLocation);
      gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

      gl.uniform1f(gl.getUniformLocation(program, "time"), time / 1000);
      for (const [paramName, paramValue] of Object.entries(filter.params || {})) {
        gl.uniform1f(gl.getUniformLocation(program, paramName), paramValue.init);
      }
      // Render
      gl.viewport(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      framesCountRef.current += 1;
      const captureInterval = 30;
     
      if (framesCountRef.current % captureInterval === 0) {
        let pixels = new Uint8ClampedArray(4 * CANVAS_WIDTH * CANVAS_HEIGHT);
        gl.readPixels(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
        // Flip the image vertically
        {
          const halfHeight = Math.floor(CANVAS_HEIGHT / 2);
          const row = 4 * CANVAS_WIDTH;

          for (let y = 0; y < halfHeight; ++y) {
            for (let x = 0; x < row; ++x) {
              const ai = y * row + x;
              const bi = (CANVAS_HEIGHT - y - 1) * row + x;
              const temp = pixels[ai];
              pixels[ai] = pixels[bi];
              pixels[bi] = temp;
            }
          }
        }

        const frames = new ImageData(pixels, CANVAS_HEIGHT, CANVAS_WIDTH);
        framesRef.current.push(frames);
      }
      requestAnimationFrame(render);
    }
  };
  useEffect(() => {
    requestAnimationFrame(render);
  }, []);

  const handleCreateGif = () => {
    setCreating(true);
    const frameDelay = 100;
    gif.on("finished", (blob: Blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "animation.gif";
      a.click();
      URL.revokeObjectURL(url);
      setCreating(false);
    });

    framesRef.current.forEach((frame: ImageData) => {
      gif.addFrame(frame, { delay: frameDelay, dispose: 2 });
    });

    gif.render();
  };

  return (
    <>
      {selectValue ? (
        <Center>
          <Flex direction="column">
            <canvas ref={canvasRef} style={{ border: "2px solid black" }} height={CANVAS_HEIGHT} width={CANVAS_WIDTH} />
            <Flex mt={rem(10)} sx={{ justifyContent: "space-between" }}>
              <Tooltip label="Generate gif">
                <Button onClick={handleCreateGif} loading={creating} disabled={creating}>
                  GIF
                </Button>
              </Tooltip>
              <Tooltip label="Start over">
                <ActionIcon onClick={reset} size={rem(37.5)}>
                  <IconArrowBackUp />
                </ActionIcon>
              </Tooltip>
            </Flex>
          </Flex>
        </Center>
      ) : (
        <Center>
          <Alert sx={{ width: "50%" }} icon={<IconAlertCircle size="1rem" />} title="Bummer!" color="red">
            You must select a filter!
          </Alert>
        </Center>
      )}
    </>
  );
};

export default RenderFilter;
