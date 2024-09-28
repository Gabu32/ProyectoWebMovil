import { IonButton, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import './SignUp.css';

const SignUp: React.FC = () => {
  const { register , handleSubmit } = useForm();

  const onSubmit = async(data: any) => {
    try { 
      const response = await axios.post('http://localhost:5000/api/register',data);
      console.log('Registro Exitoso', response.data);
    } catch(error){
      console.error('Registro Fallido', error);
    }
  }

  return (
    <IonPage> 
      <IonHeader>Registro</IonHeader>
      <IonContent> 
        <form onSubmit={handleSubmit(onSubmit)}> 
          <br/>
          <IonInput type='email' {...register('email')} placeholder='Correo Electrónico' required /> 
          <br/>
          <br/>
          <IonInput type='password' {...register('password')} placeholder='Contraseña' required /> 
          <IonButton type='submit'>Registrarse</IonButton>

        </form>
      </IonContent>
    </IonPage>
  );
};

export default SignUp;
