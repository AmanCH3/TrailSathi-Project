import axiosInstance from './api/axios.config';
import { ENDPOINTS } from './api/endpoints';

export const eventsService = {
  getEvents: async (groupId) => {
    const { data } = await axiosInstance.get(ENDPOINTS.GROUP_EVENTS(groupId));
    return data.data;
  },

  getEventDetail: async (eventId) => {
    const { data } = await axiosInstance.get(ENDPOINTS.EVENT_DETAIL(eventId));
    return data.data.event;
  },

  rsvpEvent: async (eventId) => {
    const { data } = await axiosInstance.post(ENDPOINTS.EVENT_ATTEND(eventId));
    return data;
  },

  unrsvpEvent: async (eventId) => {
    const { data } = await axiosInstance.post(ENDPOINTS.EVENT_UNATTEND(eventId));
    return data;
  },

  confirmAttendance: async (eventId) => {
    const { data } = await axiosInstance.post(ENDPOINTS.EVENT_CONFIRM(eventId));
    return data;
  },

  unconfirmAttendance: async (eventId) => {
    const { data } = await axiosInstance.delete(ENDPOINTS.EVENT_CONFIRM(eventId));
    return data;
  },

  createEvent: async (groupId, eventData) => {
    const { data } = await axiosInstance.post(
      ENDPOINTS.CREATE_EVENT(groupId),
      eventData
    );
    return data;
  },
};
