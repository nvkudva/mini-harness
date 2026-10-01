import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { C, MONO, typed } from "./theme.js";
import { Appear, Card, Code, Heading, Scene, Term, Window } from "./ui.jsx";

/* 1. Title */
export const Title = () => (
  <Scene>
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 28 }}>
      <Appear at={4}>
        <div style={{ fontFamily: MONO, fontSize: 30, color: C.cyan }}>user&gt; <span style={{ color: C.green }}>agnt&gt;</span></div>
      </Appear>
      <Appear at={10}>
        <div style={{ fontSize: 132, fontWeight: 800, letterSpacing: -4 }}>Mini Harness</div>
      </Appear>
      <Appear at={24}>
        <div style={{ fontSize: 44, color: "#cbd5e1" }}>A coding agent in about 160 lines of Node.js</div>
      </Appear>
      <Appear at={40}>
        <div style={{ display: "flex", gap: 18, marginTop: 14 }}>
          {["No dependencies", "Any OpenAI-compatible LLM", "Runs locally"].map((t) => (
            <span key={t} style={{ fontSize: 26, color: C.dim, border: `1px solid ${C.border}`, borderRadius: 40, padding: "10px 24px" }}>{t}</span>
          ))}
        </div>
      </Appear>
    </div>
  </Scene>
);

/* 2. The one idea */
const Arrow = ({ d, at, color }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <path d={d} fill="none" stroke={color} strokeWidth={5} strokeLinecap="round" markerEnd={`url(#ah-${color.slice(1)})`}
      pathLength={1} strokeDasharray={1} strokeDashoffset={1 - p} opacity={p > 0 ? 1 : 0} />
  );
};

const Node = ({ x, title, sub, at, color }) => (
  <Appear at={at} style={{ position: "absolute", left: x, top: 40 }}>
    <Card style={{ width: 380, height: 150, boxSizing: "border-box", borderColor: color, textAlign: "center" }}>
      <div style={{ fontSize: 44, fontWeight: 700, color }}>{title}</div>
      <div style={{ fontSize: 22, color: C.dim, marginTop: 8 }}>{sub}</div>
    </Card>
  </Appear>
);

export const Idea = () => (
  <Scene>
    <Heading sub="Everything else is plumbing around this loop.">The one idea</Heading>
    <div style={{ position: "absolute", left: 160, top: 300, width: 1600, height: 460 }}>
      <Node x={0} title="Model" sub="local/api" at={6} color={C.green} />
      <Node x={610} title="Tools" sub="read, write, list, run" at={14} color={C.amber} />
      <Node x={1220} title="Result" sub="added to the conversation" at={22} color={C.cyan} />
      <svg width={1600} height={400} style={{ position: "absolute", left: 0, top: 0 }}>
        <defs>
          {[C.green, C.amber, C.cyan].map((c) => (
            <marker key={c} id={`ah-${c.slice(1)}`} markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
              <path d="M0 0 L10 5 L0 10 z" fill={c} />
            </marker>
          ))}
        </defs>
        <Arrow d="M390 115 H600" at={30} color={C.green} />
        <Arrow d="M1000 115 H1210" at={80} color={C.amber} />
        <Arrow d="M1410 200 V330 H190 V200" at={125} color={C.cyan} />
      </svg>
      {[
        ["1", "Send the conversation to the model", 30, 0],
        ["2", "Run any tool the model asks for", 80, 610],
        ["3", "Repeat until it answers in text", 125, 1220],
      ].map(([n, t, at, x]) => (
        <Appear key={n} at={at} style={{ position: "absolute", left: x, top: 360, width: 380 }}>
          <div style={{ fontSize: 30, lineHeight: 1.35 }}>
            <span style={{ color: C.cyan, fontWeight: 700 }}>{n}  </span>{t}
          </div>
        </Appear>
      ))}
    </div>
  </Scene>
);

/* 3. Run it */
export const RunIt = () => {
  const lines = [
    { at: 20, segs: [{ t: "$ ", color: C.dim }, { t: "npm start", cps: 10 }] },
    { at: 62, segs: [{ t: "API:http://localhost:1234/v1/chat/completions MODEL:qwen3.5-4b-mlx.  Ctrl+C to quit", color: C.dim }] },
    { at: 62, segs: [] },
    { at: 70, segs: [{ t: "user> ", color: C.cyan }] },
  ];
  return (
    <Scene>
      <Heading sub="One command. Needs a local LLM server, like LM Studio.">How to run it</Heading>
      <div style={{ position: "absolute", left: 160, top: 340 }}>
        <Appear at={4}>
          <Window title="~/mini-harness" width={1600}>
            <Term lines={lines} size={26} minHeight={200} />
          </Window>
        </Appear>
      </div>
    </Scene>
  );
};

