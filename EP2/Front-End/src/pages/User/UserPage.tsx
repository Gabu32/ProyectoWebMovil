import React, { useEffect, useState } from "react";
import { IonPage, IonContent, IonLabel } from "@ionic/react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import "./UserPage.css";

const UserPage: React.FC = () => {
  const history = useHistory();
  const [user, setUser] = useState<any | null>(null);
  const [error, setError] = useState<string>("");
  const userID = localStorage.getItem("userID");

  const handleBack = () => {
    history.push("/projects"); // Redirige a la página principal u otra ruta
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token"); // Asumiendo que se usa un token
        const response = await axios.get(
          `http://localhost:5000/api/user/${userID}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Token para la autenticación
            },
          }
        );
        setUser(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error al cargar los datos del usuario:", error);
        setError("Error al cargar los datos del usuario");
      }
    };

    if (userID) {
      fetchUser();
    } else {
      setError("No se encontró un ID de usuario en el localStorage");
    }
  }, [userID]);

  return (
    <IonPage>
      <IonContent className="container-main">
        <div className="container-register">
          <div className="form-container">
            <h1>Perfil de usuario</h1>
            {error ? (
              <p className="error-message">{error}</p>
            ) : user ? (
              <>
                <IonLabel className="rutas">Nombre: {user.nombre} {user.apellido}</IonLabel>
                <IonLabel className="rutas">Email: {user.email}</IonLabel>s
                <IonLabel className="rutas">RUT: {user.rut}</IonLabel>
                <IonLabel className="rutas">Región: {user.region}</IonLabel>
                <IonLabel className="rutas">Comuna: {user.comuna}</IonLabel>
              </>
            ) : (
              <p>Cargando datos del usuario...</p>
            )}
            <button className="btn-back" onClick={handleBack}>
              Volver
            </button>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default UserPage;
