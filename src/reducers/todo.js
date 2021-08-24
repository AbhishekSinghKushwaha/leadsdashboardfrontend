import { FETCHTODO, CREATETODO, UPDATETODO, DELETETODO, FILTERTODO } from '../constants/todoActionTypes'

const todos = (todos = [], action) => {
    switch (action.type) {
        case FETCHTODO:
            return action.payload;
        case CREATETODO:
            return [...todos, action.payload];
        case UPDATETODO:
            return todos.map((todo) => todo._id === action.payload ? action.payload : todo);
        case DELETETODO:
            return todos.filter((todo) => todo._id !== action.payload);
        case FILTERTODO:
            return action.payload;
        default:
            return todos;
    }
}

export default todos;