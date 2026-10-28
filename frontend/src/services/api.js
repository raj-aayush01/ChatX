import axios from "axios" ;

const BASE_URL = "http://localhost:5000/api" ;

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type" : "application/json",
    },
});

api.interceptors.request.use(
    ( config ) => {
        const token = localStorage.getItem("token") ;

        if(token){
            config.headers.Authorization = `Bearer ${token}` ;
        }

        return config ;

    }, ( error ) => {
        return Promise.reject(error) ;
    }
) ;

api.interceptors.response.use(
    ( response ) => {
        return response ;
    },
    ( error ) => {
        const status = error.response?.status ;
        const url = error.config?.url || "" ;

        const isAuthEndPoint = 
            url.includes("/auth/login") ||
            url.includes("/auth/signup") ||
            url.includes("/auth/me");

        if(status === 401 && !isAuthEndPoint) {
            localStorage.removeItem("token") ;
            localStorage.removeItem("user") ;

            //Redirect to login
            if(window.location.pathname !== "/login"){
                window.location.replace("/login") ;
            }
        }

        return Promise.reject(error) ;
    }
)

export default api ;