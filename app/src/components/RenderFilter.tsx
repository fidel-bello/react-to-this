import React, { useRef, useEffect, useState } from "react";
import { Alert, Button, Center } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { filters } from "../helpers/filters";
import useGlobalStore from "../store/globalStore";
import GIF from "gif.js";


const gif = new GIF({
  workers: 5,
  quality: 10,
  width: 112,
  height: 112,
});

const RenderFilter: React.FC = (): JSX.Element | null => {
  const { selectValue, imageUrl, CANVAS_HEIGHT, CANVAS_WIDTH } =
    useGlobalStore();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [creatingGif, setCreatingGif] = useState<boolean>(false);


  const image = new Image();
  image.src = imageUrl as string;

  const setTexture = (gl: WebGLRenderingContext, program: WebGLProgram) => {
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

      let pixels = new Uint8ClampedArray(4 * CANVAS_WIDTH * CANVAS_HEIGHT);
      gl.readPixels(
        0,
        0,
        CANVAS_WIDTH,
        CANVAS_HEIGHT,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        pixels
      );
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
        console.error(
          "An error occurred compiling the vertex shader.",
          gl.getShaderInfoLog(vertexShader)
        );
        return null;
      }

      const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER) as WebGLShader;
      gl.shaderSource(fragmentShader, filter.fragment);
      gl.compileShader(fragmentShader);
      if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error(
          "An error occurred compiling the fragment shader.",
          gl.getShaderInfoLog(fragmentShader)
        );
        return null;
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
        return null;
      }

      gl.useProgram(program);

      setTexture(gl, program);

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
        const fps = 30;
        const dt = 1.0 / fps;
        let t = 0.0;
        let pixels = new Uint8ClampedArray(4 * CANVAS_WIDTH * CANVAS_HEIGHT);
        gl.readPixels(
          0,
          0,
          CANVAS_WIDTH,
          CANVAS_HEIGHT,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          pixels
        );
        // Flip the image vertically
        {
          const center = Math.floor(CANVAS_HEIGHT / 2);
          for (let y = 0; y < center; ++y) {
            const row = 4 * CANVAS_WIDTH;
            for (let x = 0; x < row; ++x) {
              const ai = y * 4 * CANVAS_WIDTH + x;
              const bi = (CANVAS_HEIGHT - y - 1) * 4 * CANVAS_WIDTH + x;
              const a = pixels[ai];
              const b = pixels[bi];
              pixels[ai] = b;
              pixels[bi] = a;
            }
          }
        }

        gif.addFrame(new ImageData(pixels, CANVAS_WIDTH, CANVAS_HEIGHT), {
          delay: dt * 1000,
          dispose: 2,
        });

        t += dt;
      }
    

    requestAnimationFrame(render);
  };




  useEffect(() => {
   

    requestAnimationFrame(render);
  }, []);

  const handleGif = () => {
    setCreatingGif(true);
    if(creatingGif){
      gif.on("finished", (blob) => {
        const url = URL.createObjectURL(blob);
        console.log(url);  
        // renderPreview.style.display = "block";
        // renderDownload.href = renderPreview.src;
        // renderDownload.download = filename;
        // renderDownload.style.display = "block";
        // renderSpinner.style.display = "none";
      });
      setCreatingGif(false);
    }
  };

 

  return (
    <>
      {selectValue ? (
        <Center>
          <canvas
            ref={canvasRef}
            style={{ border: "2px solid black" }}
            height={CANVAS_HEIGHT}
            width={CANVAS_WIDTH}
          />
          <Button onClick={handleGif}>Create Gif</Button>
        </Center>
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
