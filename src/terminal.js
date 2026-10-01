// One shared readline so the REPL and the y/n/all confirmation never fight over stdin.
import { createInterface } from "node:readline/promises";

const readline = createInterface({ input: process.stdin, output: process.stdout });

// Async iterator buffers every line from the moment it is created, so piped input is never dropped
// while no question is pending. It ends on EOF (piped input, Ctrl-D or Ctrl-C).
const lines = readline[Symbol.asyncIterator]();

export async function ask(question) {
  if (!readline.closed) { // input may already have ended while a slow turn ran; buffered lines are still readable
    readline.setPrompt(question);
    readline.prompt();
  }
  const { value, done } = await lines.next();
  if (done) process.exit(0); // input is finished: nothing left to ask
  return value.trim();
}

let approveAll = false; // set by answering "all": no more questions this session

export async function confirm(question) {
  if (approveAll) return true;
  const answer = (await ask(`${question} [y/n/all] `)).toLowerCase();
  if (answer === "all") approveAll = true;
  return answer === "y" || approveAll;
}
