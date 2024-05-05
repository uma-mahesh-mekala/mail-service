module.exports = async (fastify) => {
  const mailHandler = async (request, reply) => {
    try {
      let fileContent, filename;
      let email, message, subject;
      let mailMessage = {};
      if (request.isMultipart()) {
        const fileData = await request.file();

        if (fileData) {
          filename = fileData.filename;
          const file = fileData.file;
          fileContent = await fastify.readFileContent(file);
        }

        email = fileData.fields.email.value;
        message = fileData.fields.message.value;
        subject = fileData.fields.subject.value;

        mailMessage = {
          from: process.env.EMAIL,
          to: email,
          subject: subject,
          text: message,
          attachments: [
            {
              filename: filename,
              content: fileContent,
            },
          ],
        };
      } else {
        ({ email, message, subject } = request.body);
      }

      mailMessage = {
        from: process.env.EMAIL,
        to: email,
        subject: subject,
        text: message,
        attachments: [],
      };

      const mailTransporter = await fastify.mailTransporter();
      mailTransporter.sendMail(mailMessage);
      reply.send({ message: "Mail sent successfully" });
    } catch (err) {
      console.log(err);
      reply.send({ message: "Mail sent unsuccessful" });
    }
  };
  const mailRoute = {
    method: "POST",
    url: "/mail",
    handler: mailHandler,
  };

  fastify.route(mailRoute);
};
