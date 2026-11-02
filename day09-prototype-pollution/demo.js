import { merge } from "./merge.js";

const settings = { theme: "light" };

// simulates a JSON request body sent by an ATTACKER
const body = JSON.parse('{"theme":"dark","__proto__":{"isAdmin":true}}');

merge(settings, body);

const user = { name: "Abnet" }; // a brand-new object, unrelated to settings
console.log(settings.theme); // dark
console.log(user.isAdmin); // ???
console.log(Object.hasOwn(user, "isAdmin")); // ???
