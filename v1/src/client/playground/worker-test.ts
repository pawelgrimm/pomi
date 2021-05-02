// eslint-disable-next-line import/no-webpack-loader-syntax
import * as workerPath from "file-loader?name=[name].js!./test-worker";

const main = () => {
  const myWorker = new Worker(workerPath);
  myWorker.addEventListener("message", ({ data }) => {
    console.log("received message from worker" + data);
  });

  setTimeout(() => {
    console.log("updating worker");
    myWorker.postMessage("250");
  }, 2000);
  setTimeout(() => {
    console.log("killing worker");
    myWorker.terminate();
  }, 10000);
};

export default main;
