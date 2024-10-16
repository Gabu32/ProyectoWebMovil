import React from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonToolbar,
  IonButtons,
  IonButton,
  IonTitle,
  IonIcon,
  IonTabBar,
  IonTabButton,
  IonLabel,
  IonList,
  IonItem,
  IonCheckbox,
  IonAccordion,
  IonAccordionGroup,
  IonFooter,
  IonBackButton,
  IonTab,
  IonTabs,
} from "@ionic/react";
import {
  arrowBack,
  add,
  home,
  folder,
  notifications,
  filter,
} from "ionicons/icons";

const ProjectPage: React.FC = () => {
  return (
    <IonPage>
      <IonTabs>
        <IonTab tab="tasks">
          <IonHeader>
            <IonToolbar>
              <IonButtons slot="start">
                <IonBackButton defaultHref="/projects" />
              </IonButtons>
              <IonTitle>Proyecto 1</IonTitle>

              <IonButtons slot="end">
                <IonButton>
                  <IonIcon icon={filter} />
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonTabBar>
            <IonTabButton tab="tasks">Tareas</IonTabButton>
            <IonTabButton tab="cronograma">Cronograma</IonTabButton>
            <IonTabButton tab="team">Equipo</IonTabButton>
          </IonTabBar>
          <IonContent>
            <IonList>
              <div className="date-item">
                <span>fecha</span>
              </div>
              {[...Array(6)].map((_, index) => (
                <IonItem key={index} button routerLink="/task">
                  <IonCheckbox slot="start" />
                  <IonLabel>Nombre tarea</IonLabel>
                  <IonIcon slot="end" src="images/person-circle.svg" />
                  <IonIcon slot="end" src="images/star-empty.svg" />
                </IonItem>
              ))}
              <div className="date-item">
                <span>fecha</span>
              </div>
            </IonList>
            <IonAccordionGroup>
              <IonAccordion>
                <IonItem slot="header" color="light">
                  <IonButton expand="full">Completadas (4)</IonButton>
                </IonItem>
                <div slot="content">
                  {[...Array(4)].map((_, index) => (
                    <IonItem key={index} button routerLink="/task">
                      <IonCheckbox checked slot="start" />
                      <IonLabel>Nombre tarea</IonLabel>
                      <IonIcon slot="end" src="images/person-circle.svg" />
                      <IonIcon slot="end" src="images/star-empty.svg" />
                    </IonItem>
                  ))}
                </div>
              </IonAccordion>
            </IonAccordionGroup>
          </IonContent>
        </IonTab>
        <IonTab tab="cronograma">
          <IonHeader>
            <IonToolbar>
              <IonButtons slot="start">
                <IonBackButton defaultHref="/projects" />
              </IonButtons>
              <IonTitle>Proyecto 1</IonTitle>

              <IonButtons slot="end">
                <IonButton>
                  <IonIcon icon={filter} />
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonTabBar>
            <IonTabButton tab="tasks">Tareas</IonTabButton>
            <IonTabButton tab="cronograma">Cronograma</IonTabButton>
            <IonTabButton tab="team">Equipo</IonTabButton>
          </IonTabBar>
          <IonContent>
            <h1>AAA</h1>
          </IonContent>
        </IonTab>
        <IonTab tab="team">
          <IonHeader>
            <IonToolbar>
              <IonButtons slot="start">
                <IonBackButton defaultHref="/projects" />
              </IonButtons>
              <IonTitle>Proyecto 1</IonTitle>

              <IonButtons slot="end">
                <IonButton>
                  <IonIcon icon={filter} />
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonTabBar>
            <IonTabButton tab="tasks">Tareas</IonTabButton>
            <IonTabButton tab="cronograma">Cronograma</IonTabButton>
            <IonTabButton tab="team">Equipo</IonTabButton>
          </IonTabBar>
          <IonContent>
            <h1>AAASDASDSAD</h1>
          </IonContent>
        </IonTab>
      </IonTabs>
    </IonPage>
  );
};

export default ProjectPage;
