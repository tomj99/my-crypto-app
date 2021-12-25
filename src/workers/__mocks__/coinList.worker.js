import coinList from "../coinList";

export default class coinListWorker {
  constructor() {
    // Note that `onmessage` should be overwritten by the code using the worker.
    onmessage = () => {};
  }

  postMessage(data) {
    onmessage({ data: coinList(data) });
  }
}
