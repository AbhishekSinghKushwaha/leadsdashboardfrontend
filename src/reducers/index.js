import {combineReducers} from 'redux';
import posts from './posts';
import auth from './auth';
import todos from './todo';
import campaigns from './campaign';
import segments from './segment';
import tags from './tag';
import aws from './aws'

export default combineReducers({posts, auth, todos, campaigns, segments, tags, aws});