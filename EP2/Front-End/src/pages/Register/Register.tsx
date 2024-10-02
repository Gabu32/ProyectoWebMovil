import { IonButton, IonContent, IonPage, IonItem, IonLabel, IonSelect, IonSelectOption, IonInput} from '@ionic/react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import './Register.css';
import logo from './images/logo.svg';
import { useEffect, useState } from 'react';

interface Region {
  region: string;
  comunas: string[];
}

const Register: React.FC = () => {
  const { register, handleSubmit } = useForm();
  const [regions, setRegions] = useState<Region[]>([]);
  const [communes, setCommunes] = useState<string[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string>('');

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await fetch('/comunas-regiones.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Datos cargados:', data);
        setRegions(data.regiones);
      } catch (error) {
        console.error('Error al cargar regiones', error);
      }
    };

    fetchRegions();
  }, []);

  const onRegionChange = (event: CustomEvent) => {
    const regionName = event.detail.value;
    setSelectedRegion(regionName);
    const regionData = regions.find(region => region.region === regionName);
    const comunas = (regionData && regionData.comunas) || [];
    setCommunes(comunas);
  };

  const onSubmit = async (data: any) => {
    try {
      const response = await axios.post('http://localhost:5000/api/register', data);
      console.log('Registro Exitoso', response.data);
    } catch (error) {
      console.error('Registro Fallido', error);
    }
  };

  return (
    <IonPage>
      <IonContent className="container-main">
        <div className="logo-container">
          <img src={logo} alt="logo" />
          <div className="logo-text">ClipTask</div>
        </div>
        <div className="container-register">
          <div className="form-container">
            <h1 id="register">Registro de Usuario</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
              <IonLabel position="floating">Nombre</IonLabel>
              <IonItem className='formInput'>
                <IonInput {...register('nombre')} required placeholder="Nombre" />
              </IonItem>
              <IonLabel position="floating">Apellido</IonLabel>
              <IonItem className='formInput'>
                <IonInput {...register('apellido')} required placeholder="Apellido" />
              </IonItem>
              <IonLabel position="floating">Correo electrónico</IonLabel>
              <IonItem className='formInput'>
                <IonInput type="email" {...register('email')} required placeholder="Correo electrónico" />
              </IonItem>
              <IonLabel position="floating">RUT</IonLabel>
              <IonItem className='formInput'>
                <IonInput {...register('rut')} required placeholder="RUT" />
              </IonItem>
              <IonLabel position="floating">Contraseña</IonLabel>
              <IonItem className='formInput'>
                <IonInput type="password" {...register('password')} required placeholder="Contraseña" />
              </IonItem>
              <IonLabel position="floating">Confirmar Contraseña</IonLabel>
              <IonItem className='formInput'>
                <IonInput type="password" {...register('confirmPassword')} required placeholder="Confirmar Contraseña" />
              </IonItem>
              <IonLabel>Seleccionar Región</IonLabel>
              <IonItem className='formSelect'>
                <IonSelect {...register('region')} onIonChange={onRegionChange} interface='popover' placeholder="Selecciona una región">
                  {regions.length > 0 ? (
                    regions.map(region => (
                      <IonSelectOption key={region.region} value={region.region}>
                        {region.region}
                      </IonSelectOption>
                    ))
                  ) : (
                    <IonSelectOption value="">Cargando regiones...</IonSelectOption>
                  )}
                </IonSelect>
              </IonItem>
              <IonLabel>Seleccionar Comuna</IonLabel>
              <IonItem className='formSelect'>
                <IonSelect {...register('comuna')} interface='popover' placeholder="Selecciona una comuna">
                  {communes.length > 0 ? (
                    communes.map(comuna => (
                      <IonSelectOption key={comuna} value={comuna}>
                        {comuna}
                      </IonSelectOption>
                    ))
                  ) : (
                    <IonSelectOption value="">Selecciona una región primero</IonSelectOption>
                  )}
                </IonSelect>
              </IonItem>
              <div className="btn-register-container">
                <IonButton expand="full" shape='round' size='large' type='submit' id="register-button" className="btn-register">
                  REGISTRAR
                </IonButton>
              </div>
            </form>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Register;
