export const createContainer = () => {
  const registrations = new Map();
  const instances = new Map();

  const container = {
    register(name, factory, lifetime = "transient") {
      registrations.set(name, { factory, lifetime });
    },

    resolve(name) {
      if (!registrations.has(name)) {
        throw new Error(`Service not registered: ${name}`);
      }

      const { factory, lifetime } = registrations.get(name);

      if (lifetime === "singleton" && instances.has(name)) {
        return instances.get(name);
      }

      const instance = factory(container);

      if (lifetime === "singleton") {
        instances.set(name, instance);
      }

      return instance;
    },
  };

  return container;
};
const c = createContainer();
c.register("config", () => ({ port: 3000 }), "singleton");
c.register("greeting", () => ({ text: "hello" }));

console.log(c.resolve("config") === c.resolve("config")); // true
console.log(c.resolve("greeting") === c.resolve("greeting")); // false
