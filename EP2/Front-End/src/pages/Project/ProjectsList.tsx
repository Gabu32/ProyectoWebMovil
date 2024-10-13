import React, { useRef, useEffect, useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonLabel,
  IonIcon,
  IonButtons,
  IonButton,
  IonAccordionGroup,
  IonAccordion,
  IonItem,
  IonText,
} from "@ionic/react";
import { personOutline, searchOutline, addOutline } from "ionicons/icons";
import NavBar from "../../components/NavBar";
import Project from "../../components/Project";
import "./ProjectsList.css";
import axios from "axios";
import emptyfolder from "./emptyfolder.png";

const ProjectsPage: React.FC = () => {
  const accordionGroup = useRef<null | HTMLIonAccordionGroupElement>(null);
  const [proyectos, setProyectos] = useState<any[]>([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!accordionGroup.current) {
      return;
    }
    accordionGroup.current.value = ["Favoritos", "Recientes", "Todos"];
  }, []);

  useEffect(() => {
    const fetchProyectos = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/proyectos",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setProyectos(response.data);
      } catch (error) {
        console.error("Error al obtener proyectos: ", error);
      }
    };
    fetchProyectos();
  }, [token]);

  const tieneProyectos = proyectos.length > 0;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="light">
          <IonButtons slot="start">
            <IonButton>
              <IonIcon icon={personOutline} />
            </IonButton>
          </IonButtons>
          <IonTitle></IonTitle>
          <IonButtons slot="end">
            <IonButton>
              <IonIcon icon={searchOutline} />
            </IonButton>
            <IonButton>
              <IonIcon icon={addOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <h2>Proyectos</h2>
        {tieneProyectos ? (
          <IonAccordionGroup ref={accordionGroup} multiple={true}>
            <IonAccordion value="Favoritos">
              <IonItem slot="header" color="light">
                <IonLabel>Favoritos</IonLabel>
              </IonItem>
              <div slot="content">
                <br />
                <Project
                  title="Proyecto 1"
                  progress={25}
                  totalTasks={8}
                  completedTasks={2}
                  isFavorite={true}
                />
                <br />
              </div>
            </IonAccordion>

            <IonAccordion value="Recientes">
              <IonItem slot="header" color="light">
                <IonLabel>Recientes</IonLabel>
              </IonItem>
              <div slot="content">
                <br />
                <Project
                  title="Proyecto 3"
                  progress={33}
                  totalTasks={3}
                  completedTasks={1}
                  isFavorite={false}
                />
                <br />
              </div>
            </IonAccordion>

            <IonAccordion value="Todos">
              <IonItem slot="header" color="light">
                <IonLabel>Todos los proyectos</IonLabel>
              </IonItem>
              <div slot="content">
                <br />
                <Project
                  title="Proyecto 1"
                  progress={25}
                  totalTasks={8}
                  completedTasks={2}
                  isFavorite={true}
                />
                <Project
                  title="Proyecto 2"
                  progress={50}
                  totalTasks={6}
                  completedTasks={3}
                  isFavorite={false}
                />
                <Project
                  title="Proyecto 3"
                  progress={33}
                  totalTasks={3}
                  completedTasks={1}
                  isFavorite={false}
                />
                <Project
                  title="Proyecto 4"
                  progress={84}
                  totalTasks={6}
                  completedTasks={5}
                  isFavorite={false}
                />
                <br />
              </div>
            </IonAccordion>
          </IonAccordionGroup>
        ) : (
          <div className="noProjects">
            <img src={emptyfolder} alt="empty folder" className="folder" />
            <p className="bienvenida">¡Bienvenido a ClipTask!</p>
            <p className="empezar">Para empezar, crea un proyecto</p>
            <IonButton>CREA TU PRIMER PROYECTO</IonButton>
          </div>
        )}
      </IonContent>
      <NavBar />
    </IonPage>
  );
};

export default ProjectsPage;
