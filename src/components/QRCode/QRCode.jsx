import React from 'react'
import QRCode from "react-qr-code";

const QRCodeComponent = ({productId}) => {
     const qrCodeData = `http://localhost:3000/product-detail/${productId}`;
  return (
     <div>
      <h2>QR Code for Product</h2>
      <QRCode value={qrCodeData} />
    </div>
  )
}

export default QRCodeComponent