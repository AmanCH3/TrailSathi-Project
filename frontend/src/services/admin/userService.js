import { data } from "autoprefixer";
import { getAllTrailApi } from "../../api/admin/trailApi";
import { getUserApi , updateUserApi  , deleteUserApi , getOneUserApi } from "../../api/admin/userApi";
import { registerUserApi } from "../../api/authApi";
export const getAllUserService = async ({page, limit , search}) => {
    try {
        const response = await getUserApi({page , limit , search})
        return response.data ;

    }
    catch (err){
        throw err.response?.data || {message : "Failed to Fetch User"}
    }
}

export const createOneUserService =  async (data) => {
    try {
        const response = await registerUserApi(data) 
        return response.data
    }
    catch (err){
        throw err.response?.data || {message : "Failed to create User"}
    }
}

export const getOneUserService = async (id) => {
    try {
        const response = await getOneUserApi()
        return response.data
    }
    catch(err){
        throw err.response?.data || {message : "failed to load data"}
    }
}

export const updateOneUserSerivce  =  async (id , data) => {
    try {
        const response = await updateUserApi(id, data) ;
        return response.data
    }
    catch (err){
        throw err.response?.data || {message : "Failed to update user"}
    }
}

export const deleteOneUserService = async(id) => {
    try {

        const response = await deleteUserApi(id) 
        return response.data
    }
    catch(err){
        throw err.response?.data || {message : "Failed to delete user"}
    }
}