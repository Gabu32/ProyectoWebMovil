import { IonButton, IonContent, IonHeader, IonInput, IonPage} from '@ionic/react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import './Login.css';

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
      <IonHeader>Inicio de Sesión</IonHeader>
      <IonContent> 
        <form onSubmit={handleSubmit(onSubmit)}> 
          <br/>
          <IonInput type='email' {...register('email')} placeholder='Correo Electrónico' required /> 
          <br/>
          <br/>
          <IonInput type='password'  {...register('password')} placeholder='Contraseña' required /> 
          <IonButton type='submit'>Iniciar Sesión</IonButton>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default Login;
