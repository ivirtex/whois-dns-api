// @ts-check

import { exec } from "child_process";

import Fastify from "fastify";
const fastify = Fastify({
  logger: true,
});

const PORT = 2137;
const HOSTNAME = "0.0.0.0";

fastify.get("/whois/:query", (req, rep) => {
  // @ts-ignore
  const { query } = req.params;

  console.log(`Launching process for WHOIS query: ${query}`);
  exec(`whoisrb ${query}`, (err, stdout, stderr) => {
    if (err) {
      console.error(err);

      rep.send({ status: "fail", message: err.message });
    }

    if (stderr) {
      console.error(stderr);

      rep.send({ status: "fail", message: stderr });
    }

    rep.send({ status: "success", response: stdout });
  });
});

fastify.get("/dns/:query", (req, rep) => {
  // @ts-ignore
  const { query } = req.params;

  console.log(`Launching process for DNS Lookup query: ${query}`);
  exec(`echo ${query} | ./zdns_arm64 A`, (err, stdout, stderr) => {
    if (err) {
      console.error(err);

      rep.send({ status: "fail", message: err.message });
    }

    if (stderr) {
      console.error(stderr);

      rep.send({ status: "fail", message: stderr });
    }

    rep.send({ status: "success", response: JSON.parse(stdout) });
  });
});

const start = async () => {
  try {
    await fastify.listen(PORT, HOSTNAME);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
