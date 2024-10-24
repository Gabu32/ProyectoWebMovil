import React, { useState, useEffect } from "react";
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonIcon,
  IonSearchbar,
  IonPopover,
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import { search, notifications, person, folder, add } from "ionicons/icons";
import logo from "./logo.svg";
import "./Header.css";

const Header = () => {
  const history = useHistory();
  const [isMobile, setIsMobile] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [popoverEvent, setPopoverEvent] = useState<MouseEvent>();

  const goToHome = () => {
    history.push("/home");
  };

  const goToProjects = () => {
    history.push("/projects");
  };

  const goToNewProject = () => {
    history.push("/create-project");
  };

  const goToNotifications = () => {
    history.push("/notification");
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 700);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <IonHeader>
      <IonToolbar>
        <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
          <div
            style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
            onClick={goToHome}
          >
            <img
              className="logoHeader"
              src={logo}
              alt="Logo"
              style={{
                width: "40px",
                height: "40px",
              }}
            />
            {!isMobile && (
              <IonTitle style={{ marginLeft: "10px" }}>ClipTask</IonTitle>
            )}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              flexGrow: 1,
              marginLeft: "20px",
            }}
          >
            <IonButton
              onClick={goToProjects}
              fill="clear"
              style={{ marginRight: "8px" }}
            >
              {isMobile ? <IonIcon icon={folder} /> : "Proyectos"}
            </IonButton>

            <IonButton
              onClick={goToNewProject}
              style={{
                backgroundColor: "blue",
                color: "white",
                marginRight: "8px",
              }}
            >
              {isMobile ? <IonIcon icon={add} /> : "Crear Proyecto"}
            </IonButton>

            <IonButton
              onClick={(e) => setPopoverEvent(e.nativeEvent)}
              fill="clear"
            >
              <IonIcon icon={search} />
            </IonButton>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <IonButton
              fill="clear"
              style={{ marginRight: "8px" }}
              onClick={goToNotifications}
            >
              <IonIcon icon={notifications} />
            </IonButton>
            <IonButton fill="clear">
              <IonIcon icon={person} />
            </IonButton>
          </div>
        </div>
      </IonToolbar>

      <IonPopover
        event={popoverEvent}
        isOpen={popoverEvent !== undefined}
        onDidDismiss={() => setPopoverEvent(undefined)}
      >
        <IonSearchbar
          value={searchText}
          onIonInput={(e) => setSearchText(e.detail.value!)}
          onIonClear={() => setSearchText("")}
          placeholder="Buscar..."
        />
      </IonPopover>
    </IonHeader>
  );
};

export default Header;
