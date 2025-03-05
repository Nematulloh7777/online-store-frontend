import axios from "axios"

const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
})

apiClient.interceptors.request.use((config) => {
    config.headers.Authorization = window.localStorage.getItem('token')
    return config
})

export default apiClient