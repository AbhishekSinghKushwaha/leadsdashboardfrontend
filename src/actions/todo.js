import { FETCHTODO, GETTODO, CREATETODO, UPDATETODO, DELETETODO, FILTERTODO } from '../constants/todoActionTypes'
import leadservice from '../services/leadservice';

export const fetchTodos = () => async (dispatch) => {
    try {
        const {data} = await leadservice.getTodos();
        dispatch({type: FETCHTODO, payload:data});
        console.log(data);
    } catch (error) {
        console.log(error.message);
    }
}

export const getTodo = (id) => async (dispatch) => {
    try {
        const {data} = await leadservice.getTask(id);
        dispatch({type: GETTODO, payload:data});
        console.log(data);
    } catch (error) {
        console.log(error.message);
    }
}

export const createTask = (todo) => async (dispatch) =>{
    try {
        const {data} = await leadservice.createTodo(todo);
        dispatch({type: CREATETODO, payload:data});
        console.log(data);
    } catch (error) {
        console.log(error.message);
        
    }
}

export const updateTask = (id, todo) => async (dispatch) =>{
    try {
        const {data} = await leadservice.updateTodo(id, todo);
        dispatch({type: UPDATETODO, payload:data});
        console.log(data);        
    } catch (error) {
        console.log(error.message);
        
    }
}

export const deleteTask = (id) => async (dispatch) =>{
    try {
        await leadservice.removeTodo(id);
        dispatch({type: DELETETODO, payload:id});        
    } catch (error) {
        console.log(error.message);
        
    }
}

export const filterTodo = (filter) => async (dispatch) => {
    try {
        const {data} = await leadservice.filterTask(filter);
        dispatch({type: FILTERTODO, payload:data});
        console.log(data);
    } catch (error) {
        console.log(error.message);
    }
}