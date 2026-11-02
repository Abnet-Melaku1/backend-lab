import { test } from "node:test";
import assert from "node:assert/strict";
import { createContainer } from "./container.js";

test("a singleton is built once and shared", () => {
  const c = createContainer();
  c.register("config", () => ({ port: 3000 }), "singleton");

  assert.equal(c.resolve("config"), c.resolve("config"));
});

test("a transient service is new every time", () => {
  const c = createContainer();
  c.register("greeting", () => ({ text: "hello" }));

  assert.notEqual(c.resolve("greeting"), c.resolve("greeting"));
});

test("resolving an unknown service throws", () => {
  const c = createContainer();

  assert.throws(() => c.resolve("nope"), {
    message: "Service not registered: nope",
  });
});

test("a service can depend on another", () => {
  const c = createContainer();
  c.register("logger", () => ({ log: () => {} }), "singleton");
  c.register("userService", (container) => ({
    logger: container.resolve("logger"),
  }));

  const users = c.resolve("userService");
  assert.equal(users.logger, c.resolve("logger"));
});
