import React, { useState, useEffect } from "react";
import {
  IonPage,
  IonContent,
  IonItem,
  IonLabel,
  IonTextarea,
  IonButton,
  IonIcon,
  IonList,
  IonText,
  IonCard,
  IonCardContent,
  IonAccordionGroup,
  IonAccordion,
} from "@ionic/react";
import {
  camera,
  videocam,
  attach,
  desktop,
  personCircleOutline,
} from "ionicons/icons";
import { useParams } from "react-router";
import axios from "axios";
import "./TaskPage.css";
import Header from "../../components/Header";

const TaskPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [task, setTask] = useState<any | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:5000/api/task/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTask(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error al cargar la tarea:", error);
        setError("Error al cargar los datos de la tarea");
      }
    };

    fetchTask();
  }, [id]);

  if (error) {
    return (
      <IonPage>
        <Header />
        <IonContent className="ion-padding">
          <IonText color="danger">{error}</IonText>
        </IonContent>
      </IonPage>
    );
  }

  if (!task) {
    return (
      <IonPage>
        <Header />
        <IonContent className="ion-padding">
          <IonText>Cargando tarea...</IonText>
        </IonContent>
      </IonPage>
    );
  }

  const formattedCreationDate = new Date(task.fecha_creacion).toLocaleString();
  const formattedDueDate = new Date(task.fecha_vencimiento).toLocaleString();

  return (
    <IonPage className="task-page">
      <Header />

      <IonContent className="ion-padding">
        <h2>{task.titulo}</h2>
        <IonCard className="task-description">
          <IonCardContent className="ion-text-center">
            <IonText color="primary">
              <p>{task.descripcion}</p>
            </IonText>
          </IonCardContent>
        </IonCard>

        <IonAccordionGroup>
          <IonAccordion value="adjuntos">
            <IonItem slot="header">
              <IonLabel>Adjunto</IonLabel>
            </IonItem>
            <div className="ion-padding" slot="content">
              <div className="attachments">
                <IonButton fill="clear">
                  <IonIcon icon={camera} />
                  Tomar foto
                </IonButton>
                <IonButton fill="clear">
                  <IonIcon icon={videocam} />
                  Grabar video
                </IonButton>
                <IonButton fill="clear">
                  <IonIcon icon={attach} />
                  Adjuntar archivo
                </IonButton>
                <IonButton fill="clear">
                  <IonIcon icon={desktop} />
                  Grabar pantalla
                </IonButton>
              </div>
            </div>
          </IonAccordion>
        </IonAccordionGroup>

        {/* Persona asignada */}
        <IonItem lines="none" className="asigned">
          <IonLabel>Persona asignada</IonLabel>
        </IonItem>
        <IonList className="assigned-people">
          <IonItem lines="none">
            <IonIcon icon={personCircleOutline} />
            <IonLabel>{task.usuario_id}</IonLabel>
          </IonItem>
        </IonList>

        {/* Fechas */}
        <IonList className="dates">
          <IonItem lines="none">
            <IonLabel>
              <strong>Creada:</strong> {formattedCreationDate}
            </IonLabel>
          </IonItem>
          <IonItem lines="none">
            <IonLabel>
              <strong>Fecha límite:</strong> {formattedDueDate}
            </IonLabel>
          </IonItem>
        </IonList>

        {/* Comentarios */}
        <IonList className="comments">
          <IonItem lines="none">
            <IonLabel>Comentarios</IonLabel>
          </IonItem>
          <IonTextarea
            label="Añadir comentario..."
            labelPlacement="floating"
            fill="outline"
            placeholder="Enter text"
            className="comments-textarea"
          />
          <IonButton
            expand="block"
            color="primary"
            className="comments-submit-button"
          >
            Enviar
          </IonButton>
        </IonList>
        {/* Últimos comentarios */}
        <IonItem lines="none">
          <IonLabel>Más recientes</IonLabel>
        </IonItem>
        <IonList className="recent-comments">
          <IonItem lines="none">
            <IonIcon icon={personCircleOutline} />
            <IonLabel>Filip: Comentario</IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default TaskPage;
