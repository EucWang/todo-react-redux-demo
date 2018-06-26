import {SET_FILTER} from './actionTypes.js'

export default (state='all', action)=>{
    console.log("reducer in filter : state: " + state + ", action : " + action.type + ", " + action.filter);
    switch(action.type){
        case SET_FILTER:
            return action.filter;
        default:
            return state;
    }
}

