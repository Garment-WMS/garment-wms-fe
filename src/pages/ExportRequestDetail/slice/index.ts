import { injectReducer } from '@/store';
import { createSlice } from '@reduxjs/toolkit';
import generateActions from './generateActions';
import { MaterialExportRequestDetail } from '@/types/exportRequest';

interface userState {
  exportRequest: MaterialExportRequestDetail | null;
}
export const initialState: userState = {
  exportRequest: null
};

export const name = 'exportRequest';

const slice = createSlice({
  name,
  initialState,
  reducers: {
    ...generateActions(initialState),
    setExportRequest: (state: any, action: { payload: any }) => {
      state.exportRequest = action.payload;
    }
  }
});

injectReducer(name, slice.reducer);

export const { actions } = slice;
