import { readFileSync } from "fs";
import { parse } from "yaml";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadYaml(relativePath) {
  const content = readFileSync(resolve(__dirname, relativePath), "utf-8");
  return parse(content);
}

// Documento base (info, tags, securitySchemes)
const base = loadYaml("./openapi.yaml");

// Schemas
const userSchemas = loadYaml("./schemas/user.schema.yaml");
const petSchemas = loadYaml("./schemas/pet.schema.yaml");
const adoptionSchemas = loadYaml("./schemas/adoption.schema.yaml");
const commonSchemas = loadYaml("./schemas/common.schema.yaml");
const { responses, parameters } = loadYaml("./schemas/responses.schema.yaml");

// Paths
const authPaths = loadYaml("./paths/auth.paths.yaml");
const userPaths = loadYaml("./paths/user.paths.yaml");
const petPaths = loadYaml("./paths/pet.paths.yaml");
const adoptionPaths = loadYaml("./paths/adoption.paths.yaml");
const healthPaths = loadYaml("./paths/health.paths.yaml");

export const swaggerSpec = {
  ...base,
  components: {
    ...base.components,
    schemas: {
      ...userSchemas,
      ...petSchemas,
      ...adoptionSchemas,
      ...commonSchemas,
    },
    responses,
    parameters,
  },
  paths: {
    ...healthPaths,
    ...authPaths,
    ...userPaths,
    ...petPaths,
    ...adoptionPaths,
  },
};
