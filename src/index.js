// REPL: read a line, run the agent, print the answer, loop. History lives for the whole session.
import { ask, rl } from "./io.js";
import { runAgent } from "./agent.js";

const SYSTEM_PROMPT = `You are a coding assistant working inside the directory ${process.cwd()}.
You have tools to list files, read files, write files and run shell commands.
Use tools to look before you act: read a file before changing it.
Prefer small, targeted changes. When the task is done, reply with a short plain-text summary.`;

const messages = [{ role: "system", content: SYSTEM_PROMPT }];

while (true) {
  const input = await ask("\nyou> ");
  if (input === "exit" || input === "") break;
  messages.push({ role: "user", content: input });
  const answer = await runAgent(messages);
  console.log(`\nagent> ${answer}`);
}
rl.close();
