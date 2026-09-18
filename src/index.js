// REPL: read a line, run the agent, print the answer, loop. History lives for the whole session.
import { ask, rl } from "./io.js";
import { runAgent } from "./agent.js";
import { SYSTEM_PROMPT } from "./prompt.js";

const messages = [{ role: "system", content: SYSTEM_PROMPT }];

while (true) {
  const input = await ask("\nyou> ");
  if (input === "exit" || input === "") break;
  messages.push({ role: "user", content: input });
  const answer = await runAgent(messages);
  console.log(`\nagent> ${answer}`);
}
rl.close();
