export default class AbstractObservable {
  #observers = new Set();

  addObserver = (observer) => {
    this.#observers.add(observer);
  }

  removeObserver = (observer) => {
    this.#observers.delete(observer);
  }

  notify(event, payload) {
    this.#observers.forEach((observer) => observer(event, payload));
  }
}
