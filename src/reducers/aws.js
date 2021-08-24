import { FETCHAWS, CREATEAWS, UPDATEAWS, DELETEAWS } from '../constants/awsActionTypes';

const aws = (aws = [], action) => {
    switch (action.type) {
        case FETCHAWS:
            return action.payload;
        case CREATEAWS:
            return [...aws, action.payload];
        case UPDATEAWS:
            return aws.map((awsses) => awsses._id === action.payload ? action.payload : awsses);
        case DELETEAWS:
            return aws.filter((awsses) => awsses._id !== action.payload);
        default:
            return aws;
    }
}

export default aws;