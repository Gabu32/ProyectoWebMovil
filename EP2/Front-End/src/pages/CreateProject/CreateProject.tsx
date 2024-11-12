import React, { useState, useEffect } from "react";
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
import { personCircle, arrowBackOutline } from "ionicons/icons";
import axios from "axios";
import { useHistory, useLocation } from "react-router-dom";
import Header from "../../components/Header";

const CreateProject: React.FC = () => {
  const [titulo, setTitulo] = useState<string>("");
  const [colaboradores, setColaboradores] = useState<string[]>([]);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [mensajeToast, setMensajeToast] = useState<string>("");
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== "/create-project") {
      sessionStorage.setItem("previousLocation", location.pathname);
    }
  }, [location]);

  const handleBack = () => {
    const previousLocation = sessionStorage.getItem("previousLocation");
    console.log(previousLocation);

    if (previousLocation) {
      history.push(previousLocation);
    } else {
      history.push("/projects");
    }
  };

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
        setMensajeToast("Proyecto creado con éxito");
        setShowToast(true);

        setTitulo("");
        setColaboradores([]);
        history.push("/projects");
      }
    } catch (error) {
      console.error(error);
      setMensajeToast("Error al crear el proyecto");
      setShowToast(true);
    }
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
        <div className="createProjectContainer">
          <IonLabel>Título</IonLabel>
          <IonItem style={{ borderRadius: "15px" }}>
            <IonInput
              value={titulo}
              onIonChange={(e) => setTitulo(e.detail.value!)}
              placeholder="Ingrese el título del proyecto"
              counter={true}
              maxlength={15}
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
