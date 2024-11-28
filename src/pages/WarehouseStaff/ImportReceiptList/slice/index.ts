import { injectReducer } from '@/store';
import { createSlice } from '@reduxjs/toolkit';
import generateActions from './generateActions';
import { ImportReceipt } from '@/types/ImportReceipt';

interface userState {
  importReceipt: ImportReceipt | null;
}
export const initialState: userState = {
  importReceipt: null
};

export const name = 'importReceipt';

const slice = createSlice({
  name,
  initialState,
  reducers: {
    ...generateActions(initialState),
    setImportReceipt: (state: any, action: { payload: any }) => {
      state.importReceipt = action.payload;
    }
  }
});

injectReducer(name, slice.reducer);

export const { actions } = slice;
