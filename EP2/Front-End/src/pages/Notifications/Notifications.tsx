import {
  IonPage,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonList,
  IonButton,
  IonIcon,
  IonBadge,
  IonAvatar,
} from "@ionic/react";
import { timeOutline } from "ionicons/icons";
import "./Notifications.css";
import Notification from "../../components/Notification";
import { useState, useEffect } from "react";
import Header from "../../components/Header";
import axios from "axios";

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const userID = localStorage.getItem("userID");

  useEffect(() => {
    const loadNotifications = async () => {
      if (userID) {
        const data = await fetchNotifications(parseInt(userID));
        setNotifications(data);
      }
    };
    loadNotifications();
  }, [userID]);

  const fetchNotifications = async (userID: number) => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/notificaciones",
        {
          params: { userID },
        }
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error al obtener notificaciones:", error);
      return [];
    }
  };

  return (
    <IonPage>
      <Header />

      <IonContent>
        {Array.isArray(notifications) && notifications.length > 0 ? (
          <IonList>
            {notifications.map((notification) => (
              <Notification
                key={notification.id}
                project={notification.titulo_proyecto || "Sin Proyecto"}
                task={notification.titulo_tarea || "Sin Tarea"}
                description={notification.texto}
                time={new Date(notification.fechacreacion).toLocaleString()}
                author={notification.nombrecreador}
              />
            ))}
          </IonList>
        ) : (
          <div className="noNotifications">
            <p className="aviso">No tienes ninguna notificación aún</p>
          </div>
        )}

        <IonLabel className="history">
          <IonButton disabled={true}>
            <IonIcon slot="start" icon={timeOutline}></IonIcon>
            Historial
          </IonButton>
        </IonLabel>
      </IonContent>
    </IonPage>
  );
};

export default Notifications;
