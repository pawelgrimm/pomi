/**
 * This file is passed to a Worker constructor
 */

const interval = 1000;
let count = 0;
let startTime;
const id = Math.random();

function start() {
  startTime = performance.now();
  setTimeout(tick, interval);
}

function tick() {
  count++;

  const currentTime = performance.now();
  const expectedInterval = count * interval;
  const delay = currentTime - startTime - expectedInterval;
  postMessage("tick");
  // console.log(id, "tick", Date.now(), delay);
  setTimeout(tick, interval - delay);
}

start();
