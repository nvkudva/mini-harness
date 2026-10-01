// One shared readline so the REPL and the y/n confirmation never fight over stdin.
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

export async function confirm(question) {
  const answer = await ask(`${question} [y/n] `);
  return answer.toLowerCase() === "y";
}
