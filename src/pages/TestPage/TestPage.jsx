import React, { useState, useEffect, useRef } from 'react';

const TestPage = () => {
  const [arr, setArr] = useState([]);
  const refs = useRef({}); // Đối tượng lưu các ref động
  const products = [
    { object: 'Product', id: 1, code: 'CPS', barcode: '2432142312', name: 'Cà phê sữa', categoryIds: { 1: "Cà phê" } },
    { object: 'Product', id: 2, code: 'TV', barcode: '132112312', name: 'Trà vải', categoryIds: { 2: "Trà" } },
    { object: 'Product', id: 3, code: 'TD', barcode: '12312321473463', name: 'Trà đào', categoryIds: { 2: "Trà" } },
    { object: 'Product', id: 4, code: 'THS', barcode: '123564734534', name: 'Trà hạt sen', categoryIds: { 2: "Trà" } },
    { object: 'Product', id: 7, code: 'BS', barcode: '123123141232', name: 'Bạc sỉu', categoryIds: { 1: "Cà phê" } },
    { object: 'Product', id: 8, code: 'CPDD', barcode: '234123123', name: 'Cà phê đen đá', categoryIds: { 1: "Cà phê" } },
    { object: 'Product', id: 9, code: 'CBST', barcode: '1235546734523', name: 'Cold Brew Sữa Tươi', categoryIds: { 1: "Cà phê" } },
    { object: 'Product', id: 10, code: 'TDCX', barcode: '423442', name: 'Trà đào cam sả', categoryIds: { 2: "Trà" } },
    { object: 'Product', id: 10, code: 'TDCX', barcode: '423442', name: 'Trà đào cam sả', categoryIds: { 3: "Trà sữa" } }

  ];

  useEffect(() => {
    const newArr = [];

    products.forEach((item) => {
      const cate = item.categoryIds;
      const isExist = newArr.some(obj => JSON.stringify(obj) === JSON.stringify(cate));
      if (!isExist) {
        newArr.push(cate);
      }
    });

    setArr(newArr);

    // Khởi tạo các ref động cho từng danh mục
    newArr.forEach((cate) => {
      const key = Object.keys(cate)[0]; // Lấy khóa của đối tượng categoryIds
      if (!refs.current[key]) {
        refs.current[key] = React.createRef(); // Tạo ref mới và gán vào đối tượng refs nếu chưa có
      }
    });
  }, [products.length]);

  const scrollToCategory = (key) => {
    if (refs.current[key]) {
      refs.current[key].current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div>
      {arr.map((item, index) => {
        const key = Object.keys(item)[0];
        return (
          <button key={index} onClick={() => scrollToCategory(key)}>
            {item[key]}
          </button>
        );
      })}

  <div style={{marginTop: '1000px'}}>

      {arr.map((item, index) => {
        const key = Object.keys(item)[0];
        return (
          <div key={index} ref={refs.current[key]} style={{display:"flex", flexDirection:'column', marginTop:'1000px'}} >
            <h3>Danh mục: {item[key]}</h3>
            {products.filter(pro => JSON.stringify(pro.categoryIds) === JSON.stringify(item)).map(product => (
              <div key={product.id}>
                <span>{product.name}</span>
              </div>
            ))}
          </div>
        );
      })}
  </div>
    </div>
  );
};

export default TestPage;
