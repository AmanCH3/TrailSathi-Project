import axios from "../api" ;

export const getAllGroupApi = (params) => axios.get("/groups/", {params})

export const createOneGroupApi = (groupData) => 
    axios.post("/groups/" , groupData , {
        headers : {
            'Content-Type' : 'multipart/form-data' ,
        }
    }) ;
 

export const getOneGroupApi = (id) => axios.get("/groups/" + id)

export const updateOneGroupApi = (id , data) => {
    return axios.put("/groups/" + id , data) ;
} ;

export const deleteOneGroupApi = (id) => {
    return axios.delete("/groups/" + id)
}

export const joinOneGroupApi = (id) => {
    return axios.post('/groups/' + id + '/join')
}

export const requestToJoinGroupApi = (id, data) => {
    return axios.post(`/groups/${id}/request-join`, data);
};

export const approveJoinRequestApi = (groupId, requestId) => {
    return axios.patch(`/groups/${groupId}/requests/${requestId}/approve`);
};

export const denyJoinRequestApi = (groupId, requestId) => {
    return axios.patch(`/groups/${groupId}/requests/${requestId}/deny`);
};

export const pendingJoinRequestApi = () =>{
    return axios.get('/groups/requests/pending')
}