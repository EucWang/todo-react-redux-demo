import React from 'react';
import {connect} from 'react-redux';
import * as Actions from '../actions.js';
import "./index.css";

const Link = ({active, children, onClick})=>{
    console.log("active : " + active + ", children : " + children);
    if(active){
        return (  <div className="linkContainer"><b className="linkClass">{children}</b></div>);
    }else{
        return (
            <div className="linkContainer">
            <a href="#"
                className="linkClass"
                onClick={(event)=>{
                    event.preventDefault();
                    onClick(children);
                }}>{children}</a>
            </div>
        )
    }
};

const mapStateToProps = (state, ownProps)=>{
    console.log("Link-> mapStateToProps-> state.filter : " + state.filter);
    return {
        active: (state.filter === ownProps.children)
    }
};

const mapDispathToProps = (dispatch, ownProps)=>({
    onClick : ()=> dispatch(Actions.setFilter(ownProps.children))
});

export default connect(mapStateToProps, mapDispathToProps)(Link);
