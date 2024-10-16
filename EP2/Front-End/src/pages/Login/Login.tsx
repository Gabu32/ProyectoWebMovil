import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonPage,
  useIonToast,
  IonText,
  IonItem,
  IonLabel,
  IonCheckbox,
  IonInputPasswordToggle,
} from "@ionic/react";
import { useForm } from "react-hook-form";
import React, { useState } from "react";
import axios from "axios";
import "./Login.css";
import logo from "./images/logo.svg";
import { useHistory } from "react-router";

const Login: React.FC = () => {
  const { register, handleSubmit } = useForm();
  const [isTouched, setIsTouched] = useState(false);
  const [isValid, setIsValid] = useState<boolean>();
  const history = useHistory();
  const [present] = useIonToast();

  const onSubmit = async (data: any) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/login",
        data
      );
      localStorage.setItem("token", response.data.token);

      history.push("/home");

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

  const validate = (ev: Event) => {
    const value = (ev.target as HTMLInputElement).value;

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

            <form onSubmit={handleSubmit(onSubmit)}>
              <IonLabel position="floating">Correo Electrónico</IonLabel>
              <IonItem className="formInput">
                <IonInput
                  maxlength={50}
                  className={`${isValid && "ion-valid"} ${
                    isValid === false && "ion-invalid"
                  } ${isTouched && "ion-touched"}`}
                  type="email"
                  onIonInput={(event) => validate(event)}
                  onIonBlur={() => markTouched()}
                  errorText="Formato de correo electrónico inválido"
                  {...register("email")}
                  required
                  placeholder="Correo electrónico"
                />
              </IonItem>
              <br />
              <IonLabel position="floating">Contraseña</IonLabel>
              <IonItem className="formInput">
                <IonInput
                  maxlength={16}
                  type="password"
                  {...register("password")}
                  required
                  placeholder="Contraseña"
                >
                  <IonInputPasswordToggle slot="end"></IonInputPasswordToggle>
                </IonInput>
              </IonItem>
              <IonText id="contraseña-error" className="text-danger"></IonText>

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
                  type="submit"
                  id="login-button"
                  className="btn-login"
                >
                  INICIAR SESIÓN
                </IonButton>
              </div>
            </form>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
