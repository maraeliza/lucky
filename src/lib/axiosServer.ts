import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import nookies, { parseCookies } from "nookies";
import { GetServerSidePropsContext } from "next";
import { ApiResponseError } from "@/utils/interface";

export function setupApiClient(
  ctx: GetServerSidePropsContext | undefined = undefined,
) {
  let cookies;

  if (ctx) {
    cookies = nookies.get(ctx);
  } else {
    cookies = parseCookies();
  }

  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      client_id: "admin",
      clientId: "admin",
      version: "1.0",
    },
    withCredentials: true,
  });

  if (cookies.uaifoodtoken) {
    api.defaults.headers.Authorization = `Bearer ${cookies.uaifoodtoken}`;
  }

  api.interceptors.request.use(
    (config) => {
      const cookies = nookies.get(ctx);
      if (cookies.uaifoodtoken) {
        api.defaults.headers.Authorization = `Bearer ${cookies.uaifoodtoken}`;
        config.headers.Authorization = `Bearer ${cookies.uaifoodtoken}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  api.interceptors.response.use(
    (response) => {
      return response;
    },
    async function (error: AxiosError<ApiResponseError>) {
      if (
        error.response &&
        error.response.status &&
        error.response.status === 403
      ) {
        const originalRequest = error.config as InternalAxiosRequestConfig;
        window.location.href = "/login";
      }
      return Promise.reject(error);
    },
  );

  return api;
}
