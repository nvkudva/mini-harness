// Each tool = a schema the model sees + a function that runs. `confirm: true` asks y/N first.
import fs from "node:fs/promises";
import { execSync } from "node:child_process";
import { confirm } from "./io.js";

export const tools = {
  list_files: {
    description: "List files and folders in a directory.",
    parameters: { type: "object", properties: { path: { type: "string" } }, required: ["path"] },
    run: async ({ path }) => (await fs.readdir(path)).join("\n"),
  },
  read_file: {
    description: "Read the full contents of a file.",
    parameters: { type: "object", properties: { path: { type: "string" } }, required: ["path"] },
    run: ({ path }) => fs.readFile(path, "utf8"),
  },
  write_file: {
    description: "Create or overwrite a file with the given content.",
    parameters: {
      type: "object",
      properties: { path: { type: "string" }, content: { type: "string" } },
      required: ["path", "content"],
    },
    confirm: true,
    run: async ({ path, content }) => {
      await fs.writeFile(path, content);
      return `wrote ${content.length} chars to ${path}`;
    },
  },
  run_command: {
    description: "Run a shell command and return its output.",
    parameters: { type: "object", properties: { command: { type: "string" } }, required: ["command"] },
    confirm: true,
    run: ({ command }) => execSync(command, { encoding: "utf8", stdio: "pipe" }) || "(no output)",
  },
};

// The shape the OpenAI-style API expects in the `tools` field.
export const toolSchemas = Object.entries(tools).map(([name, t]) => ({
  type: "function",
  function: { name, description: t.description, parameters: t.parameters },
}));

export async function runTool(name, args) {
  const tool = tools[name];
  if (!tool) return `error: unknown tool ${name}`;
  console.log(`  > ${name}(${JSON.stringify(args)})`);
  if (tool.confirm && !(await confirm("  Allow?"))) return "user denied this action";
  try {
    return String(await tool.run(args));
  } catch (err) {
    return `error: ${err.message}`; // give the error back to the model so it can recover
  }
}
