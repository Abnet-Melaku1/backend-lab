import { EventEmitter } from "node:events";
const bus = new EventEmitter();

function handleRequest(id) {
  const bigData = new Array(100_000).fill(id);

  bus.on("shutdown", () => {
    console.log(`cleanup for request ${id}, ${bigData.length} items`);
  });
}

setInterval(() => {
  for (let i = 0; i < 10; i++) handleRequest(i);

  const heapMb = Math.round(process.memoryUsage().heapUsed / 1024 / 1024);
  console.log(
    `listeners: ${bus.listenerCount("shutdown")}, heap:  ${heapMb} MB`,
  );
}, 1000);
