const { request } = require("undici");

const LLM_API_URL = process.env.LLM_API_URL;
const LLM_API_KEY = process.env.LLM_API_KEY;

async function callLLM(prompt, options = {}) {
  if (!LLM_API_URL || !LLM_API_KEY) {
    throw new Error(
      "LLM_API_URL e LLM_API_KEY devem estar configurados no .env",
    );
  }

  // Exemplo para o endpoint de Chat Completions (adaptar se seu provedor usa outro shape)
  const body = {
    model: "gpt-4o-mini", // ou outro modelo que tiver disponível
    messages: [
      {
        role: "system",
        content: "Você é um assistente especialista em marketing.",
      },
      { role: "user", content: prompt },
    ],
    max_tokens: options.maxTokens || 700,
    temperature: options.temperature ?? 0.7,
  };

  let res;
  try {
    res = await request(LLM_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LLM_API_KEY}`,
      },
      body: JSON.stringify(body),
    });
  } catch (networkErr) {
    console.error("Erro de rede ao chamar LLM:", networkErr);
    throw new Error("Erro de rede ao chamar LLM: " + networkErr.message);
  }

  if (res.statusCode >= 400) {
    const text = await res.body.text();
    console.error("LLM error:", res.statusCode, text);
    throw new Error(`LLM error: ${res.statusCode} - ${text}`);
  }

  let data;
  try {
    data = await res.body.json();
  } catch (parseErr) {
    console.error("Erro ao parsear resposta da LLM:", parseErr);
    throw new Error("Erro ao parsear resposta da LLM: " + parseErr.message);
  }

  // Ajuste conforme formato de resposta — aqui assumimos que a resposta de chat está em data.choices[0].message.content
  const content = data?.choices?.[0]?.message?.content;
  if (!content) {
    console.error("Resposta da LLM inesperada:", data);
    throw new Error("Resposta da LLM inesperada: sem conteúdo");
  }
  return content;
}

module.exports = { callLLM };
