const fastifyPlugin = require("fastify-plugin");

const fileContent = async (fastify) => {
  const readFileContent = (file) => {
    return new Promise((resolve, reject) => {
      const fileBuffer = [];
      file.on("data", (chunk) => {
        fileBuffer.push(chunk);
      });
      file.on("end", () => {
        resolve(Buffer.concat(fileBuffer));
      });
      file.on("error", (err) => {
        reject(err);
      });
    });
  };
  fastify.decorate("readFileContent", readFileContent);
};

module.exports = fastifyPlugin(fileContent);
