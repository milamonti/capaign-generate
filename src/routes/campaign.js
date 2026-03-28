const { generateCampaignScript } = require("../llm");
const campaignSchema = require("../schemas/campaign-schema");

async function routes(fastify, options) {
  fastify.post(
    "/generate",
    {
      schema: {
        body: campaignSchema,
        response: {
          200: {
            type: "object",
            properties: {
              script: { type: "string" },
              metadata: { type: "object" },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const payload = request.body;
      // Aqui podemos enriquecer payload, validar extra, registrar logs, etc.
      fastify.log.info(
        { campaign: payload.name },
        "Gerando roteiro para campanha",
      );

      try {
        const script = await generateCampaignScript(payload);
        return reply.send({
          script,
          metadata: {
            length: script.length,
            generatedAt: new Date().toISOString(),
          },
        });
      } catch (err) {
        fastify.log.error(err, "Erro ao gerar roteiro");
        reply.code(500).send({ error: "Erro interno ao gerar roteiro" });
      }
    },
  );
}

module.exports = routes;
