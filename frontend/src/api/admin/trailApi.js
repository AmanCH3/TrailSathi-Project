
// import axios from "../api"


const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5050/api";


// export const getAllTrailApi = (params) => {
//   return axios.get("trail/", { params });
// };

// export const createOneTrailApi = (trailData) => 
//     axios.post("/trail/create/" , trailData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       }
//     },)

// export const getOneApiTrailApi = (id) => axios.get('/trail/' + id) 


// Gallery API
export const uploadGalleryImagesApi = (trailId, formData) => {
    const token = localStorage.getItem('token');
    const url = `${API_URL}/trails/${trailId}/gallery-images`;
    console.log('Sending upload request to:', url);
    console.log('Trail ID:', trailId);
    
    return axios.post(url, formData, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    });
};

export const getGalleryImagesApi = (trailId) => {
    return axios.get(`${API_URL}/trails/${trailId}/gallery-images`);
};
// };

// export const deleteOneTrailApi = (id) => {
//    return axios.delete("/trail/" + id)
// }

// export const joinTrailApi = (id) => {
//   return axios.post('trail/' + id + '/join-trail')
// }

// export const leaveTrailApi = (id) => {
//   return axios.post('trail/' + id + "/leave-trail")
// }

import axios from "../api";

export const getAllTrailApi = (params) => {
  return axios.get("trails/", { params });
};

export const createOneTrailApi = (trailData) => 
  axios.post("/trails/", trailData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  });

export const getOneApiTrailApi = (id) => axios.get('/trails/' + id);

export const updateOneTrailApi = (id, data) => {
  return axios.patch("/trails/" + id, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  });
};

export const deleteOneTrailApi = (id) => {
  return axios.delete("/trails/" + id);
};

export const joinTrailWithDateApi = (id, data) => {
  return axios.post(`trails/${id}/join-with-date`, data);
};

export const completeTrailApi = (joinedTrailId) => {
  return axios.post(`trails/${joinedTrailId}/complete`);
};

export const cancelJoinedTrailApi = (joinedTrailId) => {
  return axios.delete(`trails/${joinedTrailId}/cancel`);
};