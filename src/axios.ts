import axios from "axios"

const apiClient = axios.create({
    baseURL: 'http://localhost:5000',
})

apiClient.interceptors.request.use((config) => {
    config.headers.Authorization = window.localStorage.getItem('token')
    return config
})

export default apiClient