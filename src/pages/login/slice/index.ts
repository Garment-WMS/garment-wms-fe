import { injectReducer } from "@/store";
import generateActions from "./generateActions";
import { createSlice } from "@reduxjs/toolkit";
import { user } from "../types";

interface userState {
    user: user | null;
}
export const initialState: userState = {
    user: null
};

export const name = "user";

const slice = createSlice({
    name,
    initialState,
    reducers: {
        ...generateActions(initialState),
        setUser: (state: any, action: { payload: any }) => {
            state.user = action.payload ;
        },
    },
});

injectReducer(name, slice.reducer);

export const { actions } = slice;