// Schema JSON Schema para validação básica do payload
module.exports = {
  type: "object",
  required: ["name", "objective", "targetAudience", "channels"],
  properties: {
    name: { type: "string", minLength: 3 },
    objective: { type: "string" },
    targetAudience: {
      type: "object",
      properties: {
        ageRange: { type: "string" },
        interests: { type: "array", items: { type: "string" } },
        geo: { type: "string" },
      },
    },
    budget: { type: "number" },
    duration: { type: "string" }, // ex: "2 weeks"
    channels: { type: "array", items: { type: "string" } }, // ex: ["facebook","email"]
    tone: { type: "string" }, // ex: "informal", "professional"
    extraContext: { type: "string" },
  },
  additionalProperties: false,
};
