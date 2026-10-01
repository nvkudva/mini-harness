// The agent loop: ask the model, run any tools it wants, feed results back, repeat until it answers in text.
import * as llm from "./llm.js";
import * as tools from "./tools.js";

const SYSTEM_PROMPT = `You are a coding assistant working inside the directory ${process.cwd()}.
You are running on ${process.platform} with the shell ${process.env.SHELL}. Pick shell commands that work there.
You have tools to list files, read files, write files and run shell commands.
Use tools to look before you act: read a file before changing it.
Prefer small, targeted changes. When the task is done, reply with a short plain-text summary.`;

// The whole conversation. It lives for the session and is the agent's only memory.
const context = [{ role: "system", content: SYSTEM_PROMPT }];

export function clear() {
  context.splice(1); // drop everything after the system prompt
  console.log("history cleared");
}

export async function run(input) {
  context.push({ role: "user", content: input });
  while (true) {
    if (process.env.DEBUG) console.log(JSON.stringify(context, null, 2)); // see exactly what the model sees
    console.log(" Working...");
    const reply = await llm.chat(context, tools.schemas);
    context.push(reply);

    if (!reply.tool_calls?.length) 
    return (reply.content ?? "").trim(); // plain answer: we are done

    for (const { id, function: fn } of reply.tool_calls) {
      const result = await tools.run(fn.name, fn.arguments);
      context.push({ role: "tool", tool_call_id: id, content: result });
    }
  }
}
