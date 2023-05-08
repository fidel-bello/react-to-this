import React, { useRef, useEffect } from "react";
import { Alert, Center } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { filters } from "../helpers/filters";
import useGlobalStore from "../store/globalStore";

const RenderFilter: React.FC = (): JSX.Element => {
  const { selectValue, imageUrl, CANVAS_HEIGHT, CANVAS_WIDTH } =
    useGlobalStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const render = (time: number) => {
    if (selectValue && imageUrl) {
      const canvas = canvasRef.current as HTMLCanvasElement;
      const gl = canvas.getContext("webgl");
      if (!gl) {
        console.error("Unable to initialize WebGL.");
        return;
      }

      const filter = filters[selectValue];

      const vertexShader = gl.createShader(gl.VERTEX_SHADER) as WebGLShader;
      gl.shaderSource(vertexShader, filter.vertex);
      gl.compileShader(vertexShader);
      if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.error(
          "An error occurred compiling the vertex shader.",
          gl.getShaderInfoLog(vertexShader)
        );
        return;
      }

      const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER) as WebGLShader;
      gl.shaderSource(fragmentShader, filter.fragment);
      gl.compileShader(fragmentShader);
      if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error(
          "An error occurred compiling the fragment shader.",
          gl.getShaderInfoLog(fragmentShader)
        );
        return;
      }

      const program = gl.createProgram() as WebGLProgram;
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error(
          "Unable to initialize the shader program.",
          gl.getProgramInfoLog(program)
        );
        return;
      }

      gl.useProgram(program);

      // Set up vertex data
      const vertexData = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
      const positionAttributeLocation = gl.getAttribLocation(
        program,
        "meshPosition"
      );
      const positionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);
      gl.enableVertexAttribArray(positionAttributeLocation);
      gl.vertexAttribPointer(
        positionAttributeLocation,
        2,
        gl.FLOAT,
        false,
        0,
        0
      );

      // Set up texture
      const image = new Image();
      image.onload = () => {
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          image
        );
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.uniform1i(gl.getUniformLocation(program, "emote"), 0);
      };

      image.onerror = () => {
        console.error("Error loading image:", imageUrl);
      };

      image.src = imageUrl;

      // Set up uniforms
      gl.uniform2f(
        gl.getUniformLocation(program, "resolution"),
        CANVAS_WIDTH,
        CANVAS_HEIGHT
      );
      gl.uniform1f(gl.getUniformLocation(program, "time"), time / 1000);
      for (const [paramName, paramValue] of Object.entries(
        filter.params || {}
      )) {
        gl.uniform1f(
          gl.getUniformLocation(program, paramName),
          paramValue.init
        );
      }

      // Render
      gl.viewport(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
    requestAnimationFrame(render);
  };
  useEffect(() => {
    requestAnimationFrame(render);
  }, [selectValue, imageUrl]);

  return (
    <>
      {selectValue ? (
        <canvas
          ref={canvasRef}
          style={{ border: "2px solid black" }}
          height={CANVAS_HEIGHT}
          width={CANVAS_WIDTH}
        />
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
