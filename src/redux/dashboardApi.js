import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../urls/api";

const user = JSON.parse(localStorage.getItem("userData")) || [];

export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      // Get the user data from localStorage each time a request is made
      const userData = JSON.parse(localStorage.getItem("loginUserData")) || {};
      const accessToken = userData?.accessToken;

      // If the accessToken exists, set the Authorization header
      if (accessToken) {
        // console.log(accessToken);
        headers.set("Authorization", `${accessToken}`);
      }

      return headers;
    },
  }),
  tagTypes: [
    "getAllCoach",
    "getAllByCategory",
    "getAllByArea",
    "getSession",
    "getCoachById",
    "getSectionByCoach",
    "getDuration",
    "getSessionByCoachee",
    "getAllCategories",
    "getUserInterest",
    "getUserByRole",
    "changePassword",
  ],

  endpoints: (builder) => ({
    // dashboard page api's
    // coach apis
    getAllCoach: builder.query({
      query: ({ page = 1, sortColumn = "created_at_desc", search = "" }) =>
        `users/getAllByRole?role=coach&page=${page}&pageSize=${12}&sort=${sortColumn}&searchTerm=${search}`,
      providesTags: ["getAllCoach"],
    }),
    getAllByCategory: builder.query({
      query: ({
        type = "all",
        pageSize = 12,
        sort,
        currentPage,
        role = "coach",
      }) => {
        return `users/getByCoachArea?coachingAreaId=${type}&role=${role}&pageSize=${pageSize}&sort=${sort}&page=${currentPage}`;
      },
      providesTags: ["getAllByCategory"],
    }),
    getAllCategories: builder.query({
      query: ({ pageSize = 12, sort, currentPage, role = "coach" }) =>
        `users/getAllCategories?role=coach?role=${role}`,
      providesTags: ["getAllCategories"],
    }),
    getAllByArea: builder.query({
      query: () => `coach-area/get-all`,
      providesTags: ["getAllByArea"],
    }),
    getSession: builder.query({
      query: ({ session }) => `session/get/${session}`,
      providesTags: ["getSession"],
    }),
    getCoachById: builder.query({
      query: ({ id, role = "coach" }) =>
        `users/getOneByRole/${id}?role=${role}`,
      providesTags: ["getCoachById"],
    }),
    getSectionByCoach: builder.query({
      query: ({ id }) => `section/get-by-coach/${id}`,
      providesTags: ["getSectionByCoach"],
    }),
    getDuration: builder.query({
      query: ({ id }) => `duration/get/${id}`,
      providesTags: ["getDuration"],
    }),
    getSessionByCoachee: builder.query({
      query: ({
        selectedType = "",
        sort = "created_at_desc",
        page = 1,
        pageSize = 20,
      }) =>
        `session/get-by-coachee?status=${selectedType}&pageSize=${pageSize}&sort=${sort}&page=${page}`,
      providesTags: ["getSessionByCoachee"],
    }),

    // get user intersets
    getUserInterest: builder.query({
      query: ({ userId }) => `users/getUserInterest/${userId}`,
      providesTags: ["getUserInterest"],
    }),
    getUserByRole: builder.query({
      query: ({ user_id, role }) =>
        `users/getOneByRole/${user_id}?role=${role}`,
      providesTags: ["getUserByRole"],
    }),
    // change password
    changePassword: builder.mutation({
      query: (body) => {
        return {
          url: "auth/changePassword",
          method: "PATCH",
          body,
        };
      },
      invalidatesTags: ["changePassword"],
    }),
    getPolices: builder.query({
      query: (type) => `polices/get/${type}`,
      providesTags: ["getPolices"],
    }),
  }),
});

export const {
  useGetAllCoachQuery,
  useGetAllByCategoryQuery,
  useGetAllCategoriesQuery,
  useGetAllByAreaQuery,
  useGetSessionQuery,
  useGetCoachByIdQuery,
  useGetSectionByCoachQuery,
  useGetDurationQuery,
  useGetSessionByCoacheeQuery,
  useGetUserInterestQuery,
  useGetUserByRoleQuery,
  useChangePasswordMutation,
  useGetPolicesQuery,
} = dashboardApi;
