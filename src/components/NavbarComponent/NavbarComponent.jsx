import React from 'react'
import { WrapperContent, WrapperLabelText, WrapperTextPrice, WrapperTextValue } from './style'
// import { styled } from 'styled-components'
import { Checkbox, Rate} from 'antd'

const NavbarComponent = () => {
    const onChange =()=>{

    }
    const renderContent = (type, options)=>{
        switch(type){
            case 'text':
                return options.map((option)=>{
                    return (
                        <WrapperTextValue>{option}</WrapperTextValue>
                    )
                })
                case 'checkbox':
                    return (
                            <Checkbox.Group style={{ width: '100%', display: 'flex', flexDirection: 'column' }} onChange={onChange}>
                            {options.map((option) =>{
                                return(
                                  <Checkbox value={option.value}>{option.label}</Checkbox>
                                )
                            })}                            
                          </Checkbox.Group>                        
                    )
                case 'star':
                   return(
                    options.map((option) => {
                        return(
                            <Rate disabled defaultValue={option} />
                        )
                    })
                   )
                   case 'price':
                    return(
                     options.map((option) => {
                         return(
                             <WrapperTextPrice >{option}</WrapperTextPrice>
                         )
                     })
                    )
            default:
        }
    }
  return (
    <div>
        <WrapperLabelText>Label</WrapperLabelText>
        <WrapperContent>
            {renderContent('text', ['Tủ lạnh', 'máy giặt', 'TV'])}
             {/* {renderContent('checkbox', [
             {value:'a', label:'A'},
             {value:'b', label:'B'}
             ])}
            {renderContent('star', [3,4,5])}
            {renderContent('price', ['40.000','trên 50.000'])} */}
        </WrapperContent>
    </div>
  )
}

export default NavbarComponent