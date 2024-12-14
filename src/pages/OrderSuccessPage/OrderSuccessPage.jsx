import { DeleteOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";
import Icon from "@ant-design/icons/lib/components/Icon";
import { Checkbox, Form, Radio, Space, message } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import imagePay from '../../assets/images/pay.png'
import imageMoMo from '../../assets/images/MoMo.jpg'
import imagePayment from '../../assets/images/payment.png'
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { WrapperInfo, WrapperInputNumber, WrapperLeft, WrapperProductsOrder, WrapperRight, WrapperValue } from "./style";
import { useDispatch, useSelector } from "react-redux";
import { decreaseAmount, increaseAmount, orderSelected, removeAllOrderProduct, removeOrderProduct } from "../../redux/slides/oderSlide";
import ModalComponent from "../../components/ModalComponent/ModalComponent";
import Loading from "../../components/Loading/Loading";
import InputComponent from "../../components/InputComponent/InputComponent";
import { useMutationHook } from "../../hooks/useMutationHook";
import * as UserService from "../../services/UserService"
import * as OrderService from "../../services/OrderService"
import { updateUser } from "../../redux/slides/userSlide";

const OrderSuccessPage =()=> {
     const order = useSelector((state)=> state.order)
     const user = useSelector((state)=> state.user)
     const dispatch = useDispatch()
    
     
    const navigate = useNavigate()
    const location  = useLocation()
    const [stateUserDetails, setStateUserDetails] =useState({
        name: '',
    phone: '',
    address: '',
    city: ''
    })

  const [form] = Form.useForm();
 
  

  const handleOnchangeDetails = (e) => {
    setStateUserDetails({
      ...stateUserDetails,
      [e.target.name]: e.target.value
    })
  }
  

   

    useEffect(() => {
    form.setFieldsValue(stateUserDetails)
  }, [form, stateUserDetails])


  

    
    const priceMemo = useMemo(()=>{
        const result= order?.orderItemsSelected?.reduce((total, cur)=>{
            return total + ((cur.price * cur.amount))
        },0)
        return result
    },[order])
    const priceMemoDiscount = useMemo(()=>{
        const result= order?.orderItemsSelected?.reduce((total, cur)=>{
            return total + ((cur.price * cur.amount * cur.discount)/100)
        },0)
        return result
    },[order])
    
    const priceMemoDelivery = useMemo(()=>{
       if(priceMemo> 1000000){
        return 10000
       }
       else{
        if(priceMemo === 0){
            return 0
        }
        else{

            return 20000
        }
       }
    },[order])
    const priceMemoTotal = useMemo(()=>{
      return priceMemo - priceMemoDiscount + priceMemoDelivery
    },[priceMemo,priceMemoDelivery,priceMemoDiscount])

    return ( 
        <div style={{width:"100%",height:"100vh",background: "rgb(239, 239, 239)"}}>
            <div style={{height:"100%", width:"1270px", margin:"0 auto"}}> 
            <h3 style={{margin:"0", fontSize:"15px", padding:"15px 0"}}><span style={{cursor:"pointer"}} onClick={()=> navigate("/")}>Trang chủ</span> - Đặt hàng thành công</h3>
        <div style={{display:"flex"}} >
            <WrapperLeft>
            <WrapperValue >
              <span style={{fontSize:"20px"}}>Hình thức giao hàng</span>
              <div style={{background: "rgb(240, 248, 255)",border: "1px solid rgb(194, 225, 255)",width: "500px",padding: "15px",borderRadius: "20px",margin:"10px 0"}}>
              {/* <label htmlFor=""><span style={{color:"coral", fontWeight:"500"}}>Fast</span> Giao hàng tiết kiệm</label> */}
              <label htmlFor="">{location?.state?.delivery}</label>
              </div>
            </WrapperValue>
            <WrapperValue >
              <span style={{fontSize:"20px"}}>Hình thức thanh toán</span>
              <div style={{background: "rgb(240, 248, 255)",border: "1px solid rgb(194, 225, 255)",width: "500px",padding: "15px",borderRadius: "20px",margin:"10px 0"}}>
             {/* <label htmlFor=""><img style={{width:"20px"}} src={imagePay}/> <span>Thanh toán khi nhận hàng</span></label> */}
             <label htmlFor="">{location?.state?.payment}</label>
              </div>
            </WrapperValue>

            <WrapperValue >
              <span style={{fontSize:"20px"}}>Thông tin sản phẩm</span>
              <WrapperProductsOrder>
              {location?.state?.order.map((order)=>{
                return (
           <div style={{display:"flex",width:"100%",gap:"20px", margin:"10px 0"}}>
                <span style={{width:"330px",display:"flex",alignItems:"center"}}>
                    
                    <img style={{width: "80px", height:"80px",paddingLeft:"5px"}} src={order?.image}></img>
                    <span style={{padding:"0px 5px",overflow:"hidden",textOverflow: "ellipsis"}}>{order?.name}</span>
                </span>
                <div style={{flex:"1",display:"flex", justifyContent:"space-between", alignItems:"center"}}>
            <span>Giá tiền: {(order?.price)?.toLocaleString()} vnd</span>
              <span>Số lượng: {order?.amount}</span>                       
            <span style={{color:"red"}}>Giá tổng tiền: {(order?.amount * order?.price)?.toLocaleString()} vnd</span>          
                </div>
                </div>
                )
              })}
              </WrapperProductsOrder>

              <div style={{color:"red", fontWeight:"bold"}}>
                Tổng tiền: {location?.state?.totalPriceMemo} vnd
              </div>
             
                      
            </WrapperValue>

            </WrapperLeft>
          
        </div>
            </div>
      
      
        </div>
     );
}

export default OrderSuccessPage;