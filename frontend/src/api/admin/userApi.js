 import axios from "../api"

export const createUserApi = (data) => axios.post("/user/create" ,data) ;
export const getUserApi = (data) => axios.get('/user/' ,{params : data}) ;

export const getOneUserApi = (data) => axios.get("/user/" + id , data ) ;
export const updateUserApi = (id ,data) => axios.put('/user/' + id  , data) ;
export const deleteUserApi = (id, data) => axios.delete('/user/' + id ,data) ;

