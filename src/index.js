// REPL: read a line, run the agent, print the answer, loop. The agent keeps the history.
import * as terminal from "./terminal.js";
import * as agent from "./agent.js";

while (true) {
  const input = await terminal.ask("user> ");
  if (input === "") continue;
  if (input === "/clear") {
    agent.clear();
    continue;
  }
  const answer = await agent.run(input);
  console.log(`agent> ${answer}\n`);
}
