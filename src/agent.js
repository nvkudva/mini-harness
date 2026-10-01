// The agent loop: ask the model, run any tools it wants, feed results back, repeat until it answers in text.
import * as llm from "./llm.js";
import * as tools from "./tools.js";

export async function run(messages) {
  while (true) {
    if (process.env.DEBUG) console.log(JSON.stringify(messages, null, 2)); // see exactly what the model sees
    const reply = await llm.chat(messages, tools.schemas);
    messages.push(reply);

    if (!reply.tool_calls?.length) 
    return (reply.content ?? "").trim(); // plain answer: we are done

    for (const { id, function: fn } of reply.tool_calls) {
      let result;
      try {
        result = await tools.run(fn.name, JSON.parse(fn.arguments || "{}"));
      } catch (err) {
        result = `error: bad JSON arguments: ${err.message}`; // small models sometimes emit broken JSON
      }
      messages.push({ role: "tool", tool_call_id: id, content: result });
    }
  }
}