/* 4. Example session */
export const Example = () => {
  const lines = [
    { at: 8, segs: [{ t: "user> ", color: C.cyan }, { t: "hi", at: 14, cps: 8 }] },
    { at: 44, segs: [{ t: "agnt> ", color: C.green }, { t: "Hello! How can I help you today?", at: 44, cps: 50 }] },
    { at: 70, segs: [] },
    { at: 78, segs: [{ t: "user> ", color: C.cyan }, { t: "what time is it", at: 84, cps: 14 }] },
    { at: 150, segs: [{ t: ' Tool:run_command({"command":"date"})', color: C.dim }] },
    { at: 172, segs: [{ t: " Allow this tool? [y/n] ", color: C.amber }, { t: "y", at: 205, cps: 6 }] },
    { at: 225, segs: [{ t: "agnt> ", color: C.green }, { t: "The current time is Thursday, October 1st at 5:02 PM IST (2026).", at: 225, cps: 40 }] },
  ];
  const notes = [
    [172, "Risky tools ask first", "write_file and run_command wait for your y/n.", C.amber],
    [300, "/clear resets history", "Back to just the system prompt.", C.cyan],
    [350, "Ctrl-C quits", "No exit command to remember.", C.green],
  ];
  return (
    <Scene>
      <Heading sub="Ask something that needs a tool.">An example session</Heading>
      <div style={{ position: "absolute", left: 100, top: 250 }}>
        <Appear at={2}>
          <Window title="mini-harness" width={1160}>
            <Term lines={lines} size={23} minHeight={420} />
          </Window>
        </Appear>
      </div>
      <div style={{ position: "absolute", left: 1320, top: 250, width: 500, display: "flex", flexDirection: "column", gap: 22 }}>
        {notes.map(([at, t, s, c]) => (
          <Appear key={t} at={at}>
            <Card style={{ borderColor: c }}>
              <div style={{ fontSize: 32, fontWeight: 700, color: c }}>{t}</div>
              <div style={{ fontSize: 23, color: C.dim, marginTop: 8 }}>{s}</div>
            </Card>
          </Appear>
        ))}
      </div>
    </Scene>
  );
};

/* 5. The five files */
export const Files = () => {
  const files = [
    ["index.js", "The REPL", "Reads your line, prints the answer", C.cyan],
    ["terminal.js", "Readline", "The prompt and the y/n confirmation", C.dim],
    ["agent.js", "The loop", "Asks the model, runs tools, repeats", C.green],
    ["llm.js", "One fetch", "The only code that talks to the model", C.pink],
    ["tools.js", "Four tools", "A schema the model sees + a function that runs", C.amber],
  ];
  return (
    <Scene>
      <Heading sub="Read them in this order.">Five files, src/</Heading>
      <div style={{ position: "absolute", left: 100, top: 300, display: "flex", gap: 24 }}>
        {files.map(([f, role, d, c], i) => (
          <Appear key={f} at={10 + i * 22}>
            <Card style={{ width: 316, height: 380, boxSizing: "border-box", borderColor: c }}>
              <div style={{ fontSize: 28, color: C.dim }}>{i + 1}</div>
              <div style={{ fontFamily: MONO, fontSize: 36, fontWeight: 700, color: c, marginTop: 6 }}>{f}</div>
              <div style={{ fontSize: 34, fontWeight: 700, marginTop: 26 }}>{role}</div>
              <div style={{ fontSize: 24, color: "#9ca3af", marginTop: 12, lineHeight: 1.4 }}>{d}</div>
            </Card>
          </Appear>
        ))}
      </div>
    </Scene>
  );
};

/* 6. Code flow */
const TOOL = [
  "delete_file: {",
  '  description: "Delete a file.",',
  '  parameters: { type: "object", properties: { path: { type: "string" } }, required: ["path"] },',
  "  confirm: true,",
  "  run: async ({ path }) => { await fs.unlink(path); return `deleted ${path}`; },",
  "},",
];

