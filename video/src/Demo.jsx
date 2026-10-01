import React from "react";
import { Series } from "remotion";
import { sec } from "./theme.js";
import { Example, Files, Flow, Idea, Outro, RunIt, Title } from "./scenes.jsx";

export const SCENES = [
  [Title, 4],
  [Idea, 6],
  [RunIt, 6],
  [Example, 14],
  [Files, 10],
  [Flow, 30],
  [Outro, 5],
];

export const TOTAL = SCENES.reduce((sum, [, s]) => sum + sec(s), 0);

export const Demo = () => (
  <Series>
    {SCENES.map(([Scene, s], i) => (
      <Series.Sequence key={i} durationInFrames={sec(s)}>
        <Scene />
      </Series.Sequence>
    ))}
  </Series>
);
