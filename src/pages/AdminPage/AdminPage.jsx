import React, { useState } from 'react'
import { Wrapper} from './style'
import logo from "../../assets/images/logo-decoration.png"
import { useNavigate } from 'react-router';
import { getItem } from '../../utils';
import { AppstoreOutlined, ContactsOutlined, DashboardOutlined, FileImageOutlined, ShoppingCartOutlined, UserOutlined, WalletOutlined } from '@ant-design/icons';
import AdminUser from '../../components/AdminUser/AdminUser';
import AdminProduct from '../../components/AdminProduct/AdminProduct';
import AdminOrder from '../../components/AdminOrder/AdminOrder';
import AdminContact from '../../components/AdminContact/AdminContact';
import AdminDashboard from '../../components/AdminDashboard/AdminDashboard';
import AdminSlider from '../../components/AdminSlider/AdminSlider';
import { Menu } from 'antd';
import AdminPost from '../../components/AdminPost/AdminPost';

const AdminPage = () => {
      const navigate = useNavigate()
const items = [
     getItem('DASHBOARD', 'home', <DashboardOutlined style={{fontSize:"22px"}}/>),
    getItem('NGƯỜI DÙNG', 'user', <UserOutlined style={{fontSize:"22px"}}/>),
    getItem('SẢN PHẨM', 'product', <AppstoreOutlined style={{fontSize:"22px"}}/> ),
    getItem('ĐƠN HÀNG', 'orders', <ShoppingCartOutlined style={{fontSize:"22px"}}/> ),
    getItem('LIÊN HỆ', 'contact', <ContactsOutlined style={{fontSize:"22px"}}/>  ),
    getItem('SLIDER', 'slider', <FileImageOutlined style={{fontSize:"22px"}}/>  ),
    getItem('BÀI ĐĂNG', 'post', <WalletOutlined style={{fontSize:"22px"}}/> ),

  ];
   const [keySelected, setKeySelected] = useState('')
  const renderPage = (key)=>{
    switch(key){
      case 'home':
        return (<AdminDashboard/>)
      case 'user':
        return (<AdminUser/>)
      case 'product':
          return (<AdminProduct/>)
      case 'orders':
        return (<AdminOrder/>)
      case 'contact':
        return (<AdminContact/>)
      case 'slider':
        return (<AdminSlider/>)
      case 'post':
        return (<AdminPost/>)
        default:
          return <></>
    }
  
  }

  const handleOnclick=({key})=>{
    setKeySelected(key)
  }

  return (
    <div style={{height:"100%", background:"rgb(16 13 35)"}}>

    <Wrapper id='page'>
      <nav >
        <div style={{padding:"20px"}}>
    <div style={{position:"fixed", background:"linear-gradient(195deg, rgb(66, 66, 74), rgb(25, 25, 25))", borderRadius:"20px",padding:"20px 0"}}>
   <div>
    <p style={{textAlign:"center", cursor:"pointer"}} onClick={()=> navigate("/")}><img style={{height:"70px"}} src={logo}/></p> 
   </div>
    <div>
    <Menu
    mode="inline"
    style={{
      padding:"0px 30px",
      width: 256,
      minHeight:"100vh",
      background:"none",
      color:"#fff",
      display:"flex",
      flexDirection:"column"

    }}
    items={items}
    onClick={handleOnclick}
  />
    </div>
        </div>
        </div>
      </nav>
      <main>
   <div style={{flex:"1", padding:"15px",}}>
   {renderPage(keySelected)}
  </div>
      </main>
	</Wrapper>
    </div>
 
  )
}

export default AdminPage