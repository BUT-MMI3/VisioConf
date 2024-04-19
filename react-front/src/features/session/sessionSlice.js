// src/features/session/sessionSlice.js
import {createSlice} from '@reduxjs/toolkit';

export const sessionSlice = createSlice({
    name: 'session',
    initialState: {
        user_uuid: "",
        user_firstname: "",
        user_lastname: "",
        user_email: "",
        user_phone: "",
        user_status: "",
        user_job: "",
        user_desc: "",
        user_date_create: "",
        user_picture: "./user-icons/user-base-icon.svg",
        user_is_online: false,
        user_disturb_status: "offline",
        user_last_connection: "",
        user_direct_manager: "",
        user_roles: [],
        user_session_token: "",
        user_socket_id: "",
        isSignedIn: false,
    },
    reducers: {
        signIn: (state, action) => {
            state.user_uuid = action.payload.user_info.user_uuid;
            state.user_firstname = action.payload.user_info.user_firstname;
            state.user_lastname = action.payload.user_info.user_lastname;
            state.user_email = action.payload.user_info.user_email;
            state.user_phone = action.payload.user_info.user_phone;
            state.user_status = action.payload.user_info.user_status;
            state.user_job = action.payload.user_info.user_job;
            state.user_desc = action.payload.user_info.user_desc;
            state.user_date_create = action.payload.user_info.user_date_create;
            state.user_picture = action.payload.user_info.user_picture;
            state.user_is_online = true;
            state.user_disturb_status = action.payload.user_info.user_disturb_status;
            state.user_last_connection = action.payload.user_info.user_last_connection;
            state.user_direct_manager = action.payload.user_info.user_direct_manager;
            state.user_roles = action.payload.user_info.user_roles;
            state.user_session_token = action.payload.session_token;
            state.user_socket_id = action.payload.user_info.user_socket_id;
            state.isSignedIn = true;
        },
        signOut: (state) => {
            state.user_uuid = "";
            state.user_firstname = "";
            state.user_lastname = "";
            state.user_email = "";
            state.user_phone = "";
            state.user_status = "";
            state.user_job = "";
            state.user_date_create = "";
            state.user_picture = "./user-icons/user-base-icon.svg";
            state.user_is_online = false;
            state.user_disturb_status = "offline";
            state.user_last_connection = "";
            state.user_direct_manager = "";
            state.user_roles = [];
            state.user_session_token = "";
            state.user_socket_id = "";
            state.isSignedIn = false;
        },
    },
});

export const {signIn, signOut} = sessionSlice.actions;

export default sessionSlice.reducer;
