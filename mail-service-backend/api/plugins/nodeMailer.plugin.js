const nodemailer = require("nodemailer");
const fastifyPlugin = require("fastify-plugin");

const nodeMailerPlugin = async (fastify) => {
  const mailTransporter = async () => {
    const options = {
      service: "Gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    };
    const transporter = nodemailer.createTransport(options);
    return transporter;
  };
  fastify.decorate("mailTransporter", mailTransporter);
};

module.exports = fastifyPlugin(nodeMailerPlugin);
