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
  const [showRead, setShowRead] = useState(false);
  const [reload, setReload] = useState(Boolean);
  const userID = localStorage.getItem("userID");

  useEffect(() => {
    const loadNotifications = async () => {
      if (userID) {
        const data = await fetchNotifications(parseInt(userID));
        setNotifications(data);
      }
    };
    loadNotifications();
  }, [userID, reload]);

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

  const markAsRead = async (notificationId: number) => {
    try {
      await axios.put(
        `http://localhost:5000/api/notificaciones/${notificationId}`,
        {
          isRead: true,
        }
      );
      setReload((prev) => !prev);
    } catch (error) {
      console.error("Error al marcar la notificación como leída", error);
    }
  };

  const toggleHistory = () => {
    setShowRead((prev) => !prev);
  };

  const filteredNotifications = notifications.filter(
    (notification) => showRead || !notification.leida
  );

  return (
    <IonPage>
      <Header />
      <IonContent>
        <IonLabel className="history">
          <IonButton onClick={toggleHistory}>
            <IonIcon slot="start" icon={timeOutline}></IonIcon>
            {showRead ? "Ver No Leídas" : "Ver Leídas"}
          </IonButton>
        </IonLabel>
        {filteredNotifications.length > 0 ? (
          <IonList>
            {filteredNotifications.map((notification) => (
              <Notification
                key={notification.id}
                project={notification.titulo_proyecto || "Sin Proyecto"}
                task={notification.titulo_tarea || "Sin Tarea"}
                description={notification.texto}
                time={new Date(notification.fechacreacion).toLocaleString()}
                author={notification.nombrecreador}
                leida={notification.leida}
                onClick={() => markAsRead(notification.id)}
              />
            ))}
          </IonList>
        ) : (
          <div className="noNotifications">
            <p className="aviso">No tienes notificaciones sin leer</p>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Notifications;
