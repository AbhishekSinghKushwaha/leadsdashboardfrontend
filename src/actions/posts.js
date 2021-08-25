import {FETCHALL, CREATE, UPDATE, DELETE, FILTER} from '../constants/postsActionTypes';
import leadservice from '../services/leadservice';

export const fetchAll = () => async (dispatch) => {
    try {
        const {data} = await leadservice.getAll();
        dispatch({type: FETCHALL, payload:data});
    } catch (error) {
        console.log(error.message);
    }
}

export const getId = (id) => async (dispatch) => {
    try {
        const {data} = await leadservice.get(id);
        dispatch({type: 'getId', payload:data});
    } catch (error) {
        console.log(error.message);
    }
}

export const createPost = (post) => async (dispatch) =>{
    try {
        const {data} = await leadservice.create(post);
        dispatch({type: CREATE, payload:data});
    } catch (error) {
        console.log(error.message);
        
    }
}

export const updateUser = (id, post) => async (dispatch) =>{
    try {
        const {data} = await leadservice.update(id, post);
        dispatch({type: UPDATE, payload:data});     
    } catch (error) {
        console.log(error.message);
        
    }
}

export const deleteUser = (id) => async (dispatch) =>{
    try {
        await leadservice.remove(id);
        dispatch({type: DELETE, payload:id});        
    } catch (error) {
        console.log(error.message);
        
    }
}

export const filterData = (filter) => async (dispatch) => {
    try {
        const {data} = await leadservice.filterSearch(filter);
        dispatch({type: FILTER, payload:data});
    } catch (error) {
        console.log(error.message);
    }
}
