// The agent loop: ask the model, run any tools it wants, feed results back, repeat until it answers in text.
import { chat } from "./llm.js";
import { toolSchemas, runTool } from "./tools.js";

export async function runAgent(messages) {
  while (true) {
    const reply = await chat(messages, toolSchemas);
    messages.push(reply);

    if (!reply.tool_calls?.length) return (reply.content ?? "").trim(); // plain answer: we are done

    for (const call of reply.tool_calls) {
      const args = JSON.parse(call.function.arguments || "{}");
      const result = await runTool(call.function.name, args);
      messages.push({ role: "tool", tool_call_id: call.id, content: result });
    }
  }
}
