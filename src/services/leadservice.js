import axios from "axios";

const API =  axios.create({ baseURL: "https://leadsdashboard-backend.herokuapp.com" });

API.interceptors.request.use((req) => {
  if(localStorage.getItem('profile')){
    req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`;
  }

  return req;
})

const getAll = () => API.get('/leadsdashboard');

const get = id => API.get(`/leadsdashboard/${id}`);

const create = data => API.post("/leadsdashboard", data);

const update = (id, data) => API.put(`/leadsdashboard/${id}`, data);

const remove = id => API.delete(`/leadsdashboard/${id}`);

const signIn = (formData) => API.post('/user/signin', formData);

const signUp = (formData) => API.post('/user/signup', formData);

const filterSearch = (filter) => API.post('/leadsdashboard/filter', filter);

const tagsLeads = tagName => API.get(`/leadsdashboard/tagsleads/${tagName}`);

const getTodos = () => API.get('/todo');

const getTask = id => API.get(`/todo/${id}`);

const createTodo = data => API.post("/todo", data);

const updateTodo = (id, data) => API.put(`/todo/${id}`, data);

const removeTodo = id => API.delete(`/todo/${id}`);

const filterTask = (filter) => API.post('/todo/filtertask', filter);

const getCampaigns = () => API.get('/campaign');

const retriveCampaign = id => API.get(`/campaign/${id}`);

const newCampaign = data => API.post("/campaign", data);

const modifyCampaign = (id, data) => API.put(`/campaign/${id}`, data);

const removeCampaign = id => API.delete(`/campaign/${id}`);

const filterCampaigns = (filter) => API.post('/campaign/filtercampaign', filter);

const getSegments = () => API.get('/segment');

const retriveSegment = id => API.get(`/segment/${id}`);

const newSegment = data => API.post("/segment", data);

const modifySegment = (id, data) => API.put(`/segment/${id}`, data);

const removeSegment = id => API.delete(`/segment/${id}`);

const filterSegments = (filter) => API.post('/segment/filtersegment', filter);

const getTags = () => API.get('/tag');

const retriveTag = id => API.get(`/tag/${id}`);

const newTag = data => API.post("/tag", data);

const modifyTag = (id, data) => API.put(`/tag/${id}`, data);

const removeTag = id => API.delete(`/tag/${id}`);

const filterTags = (filter) => API.post('/tag/filtertags', filter);

const getAws = () => API.get('/aws');

const retriveAws = id => API.get(`/aws/${id}`);

const newAws = data => API.post("/aws", data);

const modifyAws = (id, data) => API.put(`/aws/${id}`, data);

const removeAws = id => API.delete(`/aws/${id}`);

const getAwsUser = name => API.get(`/aws/awsuser/${name}`);

export default {
  getAll,
  get,
  create,
  update,
  remove,
  signIn,
  signUp,
  filterSearch,
  getTodos,
  getTask,
  createTodo,
  updateTodo,
  removeTodo,
  filterTask,
  getCampaigns,
  retriveCampaign,
  newCampaign,
  modifyCampaign,
  removeCampaign,
  filterCampaigns,
  getSegments,
  retriveSegment,
  newSegment,
  modifySegment,
  removeSegment,
  filterSegments,
  getTags,
  retriveTag,
  newTag,
  modifyTag,
  removeTag,
  filterTags,
  getAws,
  retriveAws,
  newAws,
  modifyAws,
  getAwsUser,
  removeAws,
  tagsLeads
};