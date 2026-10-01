// The only place that talks to the model. OpenAI-compatible chat completions API.
export const ENDPOINT = process.env.LLM_URL ?? "http://localhost:1234/v1/chat/completions";
export const MODEL = process.env.MODEL ?? "qwen3.5-4b-mlx";

export async function chat(messages, tools) {
  let res;
  try {
    res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: MODEL, messages, tools, temperature: 0 }),
    });
  } catch (err) {
    throw new Error(`cannot reach the model server at ${ENDPOINT} (${err.cause?.message ?? err.message}). Is it running? Check LLM_URL, MODEL values`);
  }
  if (!res.ok) {
    const body = await res.json().catch(() => null); // OpenAI-style: { error: { message } }
    throw new Error(`${body?.error?.message ?? res.statusText} (HTTP ${res.status}, model: ${MODEL})`);
  }
  const data = await res.json();
  const message = data.choices?.[0]?.message; // { role, content, tool_calls? }
  if (!message) throw new Error(data.error?.message ?? data.error ?? "the model server returned no reply");
  return message;
}
