import React from 'react';
import { IonButton, IonContent, IonPage } from '@ionic/react';
import logo from './images/logo.svg';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import './Landing.css'; 
import img1 from './images/slide1.jpg'
import img2 from './images/slide2.jpg'
import img3 from './images/slide3.jpeg'
import img4 from './images/slide4.jpeg'
import img5 from './images/slide5.jpg'
import img6 from './images/slide6.jpg'
import img7 from './images/slide7.png'

import '@ionic/react/css/ionic-swiper.css';
import '/node_modules/swiper/swiper-bundle.min.css'

const Landing: React.FC = () => {
  return (
    <IonPage>
      <IonContent className="main-container">
        <div className="logo-container">
          <img src={logo} alt="logo"/>
          <div className="logo-text">ClipTask</div>
        </div>

        <div className='landing-container'>
          <div className='landing-content'>
            <div className='swiper-container'>
              <Swiper
                  loop={true} 
                  className="mySwiper"
                  modules={[Navigation, Pagination]}
                  navigation
                  pagination={true}
                  slidesPerView={1}
                  spaceBetween={30}
              >
                  <SwiperSlide>
                      <img src={img1} alt="Gestiona tus proyectos" />
                      <div className="swiper-caption">
                          <h5>Gestiona tus proyectos</h5>
                      </div>
                  </SwiperSlide>
                  <SwiperSlide>
                      <img src={img2} alt="Crea y asigna tareas" />
                      <div className="swiper-caption">
                          <h5>Crea y asigna tareas</h5>
                      </div>
                  </SwiperSlide>
                  <SwiperSlide>
                      <img src={img3} alt="Recibe notificaciones en tiempo real" />
                      <div className="swiper-caption">
                          <h5>Recibe notificaciones en tiempo real</h5>
                      </div>
                  </SwiperSlide>
                  <SwiperSlide>
                      <img src={img4} alt="Comparte con tu equipo" />
                      <div className="swiper-caption">
                          <h5>Comparte con tu equipo</h5>
                      </div>
                  </SwiperSlide>
                  <SwiperSlide>
                      <img src={img5} alt="Gestiona los permisos de tu equipo" />
                      <div className="swiper-caption">
                          <h5>Gestiona los permisos de tu equipo</h5>
                      </div>
                  </SwiperSlide>
                  <SwiperSlide>
                      <img src={img6} alt="Visualiza el progreso del proyecto" />
                      <div className="swiper-caption">
                          <h5>Visualiza el progreso del proyecto</h5>
                      </div>
                  </SwiperSlide>
                  <SwiperSlide>
                      <img src={img7} alt="Lleva un historial del progreso" />
                      <div className="swiper-caption">
                          <h5>Lleva un historial del progreso</h5>
                      </div>
                  </SwiperSlide>
              </Swiper>
            </div>
            <div className='botons-container'>
              <IonButton shape='round' expand='full' className='btn-goto-login' routerLink='/login'>INICIAR SESIÓN</IonButton>
              <IonButton shape='round' expand='full' className='btn-goto-register' routerLink='/register'>REGISTRARSE</IonButton>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Landing;
