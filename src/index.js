import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import TodoApp from './TodoApp.js';
import registerServiceWorker from './registerServiceWorker';
import store from './Store.js'
import {Provider} from 'react-redux'

ReactDOM.render((<Provider store={store}>
        <TodoApp />
    </Provider>),
    document.getElementById('root'));
registerServiceWorker();


// if(module.hot){
//     module.hot.accept();
// }