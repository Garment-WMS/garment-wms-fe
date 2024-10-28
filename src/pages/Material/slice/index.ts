import { injectReducer } from "@/store";
import { createSlice } from "@reduxjs/toolkit";
import { MaterialVariant } from "@/types/MaterialTypes";
import generateActions from "@/helpers/generateActions";


interface materialState {
    materialVariant: MaterialVariant | null;
}
export const initialState: materialState = {
    materialVariant: null
};

export const name = "materialVariants";

const slice = createSlice({
    name,
    initialState,
    reducers: {
        ...generateActions(initialState),
        setMaterialVariants: (state: any, action: { payload: any }) => {
            state.materialVariant = action.payload ;
        },
    },
});

injectReducer(name, slice.reducer);

export const { actions } = slice;