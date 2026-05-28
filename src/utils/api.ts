import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";


// ==========================================
// BASE URL
// ==========================================
const BASE_URL =
  "http://localhost:5000";


// ==========================================
// AXIOS INSTANCE
// ==========================================
const api = axios.create({

  baseURL: BASE_URL,

  withCredentials: true,

  timeout: 10000,

  headers: {

    "Content-Type":
      "application/json",

  },

});


// ==========================================
// REQUEST INTERCEPTOR
// ==========================================
api.interceptors.request.use(

  (
    config: InternalAxiosRequestConfig
  ) => {

    try {

      // ======================================
      // GET USER INFO
      // ======================================
      const userInfo =
        JSON.parse(

          localStorage.getItem(
            "userInfo"
          ) || "{}"

        );


      // ======================================
      // GET TOKEN
      // ======================================
      const token =
        userInfo?.token;


      // ======================================
      // ADD AUTHORIZATION HEADER
      // ======================================
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

    // ======================================
    // NETWORK ERROR
    // ======================================
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


    // ======================================
    // UNAUTHORIZED
    // ======================================
    if (

      error.response.status === 401

    ) {

      console.log(
        "TOKEN EXPIRED OR INVALID"
      );


      // ====================================
      // CLEAR STORAGE
      // ====================================
      localStorage.removeItem(
        "userInfo"
      );


      // ====================================
      // REMOVE AUTH HEADER
      // ====================================
      delete api.defaults.headers.common[
        "Authorization"
      ];


      // ====================================
      // REDIRECT LOGIN
      // ====================================
      if (

        window.location.pathname !==
        "/login"

      ) {

        window.location.href =
          "/login";

      }

    }


    // ======================================
    // FORBIDDEN
    // ======================================
    if (

      error.response.status === 403

    ) {

      console.log(
        "ACCESS DENIED"
      );

    }


    // ======================================
    // NOT FOUND
    // ======================================
    if (

      error.response.status === 404

    ) {

      console.log(
        "RESOURCE NOT FOUND"
      );

    }


    // ======================================
    // SERVER ERROR
    // ======================================
    if (

      error.response.status >= 500

    ) {

      console.log(
        "INTERNAL SERVER ERROR"
      );

    }


    return Promise.reject(
      error
    );

  }

);


// ==========================================
// API METHODS
// ==========================================
export const apiGet = async (
  url: string
) => {

  const response =
    await api.get(url);

  return response.data;

};


export const apiPost = async (
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


export const apiPut = async (
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


export const apiDelete = async (
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