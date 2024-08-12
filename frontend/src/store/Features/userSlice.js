import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    id: '',
    username: '',
    email: '',
    password: '',
    name: '',
    contact: '',
    profilePic: null // Add this line to include profilePic in the initial state
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setId: (state, action) => {
            state.id = action.payload;
        },
        setUsername: (state, action) => {
            state.username = action.payload;
        },
        setEmail: (state, action) => {
            state.email = action.payload;
        },
        setName: (state, action) => {
            state.name = action.payload;
        },
        setPassword: (state, action) => {
            state.password = action.payload;
        },
        setContact: (state, action) => {
            state.contact = action.payload;
        },
        setProfilePic: (state, action) => {
            state.profilePic = action.payload; // Add this line to handle profilePic
        }
    }
});

export const { setUsername, setPassword, setName, setEmail, setContact, setId, setProfilePic } = userSlice.actions;
export default userSlice.reducer;
