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
import "./CreateProject.css";
import { personCircle } from "ionicons/icons";
import axios from "axios";

const CreateProject: React.FC = () => {
  const [titulo, setTitulo] = useState<string>("");
  const [colaboradores, setColaboradores] = useState<string[]>([]);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [mensajeToast, setMensajeToast] = useState<string>("");

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
      const response = await axios.post("/api/proyectos", {
        titulo,
        colaboradores,
      });
      if (response.status === 201) {
        setMensajeToast("Proyecto creado con éxito");
        setShowToast(true);

        setTitulo("");
        setColaboradores([]);
      }
    } catch (error) {
      setMensajeToast("Error al crear el proyecto");
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
        <h2>Nuevo Proyecto</h2>
        <div className="createProjectContainer">
          <IonLabel>Título</IonLabel>
          <IonItem style={{ borderRadius: "15px" }}>
            <IonInput
              value={titulo}
              onIonChange={(e) => setTitulo(e.detail.value!)}
              placeholder="Ingrese el título del proyecto"
            />
          </IonItem>
          <div className="btnContainer">
            <IonButton
              className="btnAddCollaborator"
              expand="full"
              onClick={handleAddColaborador}
              shape="round"
            >
              Agregar <br />
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
              Crear Proyecto
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

export default CreateProject;