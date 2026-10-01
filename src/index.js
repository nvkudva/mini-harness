// REPL: read a line, run the agent, print the answer, loop. History lives for the whole session.
import * as io from "./io.js";
import * as agent from "./agent.js";

const SYSTEM_PROMPT = `You are a coding assistant working inside the directory ${process.cwd()}.
You have tools to list files, read files, write files and run shell commands.
Use tools to look before you act: read a file before changing it.
Prefer small, targeted changes. When the task is done, reply with a short plain-text summary.`;

const messages = [{ role: "system", content: SYSTEM_PROMPT }];

while (true) {
  const input = await io.ask("\nyou> ");
  if (input === "exit" || input === "") break;
  if (input === "/reset") { messages.length = 1; console.log("history cleared"); continue; } // keep only the system prompt
  messages.push({ role: "user", content: input });
  const answer = await agent.run(messages);
  console.log(`\nagent> ${answer}`);
}
io.rl.close();
