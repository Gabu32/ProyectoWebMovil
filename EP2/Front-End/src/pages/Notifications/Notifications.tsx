import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonList, IonFooter, IonButton, IonIcon, IonBadge, IonAvatar } from '@ionic/react';
import {timeOutline} from "ionicons/icons";
import './Notifications.css'; // Puedes agregar estilos aquí
import Notification from '../../components/Notification'
import NavBar from '../../components/NavBar';


const Notifications: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Notificaciones</IonTitle>
        </IonToolbar>
      </IonHeader>

     
      <IonContent>
        <IonButton className='filtro' disabled={true}>
            No leidas
        </IonButton>
        <div className="noNotifications">
            <p className="aviso"> No tienes ninguna notificacion aun! </p>
        </div>

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
