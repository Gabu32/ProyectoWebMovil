import React, { useEffect, useState } from "react";
import { IonPage, IonContent, IonLabel, IonInput, IonItem, IonSelect, IonSelectOption, IonButton, IonIcon, IonText } from "@ionic/react";
import { useHistory, useLocation } from "react-router-dom";
import axios from "axios";
import "./UserPage.css";
import Header  from "../../components/Header";
import { arrowBackOutline } from "ionicons/icons";

interface Region {
  region: string;
  comunas: string[];
}

const UserPage: React.FC = () => {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [user, setUser] = useState<any | null>(null);
  const [error, setError] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [regions, setRegions] = useState<Region[]>([]);
  const [communes, setCommunes] = useState<string[]>([]);
  const [errors, setErrors] = useState<any>({});
  const userID = localStorage.getItem("userID");
  const [isTouched, setIsTouched] = useState(false);
  const [isValid, setIsValid] = useState<boolean>();
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    rut: "",
    password: "",
    confirmPassword: "",
    region: "",
    comuna: "",
    captchaToken: "",
  });

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await fetch("/comunas-regiones.json");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setRegions(data.regiones);
      } catch (error) {
        console.error("Error al cargar regiones", error);
      }
    };

    fetchRegions();
  }, []);


  const handleInputChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev: String) => ({ ...prev, [key]: "" }));
  };

  useEffect(() => {
    if (location.pathname !== '/user/') {
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
  }

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        
        const response = await axios.get(
          `http://localhost:5000/api/user/${userID}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Usuario recibido:", response.data);
        setUser(response.data[0]);
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

  const handleLogout = () => {
    // Elimina datos del localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("userID");
    
    // Redirige al usuario a la página de inicio de sesión
    history.push("/login");
  };
  
  // Función para manejar el cambio de región
const onRegionChange = (event: CustomEvent) => {
  const regionName = event.detail.value;
  const regionData = regions.find((region) => region.region === regionName);
  const comunas = (regionData && regionData.comunas) || [];

  // Actualizar el estado de regiones, comunas y usuario
  setSelectedRegion(regionName);
  setCommunes(comunas);
  setUser((prev: any) => ({
    ...prev,
    region: regionName,
    comuna: "", // Reinicia la comuna al cambiar la región
  }));
  setErrors((prev: any) => ({ ...prev, region: "" }));
};

// Función para manejar el cambio de comuna
const onComunaChange = (event: CustomEvent) => {
  const comunaName = event.detail.value;

  // Actualizar el estado del usuario
  setUser((prev: any) => ({
    ...prev,
    comuna: comunaName,
  }));
  setErrors((prev: any) => ({ ...prev, comuna: "" }));
};

// Función para guardar los cambios
const handleSave = async () => {
  try {
    const token = localStorage.getItem("token");

    const updatedUser = {
      nombre: user.nombre,
      apellido: user.apellido,
      email: user.email,
      region: user.region,
      comuna: user.comuna,
    };

    const response = await axios.put(
      `http://localhost:5000/api/user/${userID}`,
      updatedUser,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Usuario actualizado:", response.data);
    setIsEditing(false); // Salir del modo edición
  } catch (error) {
    console.error("Error al actualizar los datos del usuario:", error);
    setError("Error al actualizar los datos del usuario");
  }
};

  
  const handleEdit = () => {
    setIsEditing(true);
  };

  const validateEmail = (email: string) => {
    return email.match(
      /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    );
  };

  const validate = (value: string) => {
    setIsValid(undefined);
    if (value === "") return;
    validateEmail(value) !== null ? setIsValid(true) : setIsValid(false);
  };

  const markTouched = () => {
    setIsTouched(true);
  };
  

  return (
    <IonPage>
      <IonContent className="container-main">
        <Header />
        <div className="botonBack">
                <IonButton onClick={handleBack} fill="clear">
                  <IonIcon icon={arrowBackOutline} />
                </IonButton>
                <h2>Perfil de usuario</h2>
              </div>
        <div className="container-register">
          <div className="form-container">
          {error ? (
            <p className="error-message">{error}</p>
          ) : user ? (
            isEditing ? (
              <>
                <IonLabel>Nombre:</IonLabel>
                <IonItem className="input">
                  <IonInput
                    value={user.nombre}
                    onIonChange={(e) =>
                      setUser({ ...user, nombre: e.detail.value! })
                    }
                    placeholder="Ingresa tu nombre"
                  />
                </IonItem>
                <IonLabel>Apellido:</IonLabel>
                <IonItem className="input"> 
                  <IonInput
                    value={user.apellido}
                    onIonChange={(e) =>
                      setUser({ ...user, apellido: e.detail.value! })
                    }
                    placeholder="Ingresa tu apellido"
                  />
                </IonItem>
                <IonLabel>Email:</IonLabel>
                <IonItem className="input">
                  <IonInput
                    maxlength={50}
                    type="email"
                    value={user.email}
                    onIonChange={(e) => {
                      setUser({...user, email: e.detail.value!})
                      validate(e.detail.value!);
                    }}
                    onIonBlur={markTouched}
                    placeholder="Correo electrónico"
                    required
                  />
                </IonItem>
                {isTouched && isValid === false && (
                  <IonText className="text-danger">
                    Formato de correo electrónico inválido
                  </IonText>
                )}
                {errors.email && <p className="error-text">{errors.email}</p>}
                <IonLabel>Seleccionar Región</IonLabel>
                <IonItem className="formSelect">
                  <IonSelect
                    value={user.region} // Utiliza el valor del estado 'user'
                    onIonChange={onRegionChange}
                    interface="popover"
                    placeholder="Selecciona una región"
                  >
                    {regions.length > 0 ? (
                      regions.map((region) => (
                        <IonSelectOption key={region.region} value={region.region}>
                          {region.region}
                        </IonSelectOption>
                      ))
                    ) : (
                      <IonSelectOption value="">
                        Cargando regiones...
                      </IonSelectOption>
                    )}
                  </IonSelect>
                </IonItem>

                <IonLabel>Seleccionar Comuna</IonLabel>
                <IonItem className="formSelect">
                  <IonSelect
                    value={user.comuna} // Utiliza el valor del estado 'user'
                    onIonChange={onComunaChange}
                    interface="popover"
                    placeholder="Selecciona una comuna"
                  >
                    {communes.length > 0 ? (
                      communes.map((comuna) => (
                        <IonSelectOption key={comuna} value={comuna}>
                          {comuna}
                        </IonSelectOption>
                      ))
                    ) : (
                      <IonSelectOption value="">
                        Selecciona una región primero
                      </IonSelectOption>
                    )}
                  </IonSelect>
                </IonItem>
                    <button className="btn-save" onClick={handleSave}>
                      Guardar Cambios
                    </button>
                    <button className="btn-cancel" onClick={() => setIsEditing(false)}>
                      Cancelar
                    </button>
                  </>
                ) : (
                  <>
                <IonLabel className="rutas">Nombre: {user.nombre} {user.apellido}</IonLabel>
                <IonLabel className="rutas">Email: {user.email}</IonLabel>
                <IonLabel className="rutas">RUT: {user.rut}</IonLabel>
                <IonLabel className="rutas">Región: {user.region}</IonLabel>
                <IonLabel className="rutas">Comuna: {user.comuna}</IonLabel>
                <button className="btn-edit" onClick={handleEdit}>
                  Editar
                </button>
              </>
            )
          ) : (
            <p>Cargando datos del usuario...</p>
          )}
            <button className="btn-close" onClick={handleLogout}>
              Cerrar Sesion
            </button>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default UserPage;
