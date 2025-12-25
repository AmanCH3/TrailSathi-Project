 import axios from "../api"

export const createUserApi = (data) => axios.post("/users/create" ,data) ;
export const getUserApi = (data) => axios.get('/users/' ,{params : data}) ;

export const getOneUserApi = (id) => axios.get("/users/" + id) ;
export const updateUserApi = (id ,data) => axios.put('/users/' + id  , data) ;
export const deleteUserApi = (id, data) => axios.delete('/users/' + id ,data) ;

