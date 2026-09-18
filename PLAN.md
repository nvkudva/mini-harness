# PLAN

## Goal
A minimal coding harness (like Claude Code / Codex) in plain Node.js, small enough to read in one sitting.

## Architecture
- `src/index.js`  REPL. Reads a line from the user, calls the agent, prints the reply, repeats.
- `src/agent.js`  The agent loop. Sends history to the model. If the model asks for tools, runs them, appends results, asks again. Stops when the model answers in plain text.
- `src/llm.js`    The only network code. One `fetch` to `POST /v1/chat/completions` (OpenAI-compatible, LM Studio on localhost:1234).
- `src/tools.js`  Four tools: `read_file`, `write_file`, `list_files`, `run_command`. Each is a JSON schema (what the model sees) plus a function (what runs).
- `src/io.js`     One shared readline interface and an `ask()` helper used by the REPL and by the y/n confirmation.
- `src/prompt.js` The system prompt string.

## Decisions
- OpenAI-compatible chat API with raw `fetch`, zero dependencies. User's local model at `http://localhost:1234/v1`.
- Model picked by `MODEL` env var; endpoint by `LLM_URL`.
- `write_file` and `run_command` ask y/n before running. Read-only tools do not.
- Conversation history is a plain array of messages that lives for the whole REPL session.
- Tool results are returned as strings; errors are returned as strings too so the model can recover.

## Rejected alternatives
- Anthropic SDK / Messages API: user wants the local endpoint only.
- Streaming: adds parsing of server-sent events for no conceptual gain.
- Context compaction: not needed for short sessions; would hide the core loop.
- Subagents, MCP, permissions config file: out of scope for a primitive harness.
- `edit_file` with search/replace: `write_file` of the whole file is simpler to understand.

## Revisions
