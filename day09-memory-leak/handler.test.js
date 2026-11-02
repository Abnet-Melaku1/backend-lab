import { test } from "node:test";
import assert from "node:assert/strict";
import { EventEmitter } from "node:events";
import { handleRequest } from "./handler.js";

test("handling requests does not leave listeners behind", () => {
  const bus = new EventEmitter(); // a fresh bus, just for this test

  for (let i = 0; i < 100; i++) {
    handleRequest(bus, i); // simulate 100 requests
  }

  assert.equal(bus.listenerCount("shutdown"), 0);
  // when all requests are done, ZERO listeners should remain.
  // each leftover listener would keep a bigData alive (the leak).
});
