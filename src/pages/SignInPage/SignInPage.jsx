import React, { useEffect } from 'react'
import { WrapperContainerLeft, WrapperContainerRight, WrapperTextLight } from './style'
import { useState } from 'react'
import InputForm from '../../components/InputForm/InputForm'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import { Image, Input } from 'antd'
import imageLogo from "../../assets/images/login.png"
import logotet from "../../assets/images/logotet.png"
import {useLocation, useNavigate } from 'react-router'
import * as UserService from '../../services/UserService'
import { useMutationHook } from '../../hooks/useMutationHook'
import Loading from '../../components/Loading/Loading'
import * as message from '../../components/Message/Message'
import jwt_decode from "jwt-decode";
import {useDispatch} from "react-redux"
import { updateUser } from '../../redux/slides/userSlide'

const SignInPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const dispatch =useDispatch();
  const handleNavigateSignUp=()=>{
    navigate('/sign-up')
  }
  const mutation = useMutationHook(
    (data) => UserService.loginUser(data)
  )
  const {data, isLoading, isSuccess} = mutation

  useEffect(()=>{
    if(isSuccess && mutation.data.status==="OK" ){
      message.success()
      if(location?.state){
        navigate(location?.state)
      }
      else{
        navigate("/") 
      }
      // if(location?.state) {
      //   navigate(location?.state)
      // }else {
      //   navigate('/')
      // }
      localStorage.setItem('access_token',JSON.stringify(data?.access_token))
      localStorage.setItem('refresh_token', JSON.stringify(data?.refresh_token))
      if(data?.access_token){
        const decoded = jwt_decode(data?.access_token);
        if(decoded?.id){
          handleGetDetailsUser(decoded?.id, data?.access_token)
        }
      }
    }
  }, [isSuccess])


  const handleGetDetailsUser = async (id, token)=>{
      // const res = await UserService.getDetailUser(id,token)
      // dispatch(updateUser({...res?.data,access_token: token}))
      const storage = localStorage.getItem('refresh_token')
    const refreshToken = JSON.parse(storage)
    const res = await UserService.getDetailUser(id, token)
    dispatch(updateUser({ ...res?.data, access_token: token,refreshToken }))
  }
  const handleOnchangeEmail = (value)=>{
    setEmail(value)
  }
  const handleOnchangePassword = (e)=>{
    const value =e.target.value
    setPassword(value)
  }
  const handleSignIn=()=>{
      mutation.mutate({
        email,
        password,
      })
  
  }
  return (
    <div style={{display:"flex", alignItems: "center",justifyContent:"center", background:"#efefef", height:"100vh"}}>
    <div style={{width:"800px", height:"445px",background:"#fff", borderRadius:"20px", display:"flex"}}>
      <WrapperContainerLeft>
        <h4 style={{margin: "0px 0px 10px",fontSize: "24px",fontWeight: "500"}}>Xin chào</h4>
        <p>
          Đăng nhập hoặc tạo tài khoản
        </p>
        <InputForm  placeholder="abc@gmail.com" style={{marginBottom: "10px"}} value={email} onChange={handleOnchangeEmail} />

        <Input.Password placeholder="Mật khẩu" style={{margin:" 10px 0",borderTop: "none", borderLeft: "none",borderRight: "none"}} value={password} onChange={handleOnchangePassword}/>
        {data?.status==="ERR" && <span style={{color:"red", fontSize:"13px", padding:"10px 0"}}>{data?.message}</span>}
        <Loading isLoading={isLoading}>    
        <ButtonComponent        
           disabled={!email.length || !password.length}
          onClick={handleSignIn}
             size={20} 
             style={{background: "rgb(255, 66, 78)", borderRadius: "4px", border: "none", height:"48px", width:"100%", fontSize:"15px",margin: "30px 0px 10px"}}
             textButton={"Đăng nhập"}
              styleTextButton={{color: "#fff"}}
        ></ButtonComponent>
        </Loading>
        <p onClick={()=>navigate(`/forget-password`)}><WrapperTextLight> Quên mật khẩu</WrapperTextLight></p>
        <p>Chưa có tài khoản? <WrapperTextLight onClick={handleNavigateSignUp}>Tạo tài khoản</WrapperTextLight></p>
      </WrapperContainerLeft>
      <WrapperContainerRight >
        <Image src={logotet} preview={false} alt='image logo' style={{width:"250px", height:"250px"}}/>
        <div style={{margin: "30px 0px 0px", textAlign: "center"}}>
          <h4 style={{margin: "0px 0px 5px",color:"rgb(255,255,255)",fontSize:" 17px",fontWeight: "500"}}>Mua sắm tại Decoration Shop</h4>
          <span style={{fontSize: "13px",color: "rgb(255,255,255)",fontWeight: "500",}}>Siêu ưu đãi mỗi ngày</span>
        </div>
      </WrapperContainerRight>
    </div>
    </div>
  )
}

export default SignInPage