import { createSlice } from '@reduxjs/toolkit';
import User from '../types/User';

type UserInfoState = {
  user: {
    info: User
  }
};

export const EMPTY_USER_INFO = {
  userId: '',
  nickname: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState: {
    info: { ...EMPTY_USER_INFO },
  },
  reducers: {
    assignUser: (state, action) => {
      state.info = action.payload;
    },
  },
});

export const { assignUser } = userSlice.actions;

export const selectUser = (state: UserInfoState): User => state.user.info;

export default userSlice.reducer;
