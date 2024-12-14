import HeaderComPonent from "../HeaderComponent/HeaderComponent";
import FooterComponent from "../FooterComponent/FooterComponent";
const DefaultComponent = ({children}) => {
    return (  
        <div>
            <HeaderComPonent/>
            {children}
            <FooterComponent/>
        </div>

    );
}

export default DefaultComponent;