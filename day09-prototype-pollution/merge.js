export function merge(target, source) {
  for (const key in source) {
    if (key === "__proto__" || key === "constructor" || key === "prototype") {
      continue;
    }
    const value = source[key];

    if (typeof value === "object" && value !== null) {
      if (typeof target[key] !== "object" || target[key] === null) {
        target[key] = {};
      }

      merge(target[key], value);
    } else {
      target[key] = value;
    }
  }
  return target;
}
