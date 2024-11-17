import { createSelector } from "@reduxjs/toolkit";
import { initialState, name } from ".";
import generateSelectors from "@/helpers/generateSelectors";


const selectDomain = (state: any) => state[name] || initialState;

const MaterialVariantSelector: any = {
  ...generateSelectors(initialState, selectDomain),
  modal: {
    confirm: createSelector([selectDomain], (state) => state.modal.confirm),
  },
};

export default MaterialVariantSelector;