// One shared readline so the REPL and the y/n confirmation never fight over stdin.
import readline from "node:readline/promises";

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

// Async iterator buffers every line from the moment it is created, so piped input is never dropped
// while no question is pending. It ends on EOF (piped input, Ctrl-D or Ctrl-C).
const lines = rl[Symbol.asyncIterator]();

export async function ask(question) {
  process.stdout.write(question);
  const { value, done } = await lines.next();
  if (done) process.exit(0); // input is finished: nothing left to ask
  return value.trim();
}

export async function confirm(question) {
  const answer = await ask(`${question} [y/N] `);
  return answer.toLowerCase() === "y";
}
