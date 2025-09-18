import axios from "axios";

const axiosClient= axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`
});

axiosClient.interceptors.request.use((config)=>{
    const token= localStorage.getItem("ACCESS_TOKEN");
    config.headers.Authorization= `Bearer ${token}`;
    return config;
}
);

//response interceptor to handle responses globally
axiosClient.interceptors.response.use((response)=>{
    return response;
}, (error)=>{
    try{
        const {response} = error;
        if (response.status === 401) {
        //handle unauthorized errors, e.g., redirect to login
        localStorage.removeItem("ACCESS_TOKEN");
    }
}catch(e){
        console.error(e);
   
        
    }
    throw error;
})
    


export default axiosClient;

// our api is running on localhost port 8000(laravel application)