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
  IonModal,
  IonInput,
  IonToast,
} from "@ionic/react";

import "./ProjectPage.css";
import Task from "../../components/Task";
import TeamMember from "../../components/TeamMember";
import Header from "../../components/Header";
import Calendar from "../../components/Calendar";
import { useState, useEffect } from "react";
import {
  addCircleOutline,
  arrowBackOutline,
  personAddOutline,
  pencilOutline,
  create,
} from "ionicons/icons";
import { useHistory, useParams, useLocation } from "react-router";
import axios from "axios";
import AddUserPopover from "../../components/AddUserPopOver";
interface LocationState {
  reload: boolean;
}

const ProjectPage: React.FC = () => {
  const userID = localStorage.getItem("userID");
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const [showPopover, setShowPopover] = useState(false);
  const [projectTitle, setProjectTitle] = useState("");
  const [creadorID, setCreadorId] = useState(Number);
  const [tasks, setTasks] = useState<any[]>([]);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(Number);
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState(projectTitle);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showDeleteToast, setShowDeleteToast] = useState(false);
  const [projectDeleted, setProjectDeleted] = useState(false);
  const location = useLocation<LocationState>();

  const confirmDelete = (memberId: number) => {
    setMemberToDelete(memberId);
    setShowAlert(true);
    console.log(memberToDelete, memberId);
  };

  useEffect(() => {
    if (location.state && location.state.reload) {
      setReload((prev) => !prev);
    }
  }, [location]);

  const handleCreateTask = () => {
    history.push(`/create-task/${id}`);
    setReload((prev) => !prev);
  };

  const handleEditClick = () => {
    setNewTitle(projectTitle);
    setShowModal(true);
  };

  const handleSaveTitle = async () => {
    if (!newTitle.trim()) {
      // Verifica si el título está vacío o solo contiene espacios
      setShowErrorToast(true); // Muestra un toast de error
      return;
    }

    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `http://localhost:5000/api/project/${id}/title`,
        { newTitle },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProjectTitle(newTitle);
      setShowModal(false);
    } catch (error) {
      console.error("Error al actualizar el título:", error);
      alert("No se pudo actualizar el título.");
    }
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
      setReload((prev) => !prev);
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      alert("No se pudo eliminar el usuario.");
    }
    setReload(true);
  };

  const handleBack = () => {
    history.push("/projects");
  };

  const onUserAdded = () => {
    setReload(true);
    setShowPopover(false);
  };

  useEffect(() => {
    if (projectDeleted) {
      return;
    }
    const fetchProjectData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Token no encontrado");
          history.push("/landing");
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
          error.response &&
          (error.response.status === 401 || error.response.status === 403) &&
          error.message.includes("TokenExpiredError")
        ) {
          alert("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.");
          localStorage.removeItem("token");
          history.push("/landing");
        } else if (error.response && error.response.status === 404) {
          alert("Proyecto no encontrado.");
          history.push("/projects");
        } else {
          alert("Error al cargar los detalles del proyecto.");
          history.push("/projects");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProjectData();
    setReload(false);
  }, [reload, projectDeleted]);

  if (loading) {
    return (
      <IonPage>
        <IonContent>
          <IonText>Cargando...</IonText>
        </IonContent>
      </IonPage>
    );
  }

  const handleDeleteProject = async () => {
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
      setProjectDeleted(true);
      await axios.delete(
        `http://localhost:5000/api/proyectos/${id}`,
        authHeaders
      );

      setShowDeleteToast(true);
      setShowModal(false);
      history.push("/projects");
    } catch (error) {
      console.error("Error al eliminar el proyecto", error);
      alert("No se pudo eliminar el proyecto.");
    }
  };

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
                {userID !== null && parseInt(userID) === creadorID && (
                  <IonButton onClick={handleEditClick} fill="clear">
                    <IonIcon icon={create} />
                  </IonButton>
                )}
              </div>
              {userID !== null && parseInt(userID) === creadorID && (
                <IonButton onClick={handleCreateTask}>
                  <IonIcon icon={addCircleOutline} />
                </IonButton>
              )}
            </div>
            <div className="date-item">
              <span>fecha</span>
            </div>
            {tasks.filter((task) => !task.completado).length === 0 ? (
              <IonText color="medium">
                <p>No hay tareas pendientes. ¡Agrega algunas!</p>
              </IonText>
            ) : (
              tasks
                .filter((task) => !task.completado)
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
            <div className="spacer"></div>
            {tasks.filter((task) => task.completado).length > 0 && (
              <IonAccordionGroup>
                <IonAccordion>
                  <IonItem slot="header" color="light">
                    <IonText>
                      Completadas (
                      {tasks.filter((task) => task.completado).length})
                    </IonText>
                  </IonItem>
                  <div slot="content">
                    {tasks
                      .filter((task) => task.completado)
                      .map((task) => (
                        <Task
                          key={task.id}
                          taskID={task.id}
                          name={task.titulo}
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
                {userID !== null && parseInt(userID) === creadorID && (
                  <IonButton onClick={handleEditClick} fill="clear">
                    <IonIcon icon={create} />
                  </IonButton>
                )}
              </div>
              {userID !== null && parseInt(userID) === creadorID && (
                <IonButton onClick={handleCreateTask}>
                  <IonIcon icon={addCircleOutline} />
                </IonButton>
              )}
            </div>
            <div className="date-container">
              <Calendar tasks={tasks} proyecto_id={parseInt(id)} />
            </div>
            <div className="spacer"></div>
            {tasks.filter((task) => task.completado).length > 0 && (
              <IonAccordionGroup>
                <IonAccordion>
                  <IonItem slot="header" color="light">
                    <IonText>
                      Completadas (
                      {tasks.filter((task) => task.completado).length})
                    </IonText>
                  </IonItem>
                  <div slot="content">
                    {tasks
                      .filter((task) => task.completado)
                      .map((task) => (
                        <Task
                          key={task.id}
                          taskID={task.id}
                          name={task.titulo}
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
                  {userID !== null && parseInt(userID) === creadorID && (
                    <IonButton onClick={handleEditClick} fill="clear">
                      <IonIcon icon={create} />
                    </IonButton>
                  )}
                </div>
                {userID !== null && parseInt(userID) === creadorID && (
                  <IonButton onClick={handleCreateTask}>
                    <IonIcon icon={addCircleOutline} />
                  </IonButton>
                )}
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

            <IonModal
              isOpen={showModal}
              onDidDismiss={() => setShowModal(false)}
              className="custom-modal"
            >
              <div className="modal-content">
                <IonItem>
                  <IonInput
                    value={newTitle}
                    maxlength={12}
                    counter={true}
                    placeholder="Nuevo título del proyecto"
                    onIonChange={(e) => setNewTitle(e.detail.value!)}
                  />
                </IonItem>
                <IonButton expand="block" onClick={handleSaveTitle}>
                  Guardar
                </IonButton>
                <IonButton
                  expand="block"
                  color="light"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </IonButton>
                <IonButton
                  color="danger"
                  onClick={() => setShowDeleteAlert(true)}
                >
                  Eliminar Proyecto
                </IonButton>
              </div>
            </IonModal>
            <IonAlert
              isOpen={showDeleteAlert}
              onDidDismiss={() => setShowDeleteAlert(false)}
              header={"Confirmar Eliminación"}
              message={"¿Estás seguro de que deseas eliminar este proyecto?"}
              buttons={[
                {
                  text: "Cancelar",
                  role: "cancel",
                  handler: () => setShowDeleteAlert(false),
                },
                {
                  text: "Eliminar",
                  handler: handleDeleteProject,
                },
              ]}
            />

            <IonToast
              isOpen={showDeleteToast}
              onDidDismiss={() => setShowDeleteToast(false)}
              message="Proyecto eliminado exitosamente."
              duration={2000}
              color="danger"
            />
            <IonToast
              isOpen={showErrorToast}
              onDidDismiss={() => setShowErrorToast(false)}
              message="El título no puede estar vacío."
              duration={2000}
              color="danger"
            />
          </IonContent>
        </IonTab>
      </IonTabs>
    </IonPage>
  );
};

export default ProjectPage;