const STEPS = [
  {
    file: "src/index.js", frames: 90, cap: "index.js starts the loop",
    code: ["// index.js", "while (true) {", '  const input = await terminal.ask("user> ");', "  ...", "  const answer = await agent.run(input);", "  console.log(`agnt> ${answer}\\n`);", "}"],
    hl: [1],
  },
  {
    file: "src/terminal.js", frames: 90, cap: "terminal.js asks for your input",
    code: ["// terminal.js", "export async function ask(question) {", "  ...", "  readline.prompt();", "  const { value, done } = await lines.next();", "  ...", "  return value.trim();", "}"],
    hl: [3, 4, 6],
  },
  {
    file: "src/agent.js", frames: 90, cap: "agent.js pushes your message onto context",
    code: ["// agent.js", "export async function run(input) {", '  context.push({ role: "user", content: input });', "  while (true) {"],
    hl: [2],
  },
  {
    file: "src/agent.js + src/llm.js", frames: 90, cap: "llm.chat posts { model, messages, tools }",
    code: ["// agent.js", "const reply = await llm.chat(context, tools.schemas);", "", "// llm.js", "body: JSON.stringify({ model: MODEL, messages, tools, temperature: 0 })"],
    hl: [1, 4],
  },
  {
    file: "src/agent.js", frames: 90, cap: "The reply has tool_calls, so the loop keeps going",
    code: ["// agent.js", "context.push(reply);", "", "if (!reply.tool_calls?.length)", '  return (reply.content ?? "").trim();', "", "for (const { id, function: fn } of reply.tool_calls) {", "  const result = await tools.run(fn.name, fn.arguments);"],
    hl: [1, 6, 7],
  },
  {
    file: "src/tools.js + src/agent.js", frames: 90, cap: "tools.js parses the command, asks to confirm, runs it. The result goes onto context",
    code: ["// tools.js", 'const args = JSON.parse(rawArgs || "{}");', 'const allowed = !tool.confirm || (await terminal.confirm(" Allow this tool?"));', 'if (!allowed) return "user denied this action";', "return String(await tool.run(args));", "", "// agent.js", 'context.push({ role: "tool", tool_call_id: id, content: result });'],
    hl: [1, 2, 4, 7],
  },
  {
    file: "src/agent.js + src/index.js", frames: 90, cap: "The loop calls the model again, prints the reply and keeps going",
    code: ["// agent.js", "const reply = await llm.chat(context, tools.schemas);", "if (!reply.tool_calls?.length)", '  return (reply.content ?? "").trim();', "", "// index.js", "console.log(`agnt> ${answer}\\n`);", "// ...then the while loop asks for the next prompt"],
    hl: [1, 3, 6],
  },
  { file: "src/tools.js", frames: 270, cap: "Try it yourself: add a tool", tool: true },
];

const STARTS = STEPS.map((_, i) => STEPS.slice(0, i).reduce((sum, x) => sum + x.frames, 0));

const CTX = [
  [0, "system", "You are a coding assistant working inside…", C.dim],
  [2, "user", "what time is it", C.cyan],
  [4, "assistant", 'tool_calls: run_command({"command":"date"})', C.green],
  [5, "tool", "Thu Oct  1 17:02:11 IST 2026", C.amber],
  [6, "assistant", "The current time is Thursday, October 1st…", C.green],
];

export const Flow = () => {
  const frame = useCurrentFrame();
  const n = STARTS.filter((st) => st <= frame).length - 1;
  const step = STEPS[n];
  const local = frame - STARTS[n];
  const fade = interpolate(local, [0, 8], [0, 1], { extrapolateRight: "clamp" });
  const code = step.tool ? typed(TOOL.join("\n"), local, 12, 110).split("\n") : step.code;
  return (
    <Scene>
      <div style={{ position: "absolute", top: 60, left: 100, right: 100 }}>
        <div style={{ fontFamily: MONO, fontSize: 26, color: C.cyan }}>STEP {n + 1} / {STEPS.length}</div>
        <div style={{ fontSize: 46, fontWeight: 700, marginTop: 10, opacity: fade, minHeight: 112 }}>{step.cap}</div>
      </div>
      <div style={{ position: "absolute", left: 100, top: 270 }}>
        <Window title={step.file} width={step.tool ? 1720 : 1130}>
          <div style={{ opacity: fade, minHeight: 470 }}>
            <Code lines={code} highlight={step.hl ?? []} size={22} />
            {step.tool && local > 150 && (
              <div style={{ marginTop: 28, fontSize: 36, fontWeight: 700, color: C.green }}>The schema builds itself.</div>
            )}
          </div>
        </Window>
      </div>
      {!step.tool && <div style={{ position: "absolute", left: 1270, top: 270, width: 550 }}>
        <Card style={{ minHeight: 560 }}>
          <div style={{ fontSize: 30, fontWeight: 700 }}>context</div>
          <div style={{ fontSize: 21, color: C.dim, marginBottom: 18 }}>the agent's entire memory</div>
          {CTX.filter(([st]) => n >= st).map(([st, role, text, c]) => {
            const fresh = n === st;
            return (
              <div key={st} style={{
                borderLeft: `5px solid ${c}`, padding: "10px 16px", marginBottom: 14,
                background: fresh ? "rgba(255,255,255,.07)" : "transparent",
                opacity: fresh ? fade : 1, transform: fresh ? `translateY(${(1 - fade) * 14}px)` : "none",
              }}>
                <div style={{ fontFamily: MONO, fontSize: 21, color: c }}>{role}</div>
                <div style={{ fontFamily: MONO, fontSize: 19, color: "#cbd5e1", marginTop: 4 }}>{text}</div>
              </div>
            );
          })}
        </Card>
      </div>}
    </Scene>
  );
};

/* 8. Outro */
export const Outro = () => (
  <Scene>
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 30 }}>
      <Appear at={4}>
        <div style={{ fontSize: 110, fontWeight: 800, letterSpacing: -3 }}>Mini Harness</div>
      </Appear>
      <Appear at={30}>
        <div style={{ fontFamily: MONO, fontSize: 38, color: C.cyan }}>github.com/nvkudva/mini-harness</div>
      </Appear>
      <Appear at={50}>
        <div style={{ fontFamily: MONO, fontSize: 30, color: C.dim }}>npm start</div>
      </Appear>
    </div>
  </Scene>
);
