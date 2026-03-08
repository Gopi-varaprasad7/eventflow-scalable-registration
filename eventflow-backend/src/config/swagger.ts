import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "EventFlow API",
      version: "1.0.0",
      description: "Event management backend API documentation",
    },
    servers: [
      {
        url: "http://localhost:5001",
      },
    ],
  },
  apis: ["./src/routes/*.ts"], // path to route files
};

export const swaggerSpec = swaggerJsdoc(options);