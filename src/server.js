const Fastify = require("fastify");
require("dotenv").config();

const campaignRoutes = require("./routes/campaign");

const isDev = process.env.NODE_ENV === "development";

const server = Fastify({
  logger: isDev
    ? {
        transport: {
          target: "pino-pretty",
          options: { colorize: true },
        },
      }
    : true,
});

server.register(campaignRoutes, { prefix: "/campaigns" });

const start = async () => {
  try {
    const port = process.env.PORT || 3000;
    await server.listen({ port, host: "0.0.0.0" });
    server.log.info(`Server listening on ${port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
