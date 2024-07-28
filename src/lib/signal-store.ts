interface Signal<T> {
    get value(): T;
    set value(newValue: T);
    on: (callback: (value: T) => void) => void;
    off: (callback: (value: T) => void) => void;
}

interface IStore {
    state: { [id: string]: any };
    listeners: { [id: string]: ((value: any) => void)[] };
    subscribe: (id: string, callback: (value: any) => void) => void;
    unsubscribe: (id: string, callback: (value: any) => void) => void;
    notify: (id: string, value: any) => void;
}

class Store implements IStore {
    state: { [id: string]: any } = {};
    listeners: { [id: string]: ((value: any) => void)[] } = {};

    constructor() {
        this.state = new Proxy(this.state, {
            set: (target, key, value) => {
                target[key as string] = value;
                this.notify(key as string, value);
                return true;
            },
        });
    }

    subscribe(id: string, callback: (value: any) => void) {
        if (!this.listeners[id]) {
            this.listeners[id] = [];
        }
        this.listeners[id].push(callback);
    }

    unsubscribe(id: string, callback: (value: any) => void) {
        if (this.listeners[id]) {
            this.listeners[id] = this.listeners[id].filter((listener) => listener !== callback);
        }
    }

    notify(id: string, value: any) {
        if (this.listeners[id]) {
            this.listeners[id].forEach((listener) => listener(value));
        }
    }
}

const store = new Store();

export default function signal<T>(id: string, initialValue?: T): Signal<T> {
    if (!Object.prototype.hasOwnProperty.call(store.state, id)) {
        store.state[id] = initialValue;
    }

    return {
        get value() {
            return store.state[id];
        },
        set value(newValue: T) {
            store.state[id] = newValue;
        },
        on: (callback: (value: T) => void) => store.subscribe(id, callback),
        off: (callback: (value: T) => void) => store.unsubscribe(id, callback),
    };
}
