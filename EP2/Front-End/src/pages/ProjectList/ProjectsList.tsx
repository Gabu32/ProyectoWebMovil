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
  IonIcon,
} from "@ionic/react";
import Project from "../../components/Project";
import "./ProjectsList.css";
import axios from "axios";
import emptyfolder from "./emptyfolder.png";
import { useHistory } from "react-router-dom";
import { arrowBackOutline } from "ionicons/icons";
import Header from "../../components/Header";

const ProjectsList: React.FC = () => {
  const accordionGroup = useRef<null | HTMLIonAccordionGroupElement>(null);
  const [proyectos, setProyectos] = useState<any[]>([]);
  const [showToast, setShowToast] = useState(false);
  const token = localStorage.getItem("token");
  const history = useHistory();

  const handleBack = () => {
    history.push("/projects");
  };

  const [proyectosCargados, setProyectosCargados] = useState(false);

  const handleFavoriteToggle = (id: number, es_favorito: boolean) => {
    setProyectos((prevProyectos) =>
      prevProyectos.map((proyecto) =>
        proyecto.id === id
          ? { ...proyecto, es_favorito: es_favorito }
          : proyecto
      )
    );
  };

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
        console.log("Proyectos recibidos: ", response.data);
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

    fetchProyectos();

    const unlisten = history.listen(() => {
      fetchProyectos();
    });
    return () => {
      unlisten();
    };
  }, [history, token]);

  const proyectosFavoritos = proyectos.filter((p) => p.es_favorito);
  const proyectosRecientes = proyectos.sort((a, b) => b.id - a.id).slice(0, 3);
  const tieneFavoritos = proyectosFavoritos.length > 0;
  const tieneProyectos = proyectos.length > 0;

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
        <div className="botonBack">
          <IonButton onClick={handleBack} fill="clear">
            <IonIcon icon={arrowBackOutline} />
          </IonButton>
          <h2>Proyectos</h2>
        </div>

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
                    .filter((p) => p.es_favorito)
                    .map((proyecto) => (
                      <Project
                        key={proyecto.id}
                        id={proyecto.id}
                        title={proyecto.titulo}
                        progress={
                          proyecto.total_tareas > 0
                            ? (proyecto.tareas_completadas /
                                proyecto.total_tareas) *
                              100
                            : 0
                        }
                        totalTasks={proyecto.total_tareas}
                        completedTasks={proyecto.tareas_completadas}
                        es_favorito={proyecto.es_favorito}
                        onClick={() => history.push(`/project/${proyecto.id}`)}
                        onFavoriteToggle={handleFavoriteToggle}
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
                {proyectosRecientes.map((proyecto) => (
                  <Project
                    key={proyecto.id}
                    id={proyecto.id}
                    title={proyecto.titulo}
                    progress={
                      proyecto.total_tareas > 0
                        ? (proyecto.tareas_completadas /
                            proyecto.total_tareas) *
                          100
                        : 0
                    }
                    totalTasks={proyecto.total_tareas}
                    completedTasks={proyecto.tareas_completadas}
                    es_favorito={proyecto.es_favorito}
                    onClick={() => history.push(`/project/${proyecto.id}`)}
                    onFavoriteToggle={handleFavoriteToggle}
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
                    key={proyecto.id}
                    id={proyecto.id}
                    title={proyecto.titulo}
                    progress={
                      proyecto.total_tareas > 0
                        ? (proyecto.tareas_completadas /
                            proyecto.total_tareas) *
                          100
                        : 0
                    }
                    totalTasks={proyecto.total_tareas}
                    completedTasks={proyecto.tareas_completadas}
                    es_favorito={proyecto.es_favorito}
                    onClick={() => history.push(`/project/${proyecto.id}`)}
                    onFavoriteToggle={handleFavoriteToggle}
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
