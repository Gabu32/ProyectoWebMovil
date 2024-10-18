import React, { useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonInput,
  IonLabel,
  IonButton,
  IonToast,
  IonBackButton,
  IonButtons,
  IonIcon,
  IonItem,
} from "@ionic/react";
import "./CreateTask.css";
import { personCircle } from "ionicons/icons";
import axios from "axios";
import { useHistory } from "react-router-dom";

const CreateTask: React.FC = () => {
  const [titulo, setTitulo] = useState<string>("");
  const [colaboradores, setColaboradores] = useState<string[]>([]);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [mensajeToast, setMensajeToast] = useState<string>("");
  const history = useHistory();

  const handleAddColaborador = () => {
    setColaboradores([...colaboradores, ""]);
  };

  const handleRemoveColaborador = (index: number) => {
    const newColaboradores = [...colaboradores];
    newColaboradores.splice(index, 1);
    setColaboradores(newColaboradores);
  };

  const handleColaboradorChange = (index: number, value: string) => {
    const newColaboradores = [...colaboradores];
    newColaboradores[index] = value;
    setColaboradores(newColaboradores);
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/proyectos",
        {
          titulo,
          colaboradores,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 201) {
        setMensajeToast("Tarea creado con éxito");
        setShowToast(true);

        setTitulo("");
        setColaboradores([]);
        history.push("/tasks");
      }
    } catch (error) {
      console.error(error);
      setMensajeToast("Error al crear la tarea");
      setShowToast(true);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="light">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/projects" />
          </IonButtons>
          <IonTitle></IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <h2>Nueva Tarea</h2>
        <div className="createProjectContainer">
          <IonLabel>Título</IonLabel>
          <IonItem style={{ borderRadius: "15px" }}>
            <IonInput
              value={titulo}
              onIonChange={(e) => setTitulo(e.detail.value!)}
              placeholder="Ingrese el titulo de la tarea"
              counter={true}
              maxlength={20}
            />
          </IonItem>
          <div className="btnContainer">
            <IonButton
              className="btnAddCollaborator"
              expand="full"
              onClick={handleAddColaborador}
              shape="round"
            >
              Asignar <br />
              Colaborador
              <IonIcon slot="start" icon={personCircle} />
            </IonButton>

            {colaboradores.map((colaborador, index) => (
              <div
                key={index}
                style={{ display: "flex", alignItems: "center" }}
                className="newCollaborator"
              >
                <IonItem>
                  <IonInput
                    value={colaborador}
                    onIonChange={(e) =>
                      handleColaboradorChange(index, e.detail.value!)
                    }
                    placeholder={`Correo del colaborador ${index + 1}`}
                    style={{ flex: 1 }}
                    maxlength={50}
                  />
                </IonItem>
                <IonButton
                  color="danger"
                  onClick={() => handleRemoveColaborador(index)}
                  style={{ marginLeft: "10px" }}
                >
                  X
                </IonButton>
              </div>
            ))}

            <IonButton
              className="btnAddProj"
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
