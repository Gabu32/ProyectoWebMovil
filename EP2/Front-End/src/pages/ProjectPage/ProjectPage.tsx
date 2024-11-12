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
  IonIcon,
  IonAlert,
} from "@ionic/react";

import "./ProjectPage.css";
import Task from "../../components/Task";
import TeamMember from "../../components/TeamMember";
import Header from "../../components/Header";
import { useState, useEffect } from "react";
import { arrowBackOutline, personAddOutline } from "ionicons/icons";
import { useHistory, useParams } from "react-router";
import axios from "axios";
import AddUserPopover from "../../components/AddUserPopOver";

const ProjectPage: React.FC = () => {
  const userID = localStorage.getItem("userID");
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const [showPopover, setShowPopover] = useState(false);
  const [projectTitle, setProjectTitle] = useState("");
  const [creadorID, setCreadorId] = useState(Number);
  const [tasks, setTasks] = useState<any[]>([]);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [reloadTeam, setReloadTeam] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(Number);

  const confirmDelete = (memberId: number) => {
    setMemberToDelete(memberId);
    setShowAlert(true);
    console.log(memberToDelete, memberId);
  };

  const handleDeleteMember = async (memberId: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Token no encontrado.");
        return;
      }

      const authHeaders = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.delete(
        `http://localhost:5000/api/proyectos/${id}/usuarios/${memberId}`,
        authHeaders
      );

      setShowAlert(false);
      alert("Miembro eliminado exitosamente.");
      setReloadTeam((prev) => !prev);
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      alert("No se pudo eliminar el usuario.");
    }
    setReloadTeam(true);
  };

  const handleBack = () => {
    history.push("/projects");
  };

  const onUserAdded = () => {
    setReloadTeam(true);
    setShowPopover(false);
  };

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Token no encontrado");
          return;
        }

        const authHeaders = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const projectResponse = await axios.get(
          `http://localhost:5000/api/proyectos/${id}`,
          authHeaders
        );
        setProjectTitle(projectResponse.data.titulo);
        setCreadorId(projectResponse.data.creador_id);
        console.log(projectResponse.data);

        const tasksResponse = await axios.get(
          `http://localhost:5000/api/proyectos/${id}/tasks`,
          authHeaders
        );
        setTasks(tasksResponse.data);
        console.log(tasksResponse.data);

        const teamResponse = await axios.get(
          `http://localhost:5000/api/proyectos/${id}/usuarios`,
          authHeaders
        );
        setTeamMembers(teamResponse.data);
        console.log(teamResponse.data);
      } catch (error: any) {
        console.error("Error al cargar datos del proyecto: ", error);

        if (
          (error.response &&
            (error.response.status === 401 || error.response.status === 403)) ||
          error.message.includes("TokenExpiredError")
        ) {
          alert("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
          localStorage.removeItem("token");
          history.push("/landing");
        } else {
          alert("Error al cargar los detalles del proyecto.");
          history.push("/projects");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
    setReloadTeam(false);

    const unlisten = history.listen(() => {
      fetchProjectData();
    });
    return () => {
      unlisten();
    };
  }, [reloadTeam]);

  const handleCreateTask = () => {
    history.push(`/create-task/${id}`);
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
              <div className="botonBack">
                <IonButton onClick={handleBack} fill="clear">
                  <IonIcon icon={arrowBackOutline} />
                </IonButton>
                <h2>{projectTitle}</h2>
              </div>
              <IonButton onClick={handleCreateTask}>Agregar tarea</IonButton>
            </div>
            <div className="date-item">
              <span>fecha</span>
            </div>
            {tasks.filter((task) => !task.isCompleted).length === 0 ? (
              <IonText color="medium">
                <p>No hay tareas pendientes. ¡Agrega algunas!</p>
              </IonText>
            ) : (
              tasks
                .filter((task) => !task.isCompleted)
                .map((task) => (
                  <Task
                    key={task.id}
                    taskID={task.id}
                    name={task.titulo}
                    isCompleted={false}
                    onClick={() => history.push(`/task/${id}/${task.id}`)}
                  />
                ))
            )}

            {tasks.filter((task) => task.isCompleted).length > 0 && (
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
                        <Task
                          key={task.id}
                          taskID={task.id}
                          name={task.name}
                          isCompleted={true}
                          onClick={() => history.push(`/task/${id}/${task.id}`)}
                        />
                      ))}
                  </div>
                </IonAccordion>
              </IonAccordionGroup>
            )}
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
              <div className="botonBack">
                <IonButton onClick={handleBack} fill="clear">
                  <IonIcon icon={arrowBackOutline} />
                </IonButton>
                <h2>{projectTitle}</h2>
              </div>
              <IonButton onClick={handleCreateTask}>Agregar tarea</IonButton>
            </div>
            <div className="date-container">
              <IonDatetime presentation="date"></IonDatetime>
            </div>

            {tasks.filter((task) => task.isCompleted).length > 0 && (
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
                        <Task
                          key={task.id}
                          taskID={task.id}
                          name={task.name}
                          isCompleted={true}
                          onClick={() => history.push(`/task/${id}/${task.id}`)}
                        />
                      ))}
                  </div>
                </IonAccordion>
              </IonAccordionGroup>
            )}
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
                <div className="botonBack">
                  <IonButton onClick={handleBack} fill="clear">
                    <IonIcon icon={arrowBackOutline} />
                  </IonButton>
                  <h2>{projectTitle}</h2>
                </div>
                <IonButton onClick={handleCreateTask}>Agregar tarea</IonButton>
              </div>
              <div className="addMemberBtn">
                <h3>Integrantes ({teamMembers.length})</h3>

                {userID !== null && parseInt(userID) === creadorID && (
                  <IonButton
                    color="primary"
                    slot="end"
                    onClick={() => setShowPopover(true)}
                  >
                    <IonIcon icon={personAddOutline} />
                  </IonButton>
                )}
              </div>

              <AddUserPopover
                isOpen={showPopover}
                onDidDismiss={() => setShowPopover(false)}
                projectId={id}
                onUserAdded={onUserAdded}
              />

              {teamMembers.map((member) => (
                <TeamMember
                  key={member.id}
                  name={member.nombre + " " + member.apellido}
                  role={member.id === creadorID ? "Creador" : "Colaborador"}
                  canDelete={
                    userID !== null &&
                    parseInt(userID) === creadorID &&
                    member.id !== creadorID
                  }
                  onDelete={() => confirmDelete(member.id)}
                />
              ))}
            </div>
            <IonAlert
              isOpen={showAlert}
              onDidDismiss={() => setShowAlert(false)}
              header={"Confirmación"}
              message={
                "¿Estás seguro de que deseas eliminar este usuario del proyecto?"
              }
              buttons={[
                {
                  text: "Cancelar",
                  role: "cancel",
                  handler: () => setShowAlert(false),
                },
                {
                  text: "Eliminar",
                  handler: () => handleDeleteMember(memberToDelete),
                },
              ]}
            />
          </IonContent>
        </IonTab>
      </IonTabs>
    </IonPage>
  );
};

export default ProjectPage;
