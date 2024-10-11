import React from 'react';
import { IonContent, IonPage } from '@ionic/react';
import logo from './images/logo.svg';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Keyboard, Pagination, Scrollbar, Zoom } from 'swiper/modules';
import './Landing.css'; 

import '@ionic/react/css/ionic-swiper.css';

const Landing: React.FC = () => {
  return (
    <IonPage>
      <IonContent className="main-container">
        <div className="logo-container">
          <img src={logo} alt="logo"/>
          <div className="logo-text">ClipTask</div>
        </div>

        <div className=''>
            <Swiper modules={[Autoplay, Keyboard, Pagination, Scrollbar, Zoom]}
                autoplay={true}
                keyboard={true}
                pagination={true}
                scrollbar={true}
                zoom={true}
            >
                <SwiperSlide> Slide1 </SwiperSlide>
                <SwiperSlide> Slide2 </SwiperSlide>
                <SwiperSlide> Slide3 </SwiperSlide>
                <SwiperSlide> Slide4 </SwiperSlide>
                <SwiperSlide> Slide5 </SwiperSlide>
                <SwiperSlide> Slide6 </SwiperSlide>
                <SwiperSlide> Slide7 </SwiperSlide>

                
            </Swiper>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Landing;
