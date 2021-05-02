// import React, { useEffect, useMemo, useState } from "react";
// // eslint-disable-next-line import/no-webpack-loader-syntax
// import Worker from "worker-loader!./worker";
// import useComlink from "react-use-comlink";
// import TimerWorker from "./worker";
//
// //const worker = new Worker();
//
// const getWorker = async () => {
//   // @ts-ignore
//   return new workerWrapper();
// };
//
// const TimerPage = () => {
//   const [time, setTime] = useState(0);
//   const { proxy, worker } = useComlink<typeof TimerWorker>(() => new Worker());
//
//   useEffect(() => {
//     (async () => {
//       const classInstance = await new proxy();
//       classInstance.startNewTimer();
//     })();
//     worker.onmessage = ({ data }) =>
//       console.log("From component " + JSON.stringify(data));
//   }, [proxy, worker.onmessage]);
//
//   return <div>{time}</div>;
// };
//
// export default TimerPage;

export {};
