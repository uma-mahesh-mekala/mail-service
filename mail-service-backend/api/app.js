const fastify = require("fastify");
const AutoLoad = require("@fastify/autoload");
const fastifyMultipart = require("@fastify/multipart");
const cors = require("@fastify/cors");
const formbody = require("@fastify/formbody");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();

const buildServer = async () => {
  const fastifyInstance = fastify();

  fastifyInstance
    .register(fastifyMultipart)
    .register(cors, {
      origin: true,
    })
    .register(formbody)
    .register(AutoLoad, {
      dir: path.join(__dirname, "plugins"),
    })
    .register(AutoLoad, {
      dir: path.join(__dirname, "routes"),
      options: { prefix: "/api" },
    });

  return fastifyInstance;
};

buildServer()
  .then((instance) => {
    console.log(instance.printRoutes());

    const serverOptions = {
      port: process.env.PORT,
      host: process.env.HOST,
    };

    instance.listen(serverOptions, (err, address) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      console.log(`Server is running on ${address}`);
    });
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
