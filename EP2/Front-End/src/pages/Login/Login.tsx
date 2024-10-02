import { IonButton, IonContent, IonHeader, IonInput, IonPage, IonToolbar, IonTitle, IonText, IonItem, IonLabel, IonCheckbox} from '@ionic/react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import './Login.css';
import logo from './images/logo.svg';

const Login: React.FC = () => {
  const { register , handleSubmit } = useForm();

  const onSubmit = async(data: any) => {
    try { 
      const response = await axios.post('http://localhost:5000/api/login',data);
      console.log('Inicio de Sesión Exitoso', response.data);
    } catch(error){
      console.error('Inicio de Sesión Fallido', error);
    }
  }

  return (
    <IonPage>
      <IonContent className="container-main">
        <div className="logo-container">
          <img src={logo} alt="logo"/>
          <div className="logo-text">ClipTask</div>
        </div>
          <div className="container-register">
            <div className="form-container">
              <h1 id="login">Iniciar Sesión</h1>
              <IonText color="medium" className="register-link">
                ¿Es tu primera vez? <a href="register">Regístrate</a>
              </IonText>
              <br/><br/>
              <form onSubmit={handleSubmit(onSubmit)}>
                <IonLabel position="floating">Correo electrónico</IonLabel>
                <IonItem className='formInput'>
                  <IonInput type="email" {...register('email')} required placeholder="Correo electrónico" />
                </IonItem>
                <IonText id="nombre-error" className="text-danger"></IonText>
                <br/>
                <IonLabel position="floating">Contraseña</IonLabel>
                <IonItem className='formInput'>
                  <IonInput type="password" {...register('password')} required placeholder="Contraseña" />
                </IonItem>
                <IonText id="contraseña-error" className="text-danger"></IonText>

                <p className="forgot-password">
                  <a href="#">¿Olvidaste la contraseña?</a>
                </p>

                <div className="form-group rememberme">
                  <IonCheckbox id="rememberme" />
                  <IonLabel>Recuérdame</IonLabel>
                </div>

                <div className="btn-login-container">
                  <IonButton expand="full" shape='round' size='large' type='submit' id="login-button" className="btn-login">INICIAR SESIÓN</IonButton>
                </div>
              </form>
            </div>
          </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
