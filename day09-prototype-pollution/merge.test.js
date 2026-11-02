import { test, afterEach } from "node:test";
import assert from "node:assert/strict";
import { merge } from "./merge.js";

afterEach(() => {
  delete Object.prototype.isAdmin;
  // clean up after each test: pollution affects the WHOLE process,
  // so without this, one test's poison would leak into the others
});

test("merging untrusted JSON cannot pollute Object.prototype", () => {
  const body = JSON.parse('{"__proto__":{"isAdmin":true}}');
  merge({}, body);

  assert.equal({}.isAdmin, undefined);
  // a brand-new empty object must NOT have isAdmin
});

test("normal keys are still merged", () => {
  const result = merge({ theme: "light" }, { theme: "dark", lang: "am" });
  assert.deepEqual(result, { theme: "dark", lang: "am" });
  // the fix must not break the normal behaviour (test both sides!)
});
test("the constructor.prototype path is blocked too", () => {
  const body = JSON.parse('{"constructor":{"prototype":{"isAdmin":true}}}');
  merge({}, body);
  assert.equal({}.isAdmin, undefined);
  // obj.constructor.prototype is a second road to Object.prototype
});
