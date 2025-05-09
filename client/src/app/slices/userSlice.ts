import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  data: object | null
}

const initialState: UserState = {
  data: null
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login(state: UserState, action: PayloadAction<UserState>) {
      state.data = action.payload
    },
    logout(state: UserState) {
      state.data = initialState.data
    }
  }
})

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;