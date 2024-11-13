import {
  IonButton,
  IonContent,
  IonInput,
  IonPage,
  useIonToast,
  IonText,
  IonItem,
  IonLabel,
  IonCheckbox,
  IonInputPasswordToggle,
} from "@ionic/react";
import React, { useState } from "react";
import axios from "axios";
import "./Login.css";
import logo from "./images/logo.svg";
import { useHistory } from "react-router";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isTouched, setIsTouched] = useState(false);
  const [isValid, setIsValid] = useState<boolean>();
  const history = useHistory();
  const [present] = useIonToast();

  const onSubmit = async () => {
    if (!validateEmail(email)) {
      present({
        message: "Formato de correo electrónico inválido.",
        duration: 2000,
        position: "top",
        color: "danger",
      });
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/login", {
        email,
        password,
      });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userID", response.data.userID);
      history.push("/projects");
      present({
        message: "Inicio de sesión exitoso.",
        duration: 2000,
        position: "top",
        color: "success",
      });
    } catch (error) {
      present({
        message: "Error al iniciar sesión. Verifica tus credenciales.",
        duration: 2000,
        position: "top",
        color: "danger",
      });
    }
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
        <div className="logo-container">
          <img src={logo} alt="logo" />
          <div className="logo-text">ClipTask</div>
        </div>
        <div className="container-register">
          <div className="form-container">
            <h1 id="login">Iniciar Sesión</h1>
            <IonText color="medium" className="register-link">
              ¿Es tu primera vez? <a href="register">Regístrate</a>
            </IonText>
            <br />

            <IonLabel>Correo Electrónico</IonLabel>
            <br />
            <IonItem className="formInput">
              <IonInput
                maxlength={50}
                className={`${isValid && "ion-valid"} ${
                  isValid === false && "ion-invalid"
                } ${isTouched && "ion-touched"}`}
                type="email"
                value={email}
                onIonInput={(event) => {
                  setEmail(event.detail.value!);
                  validate(event.detail.value!);
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
            <br />
            <IonLabel>Contraseña</IonLabel>
            <br />
            <IonItem className="formInput">
              <IonInput
                maxlength={16}
                type="password"
                value={password}
                onIonInput={(event) => setPassword(event.detail.value!)}
                placeholder="Contraseña"
                required
              >
                <IonInputPasswordToggle slot="end"></IonInputPasswordToggle>
              </IonInput>
            </IonItem>

            <p className="forgot-password">
              <a href="#">¿Olvidaste la contraseña?</a>
            </p>

            <div className="form-group rememberme">
              <IonCheckbox id="rememberme" />
              <IonLabel>Recuérdame</IonLabel>
            </div>

            <div className="btn-login-container">
              <IonButton
                expand="full"
                shape="round"
                size="large"
                onClick={onSubmit}
                id="login-button"
                className="btn-login"
              >
                INICIAR SESIÓN
              </IonButton>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
