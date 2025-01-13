import axios from "axios";


const api = axios.create({
    baseURL: 'http://localhost:3000/api/v1'
});

export const registerOnEventRequest = async (formData:any) => api.post('/events/register-event', formData);
export const registerOnOpportunityRequest = async (formData:any,id:string) => api.post(`/events/register-on-oppotunity/${id}`, formData);
export const verifiedInterviewerRequest = async (formData:any,token:string) => api.post(`/events/verify-interview/${token}`, formData);
export const getCandidateResumeRequest = async (id:string) => api.get(`/resumes/get-resume-by-id/${id}`);