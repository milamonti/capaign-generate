const pino = require("pino");

const isDev = process.env.NODE_ENV === "development";

const logger = pino(
  isDev
    ? {
        transport: {
          target: "pino-pretty",
          options: { colorize: true },
        },
      }
    : undefined,
);

module.exports = logger;
