import signal from './lib/signal-store';

const root = document.getElementById('app')!;

const counter = signal('hello', 0);

const Text = () => {
    const paragraph = document.createElement('p');
    paragraph.textContent = String(counter.value);

    counter.on((value) => {
        paragraph.textContent = String(value);

    });

    return paragraph;
};

const App = () => {
    const div = document.createElement('div');
    const button = document.createElement('button');
    button.textContent = 'click';
    const paragraph = Text();
    div.appendChild(button);
    div.appendChild(paragraph);

    button.onclick = () => {
        counter.value++;
    };

    return div;
};

root.appendChild(App());
