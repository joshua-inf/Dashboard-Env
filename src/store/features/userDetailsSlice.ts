import { UsersType } from "@/types/Customers";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: Partial<UsersType> = {
  id: "",
  business_id: "",
  created_at: "",
  customer_type: "",
  email: "",
  gender: "",
  location: "",
  name: "",
  phone: "",
  hasSubscription: false,
};

const userDetailsSlice = createSlice({
  name: "userDetails",
  initialState,
  reducers: {
    setUserDetails: (state: Partial<UsersType>, action: PayloadAction<Partial<UsersType>>) => {
      Object.assign(state, action.payload);
      state.hasSubscription = true;
    },
    clearUserDetails: (state: Partial<UsersType>) => {
      Object.assign(state, initialState);
    },
    updateUserField: <K extends keyof Partial<UsersType>>(
      state: Partial<UsersType>,
      action: PayloadAction<{ field: K; value: UsersType[K] }>
    ) => {
      state[action.payload.field] = action.payload.value;
    },
  },
});

export const { setUserDetails, clearUserDetails, updateUserField } = userDetailsSlice.actions;
export default userDetailsSlice.reducer;
