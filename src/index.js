// REPL: read a line, run the agent, print the answer, loop. The agent keeps the history.
import * as llm from "./llm.js";
import * as terminal from "./terminal.js";
import * as agent from "./agent.js";

console.log(`API:${llm.ENDPOINT} MODEL:${llm.MODEL}.  Ctrl+C to quit \n`);

while (true) {
  const input = await terminal.ask("user> ");
  if (input === "") continue;
  if (input === "/clear") {
    agent.clear();
    continue;
  }
  try {
    const answer = await agent.run(input);
    console.log(`agnt> ${answer}\n`);
  } catch (err) {
    console.error(`error: ${err.message}`);
    process.exit(1);
  }
}
