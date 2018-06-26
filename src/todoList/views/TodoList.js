import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import * as Actions from '../actions.js';
import {ALL, ACTIVE, COMPLETED} from '../../constants.js';

// import {bindActionCreators} from 'redux'

import TodoItem from './TodoItem.js'

const TodoList = ({todos=[], onToggleTodo, onRemoveTodo})=>
    (<ul>
        {todos.map((item)=>(
                <TodoItem
                    key={item.id}
                    text={item.text}
                    completed={item.completed}
                    id={item.id}
                    onToggle={onToggleTodo}
                    onRemove={onRemoveTodo} />
            ))
        }
    </ul>);
                    {/* onToggle={()=>onToggleTodo(item.id)}
                    onRemove={()=>onRemoveTodo(item.id)} /> */}

TodoList.propTypes = {
    todos: PropTypes.array.isRequired,
    onToggleTodo: PropTypes.func,
    onRemoveTodo: PropTypes.func
};

const selectVisibleTodos =(todos, filter='all')=>{
    // console.log("filter : " + filter + ", todos : " + todos && todos[0].text)
    switch(filter){
        case ALL:
            return todos;
        case ACTIVE:
            return todos.filter((item)=>{
                return !item.completed
            });
        case COMPLETED:
            return todos.filter((item)=>{
                return item.completed;
            });
        default:
            throw new Error('unsupported filter'); 
    }
};

const mapStateToProps = (state)=>{
    console.log();
    return {
        todos: selectVisibleTodos(state.todos, state.filter)
    }
};

// const mapDispatchToProps = (dispatch, ownProps)=>{
//     return ({
//         onToggleTodo: (id)=>dispatch(Actions.toggleTodo(id)),
//         onRemoveTodo: (id)=>dispatch(Actions.removeTodo(id))
//     })
// }

/**
 * mapDispatchToProps()中的返回结果基本上遵循同样的逻辑模式
 * 
 * 都是把接收到的参数作为参数传递给一个action构造函数
 * 然后用dispatch方法把产生的action对象派发出去
 * 
 * bindActionCreators()函数用于消除重复代码
 * 
 */
// const mapDispatchToProps = (dispatch)=>bindActionCreators({
//     onToggleTodo: Actions.toggleTodo,
//     onRemoveTodo: Actions.removeTodo
// }, dispatch);

/**
 * 直接让mapDispatchToProps是一个prop到action构造函数的映射,
 * 这样连bindActionCreators函数都不用了
 */
const mapDispatchToProps = {
    onToggleTodo: Actions.toggleTodo,
    onRemoveTodo: Actions.removeTodo
};

export default connect(mapStateToProps, mapDispatchToProps)(TodoList)

