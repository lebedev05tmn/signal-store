import createStore, { Signal } from './lib/signal-store';

const store = createStore({count: 0})

const root = document.getElementById('app')!;

const length = store.signal('count');
const counter =  store.signal('count')

const Text = <T,>(listener: Signal<T>) => {
    const paragraph = document.createElement('p');
    paragraph.textContent = String(listener.value);


    listener.on((value) => {
        paragraph.textContent = String(value);
    })


    return paragraph;
};

const App = () => {
    const div = document.createElement('div');
    const button = document.createElement('button');
    button.textContent = 'click';
    const paragraph = Text(length);
    div.appendChild(button);
    div.appendChild(paragraph);

    button.onclick = () => {
        counter.value++;
    };

    return div;
};

root.appendChild(App());
