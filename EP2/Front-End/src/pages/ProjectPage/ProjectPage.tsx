import React from "react";
import {
  IonContent,
  IonPage,
  IonTabBar,
  IonTabButton,
  IonItem,
  IonAccordion,
  IonAccordionGroup,
  IonTab,
  IonTabs,
  IonDatetime,
  IonText,
  IonButton,
} from "@ionic/react";

import "./ProjectPage.css";
import Task from "../../components/Task";
import TeamMember from "../../components/TeamMember";
import Header from "../../components/Header";
import { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router";
import axios from "axios";

const ProjectPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();

  const [projectTitle, setProjectTitle] = useState("");
  const [tasks, setTasks] = useState<any[]>([]);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const projectResponse = await axios.get(
          `http://localhost:5000/api/proyectos/${id}`
        );
        setProjectTitle(projectResponse.data.titulo);
        console.log(projectResponse.data);

        const tasksResponse = await axios.get(
          `http://localhost:5000/api/proyectos/${id}/tasks`
        );
        setTasks(tasksResponse.data);
        console.log(tasksResponse.data);

        const teamResponse = await axios.get(
          `http://localhost:5000/api/proyectos/${id}/team`
        );
        setTeamMembers(teamResponse.data);
        console.log(teamResponse.data);
      } catch (error) {
        console.error("Error al cargar datos del proyecto: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
  }, [id]);

  const handleCreateTask = () => {
    history.push("/create-task");
  };

  if (loading) {
    return (
      <IonPage>
        <IonContent>
          <IonText>Cargando...</IonText>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonTabs>
        <IonTab tab="tasks">
          <Header />
          <IonTabBar>
            <IonTabButton tab="tasks">Tareas</IonTabButton>
            <IonTabButton tab="cronograma">Cronograma</IonTabButton>
            <IonTabButton tab="team">Equipo</IonTabButton>
          </IonTabBar>
          <IonContent className="tasks-container">
            <div className="subheader">
              <h2>{projectTitle}</h2>
              <IonButton onClick={handleCreateTask}>Agregar tarea</IonButton>
            </div>
            <div className="date-item">
              <span>fecha</span>
            </div>
            {tasks
              .filter((task) => !task.isCompleted)
              .map((task) => (
                <Task key={task.id} name={task.name} isCompleted={false} />
              ))}

            <IonAccordionGroup>
              <IonAccordion>
                <IonItem slot="header" color="light">
                  <IonText>
                    Completadas (
                    {tasks.filter((task) => task.isCompleted).length})
                  </IonText>
                </IonItem>
                <div slot="content">
                  {tasks
                    .filter((task) => task.isCompleted)
                    .map((task) => (
                      <Task key={task.id} name={task.name} isCompleted={true} />
                    ))}
                </div>
              </IonAccordion>
            </IonAccordionGroup>
          </IonContent>
        </IonTab>

        <IonTab tab="cronograma">
          <Header />
          <IonTabBar>
            <IonTabButton tab="tasks">Tareas</IonTabButton>
            <IonTabButton tab="cronograma">Cronograma</IonTabButton>
            <IonTabButton tab="team">Equipo</IonTabButton>
          </IonTabBar>
          <IonContent>
            <div className="subheader">
              <h2>{projectTitle}</h2>
              <IonButton onClick={handleCreateTask}>Agregar tarea</IonButton>
            </div>
            <div className="date-container">
              <IonDatetime presentation="date"></IonDatetime>
            </div>

            <IonAccordionGroup>
              <IonAccordion>
                <IonItem slot="header" color="light">
                  <IonText>
                    Completadas (
                    {tasks.filter((task) => task.isCompleted).length})
                  </IonText>
                </IonItem>
                <div slot="content">
                  {tasks
                    .filter((task) => task.isCompleted)
                    .map((task) => (
                      <Task key={task.id} name={task.name} isCompleted={true} />
                    ))}
                </div>
              </IonAccordion>
            </IonAccordionGroup>
          </IonContent>
        </IonTab>
        <IonTab tab="team">
          <Header />
          <IonTabBar>
            <IonTabButton tab="tasks">Tareas</IonTabButton>
            <IonTabButton tab="cronograma">Cronograma</IonTabButton>
            <IonTabButton tab="team">Equipo</IonTabButton>
          </IonTabBar>
          <IonContent>
            <div className="team-list">
              <div className="subheader">
                <h2>{projectTitle}</h2>
                <IonButton onClick={handleCreateTask}>Agregar tarea</IonButton>
              </div>
              <h3>Integrantes ({teamMembers.length})</h3>
              {teamMembers.map((member) => (
                <TeamMember
                  key={member.id}
                  name={member.name}
                  role={member.role}
                />
              ))}
            </div>
          </IonContent>
        </IonTab>
      </IonTabs>
    </IonPage>
  );
};

export default ProjectPage;
