import React, { useRef, useEffect, useState } from "react";
import {
  IonPage,
  IonContent,
  IonLabel,
  IonButton,
  IonAccordionGroup,
  IonAccordion,
  IonItem,
  IonToast,
} from "@ionic/react";
import Project from "../../components/Project";
import "./ProjectsList.css";
import axios from "axios";
import emptyfolder from "./emptyfolder.png";
import { useHistory } from "react-router-dom";
import Header from "../../components/Header";

const ProjectsList: React.FC = () => {
  const accordionGroup = useRef<null | HTMLIonAccordionGroupElement>(null);
  const [proyectos, setProyectos] = useState<any[]>([]);
  const [showToast, setShowToast] = useState(false);
  const token = localStorage.getItem("token");
  const history = useHistory();

  const proyectosDummy = [
    { titulo: "Proyecto 1", isFavorite: true },
    { titulo: "Proyecto 2", isFavorite: false },
    { titulo: "Proyecto 3", isFavorite: true },
    { titulo: "Proyecto 4", isFavorite: false },
    { titulo: "Proyecto 5", isFavorite: true },
  ];

  useEffect(() => {
    setProyectos(proyectosDummy);
  }, []);

  const [proyectosCargados, setProyectosCargados] = useState(false);
  const proyectosFavoritos = proyectos.filter((p) => p.isFavorite);
  const tieneFavoritos = proyectosFavoritos.length > 0;
  const tieneProyectos = proyectos.length > 0;

  const fetchProyectos = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/proyectos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProyectos(response.data);
      setProyectosCargados(true);
    } catch (error: any) {
      console.error("Error al obtener proyectos: ", error);
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("token");
        setShowToast(true);
        history.push("/landing");
      }
    }
  };

  useEffect(() => {
    fetchProyectos();

    const unlisten = history.listen(() => {
      fetchProyectos();
    });
    return () => {
      unlisten();
    };
  }, [history, token]);

  useEffect(() => {
    if (accordionGroup.current && proyectosCargados) {
      accordionGroup.current.value = tieneFavoritos
        ? ["Favoritos", "Recientes", "Todos"]
        : ["Recientes", "Todos"];
    }
  }, [tieneFavoritos, proyectosCargados]);

  return (
    <IonPage>
      <Header />
      <IonContent>
        <h2>Proyectos</h2>
        {tieneProyectos ? (
          <IonAccordionGroup ref={accordionGroup} multiple={true}>
            {tieneFavoritos && (
              <IonAccordion value="Favoritos">
                <IonItem slot="header" color="light">
                  <IonLabel>Favoritos</IonLabel>
                </IonItem>
                <div slot="content">
                  <br />
                  {proyectos
                    .filter((p) => p.isFavorite)
                    .map((proyecto) => (
                      <Project
                        title={proyecto.titulo}
                        progress={25}
                        totalTasks={8}
                        completedTasks={2}
                        isFavorite={proyecto.esfavorito}
                      />
                    ))}
                  <br />
                </div>
              </IonAccordion>
            )}
            <IonAccordion value="Recientes">
              <IonItem slot="header" color="light">
                <IonLabel>Recientes</IonLabel>
              </IonItem>
              <div slot="content">
                <br />
                {proyectos.map((proyecto) => (
                  <Project
                    title={proyecto.titulo}
                    progress={25}
                    totalTasks={8}
                    completedTasks={2}
                    isFavorite={proyecto.esfavorito}
                  />
                ))}
                <br />
              </div>
            </IonAccordion>

            <IonAccordion value="Todos">
              <IonItem slot="header" color="light">
                <IonLabel>Todos los proyectos</IonLabel>
              </IonItem>
              <div slot="content">
                <br />
                {proyectos.map((proyecto) => (
                  <Project
                    title={proyecto.titulo}
                    progress={25}
                    totalTasks={8}
                    completedTasks={2}
                    isFavorite={proyecto.esfavorito}
                  />
                ))}
                <br />
              </div>
            </IonAccordion>
          </IonAccordionGroup>
        ) : (
          <div className="noProjects">
            <img src={emptyfolder} alt="empty folder" className="folder" />
            <p className="bienvenida">¡Bienvenido a ClipTask!</p>
            <p className="empezar">Para empezar, crea un proyecto</p>
            <IonButton
              routerLink="/create-project"
              className="btnCreateProject"
            >
              CREA TU PRIMER PROYECTO
            </IonButton>
          </div>
        )}
      </IonContent>
      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message="Tu sesión ha expirado. Por favor, inicia sesión nuevamente."
        duration={3000}
      />
    </IonPage>
  );
};

export default ProjectsList;
