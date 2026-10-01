# Mini Harness

A tiny coding agent, like Claude Code or Codex, in about 160 lines of Node.js.
No dependencies. By default it talks to your local LLM at `http://localhost:1234/v1`.

https://github.com/user-attachments/assets/6d595ad4-6c60-434d-855b-a15888649643

## Run it

```bash
LLM_URL=http://localhost:1234/v1/chat/completions MODEL=qwen3.8-27b-splash npm start
```

`LLM_URL` is the chat completions endpoint of any OpenAI-compatible server. `MODEL` is the model name that server expects.
Both are optional. To hard-code them, edit `ENDPOINT` and `MODEL` at the top of `src/llm.js`.

For a hosted API, also set `API_KEY`. It is sent as `Authorization: Bearer <key>`. Keep it in the environment, not in the file:

```bash
API_KEY=sk-... LLM_URL=https://api.openai.com/v1/chat/completions MODEL=gpt-4o-mini npm start
```

On start it prints the model and endpoint in use. Type a task. Type `/clear` to clear the history. Press Ctrl-C to quit.
If the model call fails (server down, wrong model name), it prints the error and exits.
Set `DEBUG=1` to print the full `context` array before every model call.
Long tool calls are trimmed to 100 characters on screen. The model still gets the full call. `run_command` gives up after 30 seconds.

Example session:

```
user> hi
 Working...
agnt> Hello! How can I help you today?

user> what time is it
 Working...
 Tool:run_command({"command":"date"})
 Allow this tool? [y/n/all] y
 Working...
agnt> The current time is Thursday, October 1st at 5:02 PM IST (2026).
```

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
| `src/terminal.js` | One shared readline for both the prompt and the y/n/all confirmation. |

Read them in this order: `index.js`, `agent.js`, `llm.js`, `tools.js`, `terminal.js`.

## Step by step

Here is what happens when you type `create hello.txt with the word hello`.

**Step 1. The REPL takes your line.** `index.js` passes it to `agent.run`, which appends it to `context` as a `user` message.
`context` is a plain array kept in `agent.js`. It starts with one `system` message and grows for the whole session.
That array is the agent's entire memory.

**Step 2. The agent sends everything to the model.** `agent.js` calls `llm.chat(context, tools.schemas)`.
`tools.schemas` is the list of tools the model may use, as JSON. The model never runs anything itself.
It can only ask.

**Step 3. `llm.js` makes the HTTP request.** It posts `{ model, messages, tools }` to `/v1/chat/completions`.
It returns just the `message` object from the reply. That object has `content` and maybe `tool_calls`.
If the server is unreachable or rejects the request, it throws a short error. `index.js` prints it and exits.

**Step 4. The agent checks the reply.** If there are no `tool_calls`, the model is done. The text is returned and printed.
If there are `tool_calls`, the agent keeps going.

**Step 5. Each tool call is run.** A tool call looks like `{ id, function: { name: "write_file", arguments: "{...}" } }`.
The arguments are a JSON string. The agent passes it as is to `tools.run(name, arguments)`, which parses it.
Broken JSON comes back to the model as an error string instead of crashing.

**Step 6. Dangerous tools ask first.** `write_file` and `run_command` have `confirm: true`.
`tools.run` prints the call and asks `Allow this tool? [y/n/all]`. Answer `all` to stop being asked for the rest of the session. If you say no, the tool returns `"user denied this action"`.
The model sees that string and can change plan.

**Step 7. The result goes back into the conversation.** The agent pushes `{ role: "tool", tool_call_id, content }`.
Errors are pushed the same way as strings. The model can read the error and try again.

**Step 8. Loop.** Back to step 2. The model now sees the tool result and decides what to do next.
It might call another tool, like `list_files`, or answer in text. When it answers in text, the loop exits.

**Step 9. Print and wait.** `index.js` prints `agnt> ...` and shows `user>` again.
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
