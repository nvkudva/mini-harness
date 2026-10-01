import React from "react";
import { Composition } from "remotion";
import { Demo, TOTAL } from "./Demo.jsx";
import { FPS } from "./theme.js";

export const Root = () => (
  <Composition id="Demo" component={Demo} durationInFrames={TOTAL} fps={FPS} width={1920} height={1080} />
);
