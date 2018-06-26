import {createStore, combineReducers} from 'redux'
import {reducer as todoReducer} from './todoList'
import {reducer as filterReducer} from './filter'

// import Perf from 'react-addons-perf' 

// const win = window;

// win.Perf = Perf

const initValues = {
    todos: [
        {
            text: 'First todo',
            completed: false,
            id:0
        }
    ],
    filter: 'all'
};

/**
 * combineReducers()函数把多个reducer函数合成一个reducers函数
 * 
 * 每一个字段名对应State(这里可以比对看initValues)状态上的字段名
 * 每个字段的值都是一个reducer函数
 * 
 * 返回值是一个新的reducer函数, 当这个新reducer被执行时,会把传入的state参数拆开处理,
 * todos字段下的状态交给todoReducer,
 * filter字段下的子状态交给filterReducer,
 * 然后把这两个调用的返回结果合并成一个新的state,作为整体reducer函数的返回结果
 * 
 * 注意: 传递给todoReducer,filterReducer的state是已经拆分了的state部分
 *   传递给todoReducer的是state.todos,
 *   传递给filterReducer的是state.filter
 */
const reducer = combineReducers({
    todos: todoReducer,
    filter: filterReducer
});

const store = createStore(reducer, initValues);

export default store;