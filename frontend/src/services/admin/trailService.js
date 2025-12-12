import { 
  getAllTrailApi, 
  getOneApiTrailApi, 
  createOneTrailApi, 
  deleteOneTrailApi, 
  updateOneTrailApi,
  joinTrailWithDateApi,
  completeTrailApi,
  cancelJoinedTrailApi // ✅ 1. IMPORT THE NEW API FUNCTION
} from "../../api/admin/trailApi";

export const getAllTrailService = async (params) => {
  try {
    const response = await getAllTrailApi(params); 
    return response.data;
  } catch(err) {
    throw err.response?.data || { message: "Failed to fetch Trail" };
  }
};

export const createOneTrailService = async (data) => {
  try {
    const response = await createOneTrailApi(data);
    return response.data;
  } catch(err) {
    throw err.response?.data || { message: "Failed to create" };
  }
};

export const getOneTrailService = async (id) => {
  try {
    const response = await getOneApiTrailApi(id);
    return response.data;
  } catch(err) {
    throw err.response?.data || { message: "Failed to load" };
  }
};

export const updateOneTrailService = async (id, data) => {
  try {
    const response = await updateOneTrailApi(id, data);
    return response.data;
  } catch(err) {
    throw err.response?.data || { message: "Failed to update" };
  }
};

export const deleteOneTrailService = async (id) => {
  try {
    const response = await deleteOneTrailApi(id);
    return response.data;
  } catch(err) {
    throw err.response?.data || { message: "Failed to delete" };
  }
};

export const joinTrailWithDateService = async (id, data) => {
  try {
    const response = await joinTrailWithDateApi(id, data);
    return response.data;
  } catch (err) {
    throw err.response?.data || { message: "Failed to schedule hike" };
  }
};

export const completeTrailService = async (joinedTrailId) => {
  try {
    const response = await completeTrailApi(joinedTrailId);
    return response.data;
  } catch (err) {
    throw err.response?.data || { message: "Failed to mark trail as complete" };
  }
};

// ✅ 2. EXPORT THE NEW SERVICE FUNCTION
export const cancelJoinedTrailService = async (joinedTrailId) => {
  try {
    const response = await cancelJoinedTrailApi(joinedTrailId);
    return response.data;
  } catch (err) {
    throw err.response?.data || { message: "Failed to cancel hike" };
  }
};