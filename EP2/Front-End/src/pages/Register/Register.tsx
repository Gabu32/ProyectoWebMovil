import ReCAPTCHA from "react-google-recaptcha";
import {
  IonButton,
  IonContent,
  IonPage,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonInput,
  IonInputPasswordToggle,
  useIonToast,
} from "@ionic/react";
import axios from "axios";
import "./Register.css";
import logo from "./images/logo.svg";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

interface Region {
  region: string;
  comunas: string[];
}

const Register: React.FC = () => {
  const history = useHistory();
  const [present] = useIonToast();
  const [regions, setRegions] = useState<Region[]>([]);
  const [communes, setCommunes] = useState<string[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
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

  const handleCaptchaChange = (token: string | null) => {
    setCaptchaToken(token);
  };

  const [errors, setErrors] = useState<any>({});

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

  const onRegionChange = (event: CustomEvent) => {
    const regionName = event.detail.value;
    setSelectedRegion(regionName);
    const regionData = regions.find((region) => region.region === regionName);
    const comunas = (regionData && regionData.comunas) || [];
    setCommunes(comunas);
    setFormData((prev) => ({ ...prev, region: regionName, comuna: "" }));
    setErrors((prev: String) => ({ ...prev, region: "" }));
  };

  const handleInputChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev: String) => ({ ...prev, [key]: "" }));
  };

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const onSubmit = async () => {
    const newErrors: any = {};

    if (!formData.nombre) newErrors.nombre = "Falta ingresar el nombre.";
    if (!formData.apellido) newErrors.apellido = "Falta ingresar el apellido.";
    if (!formData.email) {
      newErrors.email = "Falta ingresar el correo electrónico.";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Formato de correo electrónico incorrecto.";
    }
    if (!formData.rut) newErrors.rut = "Falta ingresar el RUT.";
    if (!formData.password)
      newErrors.password = "Falta ingresar la contraseña.";
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden.";
    }
    if (!formData.region) newErrors.region = "Falta seleccionar la región.";
    if (!formData.comuna) newErrors.comuna = "Falta seleccionar la comuna.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (!captchaToken) {
      present({
        message: "Por favor completa el CAPTCHA.",
        duration: 3000,
        position: "top",
        color: "warning",
      });
      return;
    }

    formData.captchaToken = captchaToken;

    try {
      const response = await axios.post(
        "http://localhost:5000/api/register",
        formData
      );
      console.log("Registro Exitoso", response.data);

      present({
        message: "Registro exitoso.",
        duration: 5000,
        position: "top",
        color: "success",
      });

      history.push("/landing");
    } catch (error) {
      console.error("Registro Fallido", error);
      present({
        message: "Error al registrar. Inténtalo nuevamente.",
        duration: 5000,
        position: "top",
        color: "danger",
      });
    }
  };

  const formatRUT = (value: string) => {
    const cleanedValue = value.replace(/[^0-9Kk]/g, "");
    if (cleanedValue.length > 1) {
      const body = cleanedValue.slice(0, -1);
      const dv = cleanedValue.slice(-1).toUpperCase();
      return body + "-" + dv;
    }
    return cleanedValue;
  };

  const handleRUTChange = (event: CustomEvent) => {
    const value = event.detail.value;
    handleInputChange("rut", formatRUT(value));
  };

  return (
    <IonPage>
      <IonContent className="container-main">
        <div className="logo-container">
          <img src={logo} alt="logo" />
          <div className="logo-text">ClipTask</div>
        </div>
        <div className="container-register">
          <div className="form-container">
            <h1 id="register">Registro de Usuario</h1>

            <IonLabel>Nombre</IonLabel>
            <IonItem className="formInput">
              <IonInput
                value={formData.nombre}
                onIonInput={(e) => handleInputChange("nombre", e.detail.value!)}
                required
                placeholder="Nombre"
                maxlength={30}
              />
            </IonItem>
            {errors.nombre && <p className="error-text">{errors.nombre}</p>}

            <IonLabel>Apellido</IonLabel>
            <IonItem className="formInput">
              <IonInput
                value={formData.apellido}
                onIonInput={(e) =>
                  handleInputChange("apellido", e.detail.value!)
                }
                required
                placeholder="Apellido"
                maxlength={30}
              />
            </IonItem>
            {errors.apellido && <p className="error-text">{errors.apellido}</p>}

            <IonLabel>Correo electrónico</IonLabel>
            <IonItem className="formInput">
              <IonInput
                type="email"
                value={formData.email}
                onIonInput={(e) => handleInputChange("email", e.detail.value!)}
                required
                placeholder="Correo electrónico"
                maxlength={50}
              />
            </IonItem>
            {errors.email && <p className="error-text">{errors.email}</p>}

            <IonLabel>RUT</IonLabel>
            <IonItem className="formInput">
              <IonInput
                value={formData.rut}
                onIonInput={handleRUTChange}
                required
                placeholder="RUT"
                maxlength={10}
              />
            </IonItem>
            {errors.rut && <p className="error-text">{errors.rut}</p>}

            <IonLabel>Contraseña</IonLabel>
            <IonItem className="formInput">
              <IonInput
                type="password"
                value={formData.password}
                onIonInput={(e) =>
                  handleInputChange("password", e.detail.value!)
                }
                required
                placeholder="Contraseña"
                maxlength={16}
              >
                <IonInputPasswordToggle slot="end" />
              </IonInput>
            </IonItem>
            {errors.password && <p className="error-text">{errors.password}</p>}

            <IonLabel>Confirmar Contraseña</IonLabel>
            <IonItem className="formInput">
              <IonInput
                type="password"
                value={formData.confirmPassword}
                onIonInput={(e) =>
                  handleInputChange("confirmPassword", e.detail.value!)
                }
                required
                placeholder="Confirmar Contraseña"
                maxlength={16}
              >
                <IonInputPasswordToggle slot="end" />
              </IonInput>
            </IonItem>
            {errors.confirmPassword && (
              <p className="error-text">{errors.confirmPassword}</p>
            )}

            <IonLabel>Seleccionar Región</IonLabel>
            <IonItem className="formSelect">
              <IonSelect
                value={formData.region}
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
            {errors.region && <p className="error-text">{errors.region}</p>}

            <IonLabel>Seleccionar Comuna</IonLabel>
            <IonItem className="formSelect">
              <IonSelect
                value={formData.comuna}
                onIonChange={(e) =>
                  handleInputChange("comuna", e.detail.value!)
                }
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
            {errors.comuna && <p className="error-text">{errors.comuna}</p>}

            <ReCAPTCHA
              className="captcha"
              sitekey="SECRET"
              onChange={handleCaptchaChange}
            />

            <div className="btn-register-container">
              <IonButton
                expand="full"
                shape="round"
                size="large"
                onClick={onSubmit}
                id="register-button"
                className="btn-register"
              >
                REGISTRAR
              </IonButton>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Register;
