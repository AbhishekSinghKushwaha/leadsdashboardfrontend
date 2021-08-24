import { FETCHSEGMENT, CREATESEGMENT, UPDATESEGMENT, DELETESEGMENT, FILTERSEGMENT } from '../constants/segmentActionTypes';

const segments = (segments = [], action) => {
    switch (action.type) {
        case FETCHSEGMENT:
            return action.payload;
        case CREATESEGMENT:
            return [...segments, action.payload];
        case UPDATESEGMENT:
            return segments.map((seg) => seg._id === action.payload ? action.payload : seg);
        case DELETESEGMENT:
            return segments.filter((seg) => seg._id !== action.payload);
        case FILTERSEGMENT:
            return action.payload;
        default:
            return segments;
    }
}

export default segments;