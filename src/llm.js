// The only place that talks to the model. OpenAI-compatible chat completions API.
const URL = process.env.LLM_URL ?? "http://localhost:1234/v1/chat/completions";
const MODEL = process.env.MODEL ?? "qwen3.5-4b-mlx";

export async function chat(messages, tools) {
  const res = await fetch(URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: MODEL, messages, tools, temperature: 0 }),
  });
  if (!res.ok) throw new Error(`LLM error ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.choices[0].message; // { role, content, tool_calls? }
}
