import { FETCHAWS, GETAWS, CREATEAWS, UPDATEAWS, DELETEAWS } from '../constants/awsActionTypes';
import leadservice from '../services/leadservice';

export const fetchAws = () => async (dispatch) => {
    try {
        const {data} = await leadservice.getAws();
        dispatch({type: FETCHAWS, payload:data});
        console.log(data);
    } catch (error) {
        console.log(error.message);
    }
}

export const getAws = (id) => async (dispatch) => {
    try {
        const {data} = await leadservice.retriveAws(id);
        dispatch({type: GETAWS, payload:data});
    } catch (error) {
        console.log(error.message);
    }
}

export const createAws = (post) => async (dispatch) =>{
    try {
        const {data} = await leadservice.newAws(post);
        dispatch({type: CREATEAWS, payload:data});
    } catch (error) {
        console.log(error.message);
        
    }
}

export const updateAws = (id, post) => async (dispatch) =>{
    try {
        const {data} = await leadservice.modifyAws(id, post);
        dispatch({type: UPDATEAWS, payload:data});;        
    } catch (error) {
        console.log(error.message);
        
    }
}

export const deleteAws = (id) => async (dispatch) =>{
    try {
        await leadservice.removeAws(id);
        dispatch({type: DELETEAWS, payload:id});        
    } catch (error) {
        console.log(error.message);
        
    }
}

