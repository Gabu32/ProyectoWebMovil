import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonList, IonFooter, IonButton, IonIcon, IonBadge, IonAvatar } from '@ionic/react';
import { timeOutline } from "ionicons/icons";
import './Notifications.css'; // Puedes agregar estilos aquí
import Notification from '../../components/Notification';
import NavBar from '../../components/NavBar';
import { useState } from 'react';

const Notifications: React.FC = () => {
  const [showNotifications, setShowNotifications] = useState(false); // Estado para controlar la visibilidad

  const handleToggleNotifications = () => {
    setShowNotifications(prevState => !prevState); // Alternar el estado entre true y false
  };


  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Notificaciones</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonButton className='filtro' onClick={handleToggleNotifications}>
          Mostrar Notificaciones
        </IonButton>

        {!showNotifications && (
          <div className="noNotifications">
            <p className="aviso">No tienes ninguna notificación aún!</p>
          </div>
        )}

        {showNotifications && (
          <IonList>
            {/* Aquí renderizas tus notificaciones */}
            <Notification
              project="Proyecto 3"
              task="Tarea 3"
              description="Descripción de la tarea 3"
              time="12:00"
              author="Ricardo Pasten"
            />
            <Notification
              project="Proyecto 3"
              task="Tarea 1"
              description="Descripción de la tarea 1"
              time="14:00"
              author="Gabusa"
            />
          </IonList>
        )}

        <IonLabel className="history">
          <IonButton disabled={true}>
            <IonIcon slot="start" icon={timeOutline}></IonIcon>
            Historial
          </IonButton>
        </IonLabel>
      </IonContent>

      <NavBar />
    </IonPage>
  );
};

export default Notifications;
