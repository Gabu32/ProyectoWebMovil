import React, { useState, useEffect } from "react";
import {
  IonPage,
  IonContent,
  IonInput,
  IonLabel,
  IonButton,
  IonToast,
  IonItem,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonDatetime,
  IonIcon,
} from "@ionic/react";
import "./CreateTask.css";
import axios from "axios";
import { arrowBackOutline } from "ionicons/icons";
import { useHistory, useParams } from "react-router-dom";
import Header from "../../components/Header";

const CreateTask: React.FC = () => {
  const [titulo, setTitulo] = useState<string>("");
  const [descripcion, setDescripcion] = useState<string>("");
  const [usuariosProyecto, setUsuariosProyecto] = useState<any[]>([]);
  const [usuarioResponsable, setUsuarioResponsable] = useState<number | null>(
    null
  );
  const [fechaVencimiento, setFechaVencimiento] = useState<string>("");
  const [showToast, setShowToast] = useState<boolean>(false);
  const [mensajeToast, setMensajeToast] = useState<string>("");
  const history = useHistory();
  const { id } = useParams<{ id: string }>();

  const handleBack = () => {
    history.push(`/project/${id}`);
  };

  useEffect(() => {
    const fetchUsuariosProyecto = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:5000/api/proyectos/${id}/usuarios`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUsuariosProyecto(response.data);
      } catch (error) {
        console.error("Error al obtener usuarios del proyecto: ", error);
        setMensajeToast("Error al cargar usuarios del proyecto");
        setShowToast(true);
      }
    };
    fetchUsuariosProyecto();
  }, [id]);

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:5000/api/proyectos/${id}/tareas`,
        {
          titulo,
          descripcion,
          usuario_id: usuarioResponsable,
          fechaVencimiento,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      if (response.status === 201) {
        setMensajeToast("Tarea creada con éxito");
        setShowToast(true);

        setTitulo("");
        setDescripcion("");
        setUsuarioResponsable(null);
        setFechaVencimiento("");
        history.push(`/project/${id}`);
      }
    } catch (error) {
      console.error(error);
      setMensajeToast("Error al crear la tarea");
      setShowToast(true);
    }
  };

  const handleFechaChange = (e: any) => {
    const selectedDate = e.detail.value!;
    setFechaVencimiento(selectedDate);
    console.log("Fecha de vencimiento: ", selectedDate);
  };

  return (
    <IonPage>
      <Header />
      <IonContent>
        <div className="botonBack">
          <IonButton onClick={handleBack} fill="clear">
            <IonIcon icon={arrowBackOutline} />
          </IonButton>
          <h2>Nuevo Proyecto</h2>
        </div>
        <div className="createTaskContainer">
          <IonLabel>Título</IonLabel>
          <IonItem style={{ borderRadius: "15px" }}>
            <IonInput
              value={titulo}
              onIonChange={(e) => setTitulo(e.detail.value!)}
              placeholder="Ingrese el titulo de la tarea"
              maxlength={15}
              counter={true}
            />
          </IonItem>

          <IonLabel>Descripción</IonLabel>
          <IonItem style={{ borderRadius: "15px" }}>
            <IonTextarea
              value={descripcion}
              onIonChange={(e) => setDescripcion(e.detail.value!)}
              placeholder="Ingrese una descripción para la tarea"
              maxlength={200}
              counter={true}
              rows={4}
            />
          </IonItem>

          <IonLabel>Fecha de Vencimiento</IonLabel>
          <div className="calendar-container">
            <IonDatetime
              value={fechaVencimiento}
              onIonChange={handleFechaChange}
              min={new Date().toISOString()}
            />
          </div>

          <IonLabel>Asignar Responsable</IonLabel>
          <IonItem style={{ borderRadius: "15px" }}>
            <IonSelect
              value={usuarioResponsable}
              placeholder="Seleccione un responsable"
              onIonChange={(e) => setUsuarioResponsable(e.detail.value)}
            >
              {usuariosProyecto.map((usuario) => (
                <IonSelectOption key={usuario.id} value={usuario.id}>
                  {usuario.nombre} {usuario.apellido}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>
          <div className="btnAddTaskContainer">
            <IonButton
              className="btnAddTask"
              expand="full"
              onClick={handleSubmit}
              shape="round"
            >
              Crear tarea
            </IonButton>
          </div>
        </div>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={mensajeToast}
          duration={2000}
        />
      </IonContent>
    </IonPage>
  );
};

export default CreateTask;
