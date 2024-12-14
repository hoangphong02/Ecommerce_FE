/* eslint-disable jsx-a11y/iframe-has-title */
import React from "react";
import image1 from "../../assets/images/img_1.jpg";
import image2 from "../../assets/images/img_2.jpg";
import image3 from "../../assets/images/img_3.jpg";
import image4 from "../../assets/images/img_4.jpg";
import ScrollToTop from "../ScrollToTop/ScrollToTop";

const FooterComponent = () => {
  return (
    <footer className="footer-32892 pb-0" style={{}}>
      <div className="site-section">
        <div className="container" style={{ height: "70vh" }}>
          <div className="row">
            <div className="col-md pr-md-5 mb-4 mb-md-0">
              <h3>About Us</h3>
              <p className="mb-4">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Laboriosam itaque unde facere repellendus, odio et iste
                voluptatum aspernatur ratione mollitia tempora eligendi maxime
                est, blanditiis accusamus. Incidunt, aut, quis!
              </p>
              <ul className="list-unstyled quick-info mb-4">
                <li>
                  <a href="#phone" className="d-flex align-items-center">
                    <span className="icon mr-3 icon-phone"></span> +84 763 839
                    456
                  </a>
                </li>
                <li>
                  <a href="#mail" className="d-flex align-items-center">
                    <span className="icon mr-3 icon-envelope"></span>{" "}
                    hoangphongvl2002@gmail.com
                  </a>
                </li>
                <li>
                  <a href="#address" className="d-flex align-items-center">
                    <span className="icon mr-3 icon-envelope"></span> Khu II, Đ.
                    3 Tháng 2, Xuân Khánh, Ninh Kiều, Cần Thơ{" "}
                  </a>
                </li>
              </ul>

              <form action="#" className="subscribe">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your e-mail"
                />
                <input type="submit" className="btn btn-submit" value="Send" />
              </form>
            </div>
            <div className="col-md mb-4 mb-md-0">
              <h3>Map</h3>
              <ul className="list-unstyled tweets">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3928.8415184420583!2d105.76804037479394!3d10.029933690077012!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31a0895a51d60719%3A0x9d76b0035f6d53d0!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBD4bqnbiBUaMah!5e0!3m2!1svi!2s!4v1712733761743!5m2!1svi!2s"
                  style={{ width: "80%", height: "19em", border: "0" }}
                  allowfullscreen=""
                  loading="lazy"
                  referrerpolicy="no-referrer-when-downgrade"
                />
              </ul>
            </div>

            <div className="col-md-3 mb-4 mb-md-0">
              <h3>Instagram</h3>
              <div className="row gallery">
                <div className="col-6">
                  <div>
                    <img src={image1} alt="img" className="img-fluid" />
                  </div>
                  <div>
                    <img src={image2} alt="img" className="img-fluid" />
                  </div>
                </div>
                <div className="col-6">
                  <div>
                    <img src={image3} alt="img" className="img-fluid" />
                  </div>
                  <div>
                    <img src={image4} alt="img" className="img-fluid" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ScrollToTop />
    </footer>
  );
};

export default FooterComponent;
