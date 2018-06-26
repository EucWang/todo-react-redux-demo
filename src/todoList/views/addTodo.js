import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {addTodo} from '../actions.js';
import "./index.css";

class AddTodo extends React.Component{

    constructor(){
        super(...arguments);

        this.onSubmit = this.onSubmit.bind(this);
        // this.refInput = this.refInput.bind(this);
        this.onInputChange = this.onInputChange.bind(this);

        this.state = {
            value : ""
        }
    }

    onSubmit(event){
        console.log('onSubmit...');
        event.preventDefault();
        // const input = this.input;
        const input = this.state.value;
        if(!input.trim()){
            return;
        }

        this.props.onAdd(input);
        // input='';
        this.setState({value:""});
    }

    // refInput(node){
    //     this.input = node;
    // }

    onInputChange(event){
        this.setState(
            {
                value: event.target.value
            }
        )
    }

    render(){
        return (<div className="addTodo">
                <form onSubmit={this.onSubmit}>
                    {/* <input ref={this.refInput} /> */}
                    <input onChange={this.onInputChange} value={this.state.value} />
                    <button className="btnAdd" type="submit">ADD</button>
                </form>
            </div>)
    }
}

AddTodo.propTypes = {
    onAdd:PropTypes.func.isRequired,
};

/**
 * 传递给AddTodo控件的props属性内容
 */
const mapDispatchToProps = (dispatch)=>{
    return {
        onAdd:(text)=>{
            dispatch(addTodo(text));
        }
    }
};

export default connect(null, mapDispatchToProps)(AddTodo)