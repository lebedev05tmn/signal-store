export type Signal<T> = {
  get value(): T;
  set value(newValue: T);
  on: (callback: (value: T) => void) => void;
  off: (callback: (value: T) => void) => void;
};

interface IStore<U> {
  state: U;
  listeners: { [id: string]: ((value: any) => void)[] };
  subscribe: <T>(id: string, callback: (value: T) => void) => void;
  unsubscribe: <T>(id: string, callback: (value: T) => void) => void;
  notify: <T>(id: string, value: T) => void;
  signal: <K extends keyof U>(id: K) => Signal<U[K]>;
}

const createStore = <U extends Record<string, any>>(state: U): IStore<U> => {
  const listeners: { [id: string]: ((value: any) => void)[] } = {};
  const proxyState = new Proxy(state, {
    set: (target, key, value) => {
      target[key as keyof U] = value;
      notify(key as string, value);
      return true;
    },
  });

  const subscribe = <T>(id: string, callback: (value: T) => void) => {
    if (!listeners[id]) {
      listeners[id] = [];
    }
    listeners[id].push(callback);
  };

  const unsubscribe = <T>(id: string, callback: (value: T) => void) => {
    if (listeners[id]) {
      listeners[id] = listeners[id].filter((listener) => listener !== callback);
    }
  };

  const notify = <T>(id: string, value: T) => {
    if (listeners[id]) {
      listeners[id].forEach((listener) => listener(value));
    }
  };

  const signal = <K extends keyof U>(id: K): Signal<U[K]> => {
    return {
      get value(): U[K] {
        return proxyState[id];
      },
      set value(newValue: U[K]) {
        proxyState[id] = newValue;
      },
      on: (callback: (value: U[K]) => void) => {
        subscribe(id as string, callback);
      },
      off: (callback: (value: U[K]) => void) => {
        unsubscribe(id as string, callback);
      },
    };
  };

  return {
    state: proxyState,
    listeners,
    subscribe,
    unsubscribe,
    notify,
    signal,
  };
};

export default createStore;