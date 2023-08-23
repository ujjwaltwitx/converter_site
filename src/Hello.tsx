import * as React from "react";

interface Props {
  name: string;
}

export default ({ name }: Props) => (
  <p>Welcome to <a href="https://github.com/KnicKnic/WASM-ImageMagick">WASM-ImageMagick</a> image diff demo. Two images with sightly differences are shown first and third one showing its differences. Play around with the command above. </p>

);
