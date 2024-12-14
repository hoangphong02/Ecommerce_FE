import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orderItems: [],
  orderItemsSelected: [],
  shippingAddress: {},
  paymentMethod: "",
  itemsPrice: 0, //giá sản phẩm
  shippingPrice: 0, //phí giao hàng
  taxPrice: 0, //Tiền thuế
  totalPrice: 0,
  user: "",
  isPaid: false,
  paidAt: "",
  isConfirm: false,
  isReceived: false,
  isDelivered: false,
  isEvaluate: false,
  deliveredAt: "",
};

export const orderSlide = createSlice({
  name: "order",
  initialState,
  reducers: {
    addOrderProduct: (state, action) => {
      const { orderItem } = action.payload;
      const itemOrder = state?.orderItems?.find(
        (item) => item?.product === orderItem.product
      );
      if (itemOrder) {
        itemOrder.amount += orderItem?.amount;
      } else {
        state.orderItems.push(orderItem);
      }
    },
    removeOrderProduct: (state, action) => {
      const { idProduct } = action?.payload;
      const itemOrder = state?.orderItems?.filter(
        (item) => item?.product !== idProduct
      );
      const itemOrderSelected = state?.orderItemsSelected?.filter(
        (item) => item?.product !== idProduct
      );
      state.orderItems = itemOrder;
      if (itemOrderSelected) {
        state.orderItemsSelected = itemOrderSelected;
      }
    },
    increaseAmount: (state, action) => {
      const { idProduct } = action?.payload;
      const itemOrder = state?.orderItems?.find(
        (item) => item?.product === idProduct
      );
      const itemOrderSelected = state?.orderItemsSelected?.find(
        (item) => item?.product === idProduct
      );
      itemOrder.amount++;
      if (itemOrderSelected) {
        itemOrderSelected.amount++;
      }
    },
    decreaseAmount: (state, action) => {
      const { idProduct } = action?.payload;
      const itemOrder = state?.orderItems?.find(
        (item) => item?.product === idProduct
      );
      const itemOrderSelected = state?.orderItemsSelected?.find(
        (item) => item?.product === idProduct
      );
      itemOrder.amount--;
      if (itemOrderSelected) {
        itemOrderSelected.amount--;
      }
    },
    removeAllOrderProduct: (state, action) => {
      const { listChecked } = action?.payload;
      const itemOrder = state?.orderItems?.filter(
        (item) => !listChecked.includes(item.product)
      );
      state.orderItems = itemOrder;
    },
    orderSelected: (state, action) => {
      const { listChecked } = action?.payload;
      const orderSelect = [];
      state?.orderItems.forEach((order) => {
        if (listChecked.includes(order.product)) {
          orderSelect.push(order);
        }
      });
      state.orderItemsSelected = orderSelect;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  addOrderProduct,
  removeOrderProduct,
  increaseAmount,
  decreaseAmount,
  removeAllOrderProduct,
  orderSelected,
} = orderSlide.actions;

export default orderSlide.reducer;
