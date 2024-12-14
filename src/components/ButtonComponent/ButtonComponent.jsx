import { Button } from 'antd'
// import { SearchOutlined } from '@ant-design/icons'
import React from 'react'

const ButtonComponent = ({size,bordered,style,textButton,disabled,styleTextButton,...rest}) => {
  return (
    <Button 
    size={size} 
    // icon={<SearchOutlined color={colorButton} />}  
    bordered={bordered}
    disabled={disabled}
    //  style={{
    //   ...style,
    //   background: disabled ? '#ccc': style.background
    //  }
    // }
    style={style}
     {...rest}
     >
    <span style={styleTextButton}>{textButton}</span>
    </Button>

  )
}

export default ButtonComponent