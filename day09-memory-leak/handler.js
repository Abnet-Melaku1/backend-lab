export function handleRequest(bus, id) {
  const bigData = new Array(100_000).fill(id);

  const onShutdown = () => {
    console.log(`cleanup for request ${id}, ${bigData.length} items`);
  };

  bus.on("shutdown", onShutdown);

  bus.off("shutdown", onShutdown);
}
