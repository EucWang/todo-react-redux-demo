import React from 'react'
import './index.css'
import {connect} from 'react-redux';

class TodoItem extends React.Component{
// const TodoItem = ({onToggle, onRemove, completed, text, id})=>(
    render(){
        const {onToggleItem, onRemove, completed, text, id} = this.props;

        return (<li className="itemClass" style={{textDecoration:completed?'line-through':'none'}}>
            <input id={id} 
                    type="checkbox" 
                    checked={completed?"checked":""}
                    readOnly 
                    className="checkboxClass"
                    onClick={onToggleItem} />
            <label htmlFor={id}>{text}</label>
            <button className="itemBtnRemove" 
                    onClick={onRemove}>X</button>
        </li>)
    }

    shouldComponentUpdate(nextProps, nextState){
        return (nextProps.completed !== this.props.complted) ||
            (nextProps.text !== this.props.text);
    }
}

const mapDispatchToProps = (dispatch, ownProps)=>({
    onToggleItem: ()=>ownProps.onToggle(ownProps.id)
});

// export default TodoItem

export default connect(null, mapDispatchToProps)(TodoItem)