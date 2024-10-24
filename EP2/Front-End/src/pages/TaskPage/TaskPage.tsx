import React from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
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
import "./TaskPage.css";
import Header from "../../components/Header";

const TaskPage: React.FC = () => {
  return (
    <IonPage className="task-page">
      <Header />

      <IonContent className="ion-padding">
        <IonCard className="task-description">
          <IonCardContent className="ion-text-center">
            <IonText color="primary">
              <h3>Descripción de la tarea</h3>
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

        {/* Personas asignadas */}
        <IonItem lines="none" className="asigned">
          <IonLabel>Persona(s) asignada(s)</IonLabel>
        </IonItem>
        <IonList className="assigned-people">
          <IonItem lines="none">
            <IonIcon icon={personCircleOutline} />
            <IonLabel>Filip</IonLabel>
          </IonItem>
          <IonItem lines="none">
            <IonIcon icon={personCircleOutline} />
            <IonLabel>Gabusolé</IonLabel>
          </IonItem>
        </IonList>

        {/* Fechas */}
        <IonList className="dates">
          <IonItem lines="none">
            <IonLabel>
              <strong>Creada:</strong> 25 ago 2025, 10:25 p.m.
            </IonLabel>
          </IonItem>
          <IonItem lines="none">
            <IonLabel>
              <strong>Fecha límite:</strong> 27 ago 2025, 10:25 p.m.
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
