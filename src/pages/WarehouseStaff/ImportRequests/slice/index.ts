import { injectReducer } from "@/store";
import { ImportRequest } from "@/types/ImportRequestType";
import { createSlice } from "@reduxjs/toolkit";
import generateActions from "./generateActions";


interface userState {
    importRequest: ImportRequest | null;
}
export const initialState: userState = {
    importRequest: null
};

export const name = "importRequest";

const slice = createSlice({
    name,
    initialState,
    reducers: {
        ...generateActions(initialState),
        setImportRequest: (state: any, action: { payload: any }) => {
            state.importRequest = action.payload ;
        },
    },
});

injectReducer(name, slice.reducer);

export const { actions } = slice;