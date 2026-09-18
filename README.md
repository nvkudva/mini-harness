# Mini Harness

A tiny coding agent, like Claude Code or Codex, in about 100 lines of Node.js.
No dependencies. It talks to your local LLM at `http://localhost:1234/v1`.

## Run it

```bash
MODEL=qwen3.5-4b-mlx node src/index.js
```

Type a task. Type `exit` or an empty line to quit.
`MODEL` picks the model; `LLM_URL` changes the endpoint. Both are optional.

## The one idea

A coding harness is a loop with three parts:

1. Send the conversation to the model.
2. If the model asks to use a tool, run it and add the result to the conversation.
3. Go back to step 1. Stop when the model replies with plain text.

Everything else is plumbing around that loop.

## The files

| File | Job |
|------|-----|
| `src/index.js` | The REPL. Reads your line, calls the agent, prints the answer. |
| `src/agent.js` | The loop above. The heart of the harness. |
| `src/llm.js` | One `fetch` call to the model. The only network code. |
| `src/tools.js` | Four tools. Each has a schema the model sees and a function that runs. |
| `src/io.js` | One shared readline for both the prompt and the y/N confirmation. |
| `src/prompt.js` | The system prompt string. |

## Step by step

Here is what happens when you type `create hello.txt with the word hello`.

**Step 1. The REPL takes your line.** `index.js` appends it to `messages` as a `user` message.
`messages` is a plain array. It starts with one `system` message and grows for the whole session.
That array is the agent's entire memory.

**Step 2. The agent sends everything to the model.** `agent.js` calls `chat(messages, toolSchemas)`.
`toolSchemas` is the list of tools the model may use, as JSON. The model never runs anything itself.
It can only ask.

**Step 3. `llm.js` makes the HTTP request.** It posts `{ model, messages, tools }` to `/v1/chat/completions`.
It returns just the `message` object from the reply. That object has `content` and maybe `tool_calls`.

**Step 4. The agent checks the reply.** If there are no `tool_calls`, the model is done. The text is returned and printed.
If there are `tool_calls`, the agent keeps going.

**Step 5. Each tool call is run.** A tool call looks like `{ id, function: { name: "write_file", arguments: "{...}" } }`.
The arguments are a JSON string, so the agent parses them and calls `runTool(name, args)`.

**Step 6. Dangerous tools ask first.** `write_file` and `run_command` have `confirm: true`.
`runTool` prints the call and asks `Allow? [y/N]`. If you say no, the tool returns `"user denied this action"`.
The model sees that string and can change plan.

**Step 7. The result goes back into the conversation.** The agent pushes `{ role: "tool", tool_call_id, content }`.
Errors are pushed the same way as strings. The model can read the error and try again.

**Step 8. Loop.** Back to step 2. The model now sees the tool result and decides what to do next.
It might call another tool, like `list_files`, or answer in text. When it answers in text, the loop exits.

**Step 9. Print and wait.** `index.js` prints `agent> ...` and shows `you>` again.
Your next message is added to the same array, so the model remembers everything so far.

## Adding a tool

Add one entry to the `tools` object in `src/tools.js`:

```js
delete_file: {
  description: "Delete a file.",
  parameters: { type: "object", properties: { path: { type: "string" } }, required: ["path"] },
  confirm: true,
  run: async ({ path }) => { await fs.unlink(path); return `deleted ${path}`; },
},
```

That is it. The schema is built from the object automatically.

## What real harnesses add on top

Same loop, more plumbing:

- Streaming the reply token by token.
- Compacting old messages when the context gets full.
- A permissions file so you are not asked every time.
- Search-and-replace edits instead of whole-file writes.
- Subagents: the same loop started inside a tool.
- Retries, timeouts, token counting, logging.
