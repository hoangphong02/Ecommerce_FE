import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  search: "",
  followers: [],
};

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    searchProduct: (state, action) => {
      state.search = action.payload;
    },

    addFollowerProduct: (state, action) => {
      const { follower } = action.payload;
      const haveFollower = state?.followers?.find(
        (item) => item?.user === follower?.user
      );
      const removeFollower = state?.followers.filter(
        (item) => item?.user !== follower?.user
      );
      if (haveFollower) {
        state.followers = removeFollower;
      } else {
        state.followers.push(follower);
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const { searchProduct, addFollowerProduct } = productSlice.actions;

export default productSlice.reducer;
