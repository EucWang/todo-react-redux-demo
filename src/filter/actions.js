import {SET_FILTER} from './actionTypes.js'
// import {ALL, ACTIVE, COMPLETED} from '../constants.js'

export const setFilter = (filter)=>({
    type:SET_FILTER,
    filter:filter
});