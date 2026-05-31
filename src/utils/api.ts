import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";


// ==========================================
// BASE URL
// ==========================================
const BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";


// ==========================================
// AXIOS INSTANCE
// ==========================================
const api = axios.create({

  baseURL: BASE_URL,

  withCredentials: true,

  timeout: 20000,

  headers: {

    "Content-Type":
      "application/json",

  },

});


// ==========================================
// PUBLIC ROUTES
// ==========================================
const publicRoutes = [

  "/login",

  "/register",

  "/forgot-password",

  "/verify-otp",

  "/reset-password",

];


// ==========================================
// CLEAR AUTH DATA
// ==========================================
const clearAuthData = () => {

  localStorage.removeItem(
    "token"
  );

  localStorage.removeItem(
    "userInfo"
  );

  delete api.defaults.headers.common[
    "Authorization"
  ];

};


// ==========================================
// REQUEST INTERCEPTOR
// ==========================================
api.interceptors.request.use(

  (
    config: InternalAxiosRequestConfig
  ) => {

    try {

      // ====================================
      // GET TOKEN
      // ====================================
      const token =
        localStorage.getItem(
          "token"
        );


      // ====================================
      // ATTACH TOKEN
      // ====================================
      if (

        token &&

        config.headers

      ) {

        config.headers.Authorization =
          `Bearer ${token}`;

      }

    }

    catch (error) {

      console.log(

        "REQUEST INTERCEPTOR ERROR:",

        error

      );

    }

    return config;

  },

  (error) => {

    return Promise.reject(
      error
    );

  }

);


// ==========================================
// RESPONSE INTERCEPTOR
// ==========================================
api.interceptors.response.use(

  (response) => response,

  async (
    error: AxiosError<any>
  ) => {

    // ====================================
    // NETWORK ERROR
    // ====================================
    if (!error.response) {

      console.log(
        "NETWORK ERROR"
      );

      return Promise.reject({

        success: false,

        message:
          "Server unreachable",

      });

    }


    // ====================================
    // STATUS CODE
    // ====================================
    const status =
      error.response.status;


    // ====================================
    // 401 UNAUTHORIZED
    // ====================================
    if (status === 401) {

      console.log(

        "TOKEN EXPIRED OR INVALID"

      );


      // ==================================
      // CLEAR AUTH
      // ==================================
      clearAuthData();


      // ==================================
      // REDIRECT
      // ==================================
      const currentPath =
        window.location.pathname;


      if (

        !publicRoutes.includes(
          currentPath
        )

      ) {

        window.location.href =
          "/login";

      }

    }


    // ====================================
    // 403 FORBIDDEN
    // ====================================
    if (status === 403) {

      console.log(
        "ACCESS DENIED"
      );

    }


    // ====================================
    // 404 NOT FOUND
    // ====================================
    if (status === 404) {

      console.log(
        "RESOURCE NOT FOUND"
      );

    }


    // ====================================
    // 500 SERVER ERROR
    // ====================================
    if (status >= 500) {

      console.log(
        "SERVER ERROR"
      );

    }


    return Promise.reject(
      error
    );

  }

);


// ==========================================
// API GET
// ==========================================
export const apiGet =
  async (
    url: string
  ) => {

    const response =
      await api.get(url);

    return response.data;

  };


// ==========================================
// API POST
// ==========================================
export const apiPost =
  async (

    url: string,

    data?: any

  ) => {

    const response =
      await api.post(
        url,
        data
      );

    return response.data;

  };


// ==========================================
// API PUT
// ==========================================
export const apiPut =
  async (

    url: string,

    data?: any

  ) => {

    const response =
      await api.put(
        url,
        data
      );

    return response.data;

  };


// ==========================================
// API PATCH
// ==========================================
export const apiPatch =
  async (

    url: string,

    data?: any

  ) => {

    const response =
      await api.patch(
        url,
        data
      );

    return response.data;

  };


// ==========================================
// API DELETE
// ==========================================
export const apiDelete =
  async (
    url: string
  ) => {

    const response =
      await api.delete(url);

    return response.data;

  };


// ==========================================
// EXPORT
// ==========================================
export default api;