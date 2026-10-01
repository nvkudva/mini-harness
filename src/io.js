// One shared readline so the REPL and the y/n confirmation never fight over stdin.
import readline from "node:readline/promises";

export const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

export async function ask(question) {
  // EOF (piped input or Ctrl-D): readline closes; a pending or new question would throw.
  if (rl.closed) return "";
  return (await rl.question(question).catch(() => "")).trim();
}

export async function confirm(question) {
  const answer = await ask(`${question} [y/N] `);
  return answer.toLowerCase() === "y";
}
