import {createSlice} from "@reduxjs/toolkit"

const initialState = {
    id:'',
    username: '',
    email : '',
    password : '',
    name : '',
    contact : '',
}

const userSlice = createSlice({
    name:'user',
    initialState,
    reducers:{
        setId: (state,action)=>{
            state.id=action.payload;
        },
        setUsername: (state,action)=>{
            state.username=action.payload;
        },
        setEmail: (state,action)=>{
            state.email=action.payload;
        },
        setName: (state,action)=>{
            state.name=action.payload;
        },
        setPassword: (state,action)=>{
            state.password=action.payload;
        },
        setContact: (state,action)=>{
            state.contact=action.payload;
        }
    }
});

export const { setUsername , setPassword, setName , setEmail ,setContact , setId } = userSlice.actions;
export default userSlice.reducer;