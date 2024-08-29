import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sessionId: "",
  channelName: "",
  duration: 0,
  users: [],
  localTracks: [],
  role: "",
  videoLoading: false,
};

const videoSessionSlice = createSlice({
  name: "videoSession",
  initialState,
  reducers: {
    setUsers(state, action) {
      state.users = action.payload;
    },
    setLocalTracks(state, action) {
      state.localTracks = action.payload;
    },
    setSessionData: (state, action) => {
      console.log("Updating session state with:", action.payload);
      return { ...state, ...action.payload };
    },
  },
});

export const {
  setSessionData,
  setUsers,
  setLocalTracks,
} = videoSessionSlice.actions;
export default videoSessionSlice.reducer;

