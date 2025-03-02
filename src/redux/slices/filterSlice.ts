import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface FiltersState {
    sort: string;
}

const initialState: FiltersState = {
  sort: 'title',
}

const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setSort: (state, action: PayloadAction<string>) => {
      state.sort = action.payload
    }
  }
})

export const {setSort} = filterSlice.actions

export default filterSlice.reducer