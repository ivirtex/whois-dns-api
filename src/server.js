// @ts-check

import { exec } from "child_process";

import Fastify from "fastify";
const fastify = Fastify({
  logger: true,
});

const PORT = 3000;

fastify.get("/whois/:query", (req, rep) => {
  // @ts-ignore
  const { query } = req.params;

  console.log(`Launching process for query: ${query}`);
  exec(`whoisrb ${query}`, (err, stdout, stderr) => {
    if (err) {
      console.error(err);
    }

    if (stderr) {
      console.error(stderr);
    }

    rep.send(stdout);
  });
});

const start = async () => {
  try {
    await fastify.listen(PORT);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
