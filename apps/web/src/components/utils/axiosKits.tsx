"use client";

import axios from "axios";

export const Axios = axios.create({
  baseURL: `/api/v1`,
});

export const authAxios = axios.create({
  baseURL: `/api/v1`,
  headers: {
    Accept: "application/json",
  },
});
