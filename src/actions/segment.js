import { FETCHSEGMENT, GETSEGMENT, CREATESEGMENT, UPDATESEGMENT, DELETESEGMENT, FILTERSEGMENT } from '../constants/segmentActionTypes';
import leadservice from '../services/leadservice';

export const fetchSegment = () => async (dispatch) => {
    try {
        const {data} = await leadservice.getSegments();
        dispatch({type: FETCHSEGMENT, payload:data});
    } catch (error) {
        console.log(error.message);
    }
}

export const getSegment = (id) => async (dispatch) => {
    try {
        const {data} = await leadservice.retriveSegment(id);
        dispatch({type: GETSEGMENT, payload:data});
    } catch (error) {
        console.log(error.message);
    }
}

export const createSegment = (post) => async (dispatch) =>{
    try {
        const {data} = await leadservice.newSegment(post);
        dispatch({type: CREATESEGMENT, payload:data});
    } catch (error) {
        console.log(error.message);
        
    }
}

export const updateSegment = (id, post) => async (dispatch) =>{
    try {
        const {data} = await leadservice.modifySegment(id, post);
        dispatch({type: UPDATESEGMENT, payload:data});      
    } catch (error) {
        console.log(error.message);
        
    }
}

export const deleteSegment = (id) => async (dispatch) =>{
    try {
        await leadservice.removeSegment(id);
        dispatch({type: DELETESEGMENT, payload:id});        
    } catch (error) {
        console.log(error.message);
        
    }
}

export const filterSegment = (filter) => async (dispatch) => {
    try {
        const {data} = await leadservice.filterSegments(filter);
        dispatch({type: FILTERSEGMENT, payload:data});
    } catch (error) {
        console.log(error.message);
    }
}
