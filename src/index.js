import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import {Provider} from './state/data';

let Thang = () => (<Provider>
    <App />
</Provider>)

ReactDOM.render(<Thang />, document.getElementById('root'));
registerServiceWorker();
