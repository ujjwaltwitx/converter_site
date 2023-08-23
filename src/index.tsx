import * as React from "react";
import { render } from "react-dom";
import Hello from "./Hello";
import * as Magick from "wasm-imagemagick";

const styles = {
  fontFamily: "sans-serif",
  textAlign: "center"
};

const App = () => (
  <div style={styles}>
    <Hello name="visitor" />
    <p>Command: </p>
    <textarea
      style={{ width: '100%', height: '100px' }}
      id="input"
      defaultValue={JSON.stringify(
        [
          'convert', 'People.jpg',
          '(', '-clone', '0', 'People2.jpg', '-compose', 'difference', '-composite',
          '-threshold', '5%', '-fill', 'red', '-opaque', 'white', '-transparent', 'black', ')',
          '-compose', 'over', '-composite', 'people_compare2.png'
        ]
      )}
    >
    </textarea>
    <p>
      <button onClick={doMagick}>do magick</button>
    </p>

    <p>Source image 1: </p>
    <img id="srcImage1" src="People.jpg" />
    <p>Source image 1: </p>
    <img id="srcImage2" src="People2.jpg" />

    <p>Result: </p>
    <img id="outputImage" />
  </div>
)


render(<App />, document.getElementById("root"));

// fetch the input image and get its content bytes
async function getImage(src: string): Uint8Array {
  const fetchedSourceImage1 = await fetch(src)
  return new Uint8Array(await fetchedSourceImage1.arrayBuffer())
}

async function doMagick() { 

  let command: string[] = []
  try {
    command = JSON.parse((document.getElementById('input')! as any).value)
  } catch (ex) {
    alert(ex)
  }

  // the image element where to load output images
  const outputImage = document.getElementById('outputImage')! as HTMLImageElement

  // calling ImageMagick with one source image, and command to rotate & resize image
  const inputFiles = [
    {
      name: 'People.jpg',
      content: await getImage("People.jpg")
    },
    {
      name: 'People2.jpg',
      content: await getImage("People2.jpg")
    },
  ]
  console.log({ command: command.join('" "'), content: inputFiles[0].content })
  const processedFiles = await Magick.Call(inputFiles, command);

  // response can be multiple files (example split) here we know we just have one
  const firstOutputImage = processedFiles[0];
  outputImage.src = URL.createObjectURL(firstOutputImage["blob"]);
  console.log("created image " + firstOutputImage["name"]);
}

doMagick();
