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
  IonDatetime,
  IonText,
} from "@ionic/react";

import "./ProjectPage.css";
import Task from "../../components/Task";
import TeamMember from "../../components/TeamMember";

const ProjectPage: React.FC = () => {
  const members = [
    { name: "Nombre-Apellido 1", role: "Rol 1" },
    { name: "Nombre-Apellido 2", role: "Rol 2" },
    { name: "Nombre-Apellido 3", role: "Rol 3" },
    { name: "Nombre-Apellido 4", role: "Rol 4" },
    { name: "Nombre-Apellido 5", role: "Rol 5" },
    { name: "Nombre-Apellido 6", role: "Rol 6" },
    { name: "Nombre-Apellido 7", role: "Rol 7" },
  ];
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
            </IonToolbar>
          </IonHeader>
          <IonTabBar>
            <IonTabButton tab="tasks">Tareas</IonTabButton>
            <IonTabButton tab="cronograma">Cronograma</IonTabButton>
            <IonTabButton tab="team">Equipo</IonTabButton>
          </IonTabBar>
          <IonContent className="tasks-container">
            <div className="date-item">
              <span>fecha</span>
            </div>
            <Task name="Nombre de la tarea" isCompleted={false} />
            <Task name="Nombre de la tarea" isCompleted={false} />
            <Task name="Nombre de la tarea" isCompleted={false} />

            <div
              style={{
                height: "1px",
                backgroundColor: "#3F51B5",
                margin: "10px 0",
                marginTop: "30px",
                marginBottom: "30px",
              }}
            />
            <IonAccordionGroup>
              <IonAccordion>
                <IonItem slot="header" color="light">
                  <IonText>Completadas (4)</IonText>
                </IonItem>
                <div slot="content">
                  <Task name="Nombre de la tarea" isCompleted={true} />
                  <Task name="Nombre de la tarea" isCompleted={true} />
                  <Task name="Nombre de la tarea" isCompleted={true} />
                  <Task name="Nombre de la tarea" isCompleted={true} />
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
            </IonToolbar>
          </IonHeader>
          <IonTabBar>
            <IonTabButton tab="tasks">Tareas</IonTabButton>
            <IonTabButton tab="cronograma">Cronograma</IonTabButton>
            <IonTabButton tab="team">Equipo</IonTabButton>
          </IonTabBar>
          <IonContent>
            <div className="date-container">
              <IonDatetime presentation="date"></IonDatetime>
            </div>

            <IonAccordionGroup>
              <IonAccordion>
                <IonItem slot="header" color="light">
                  <IonText>Completadas (4)</IonText>
                </IonItem>
                <div slot="content">
                  <Task name="Nombre de la tarea" isCompleted={true} />
                  <Task name="Nombre de la tarea" isCompleted={true} />
                  <Task name="Nombre de la tarea" isCompleted={true} />
                  <Task name="Nombre de la tarea" isCompleted={true} />
                </div>
              </IonAccordion>
            </IonAccordionGroup>
          </IonContent>
        </IonTab>
        <IonTab tab="team">
          <IonHeader>
            <IonToolbar>
              <IonButtons slot="start">
                <IonBackButton defaultHref="/projects" />
              </IonButtons>
              <IonTitle>Proyecto 1</IonTitle>
              <IonButtons slot="end"></IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonTabBar>
            <IonTabButton tab="tasks">Tareas</IonTabButton>
            <IonTabButton tab="cronograma">Cronograma</IonTabButton>
            <IonTabButton tab="team">Equipo</IonTabButton>
          </IonTabBar>
          <IonContent>
            <div className="team-list">
              <h3>Integrantes (7)</h3>
              {members.map((member, index) => (
                <TeamMember key={index} name={member.name} role={member.role} />
              ))}
            </div>
          </IonContent>
        </IonTab>
      </IonTabs>
    </IonPage>
  );
};

export default ProjectPage;
