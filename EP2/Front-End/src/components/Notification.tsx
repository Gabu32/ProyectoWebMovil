import React from "react";
import { IonCard } from "@ionic/react";

import "./Notification.css";

interface notificationProps {
  project?: string;
  task?: string;
  description: string;
  time: string;
  author?: string;
}

const Notification: React.FC<notificationProps> = ({
  project = "",
  task = "",
  description,
  time,
  author = "",
}) => {
  return (
    <IonCard className="notificationCard">
      <div className="notificationContent">
        <div className="leftSection">
          <h2>{project}</h2>
          <p>{description}</p>
        </div>
        <div className="rightSection">{task && <h3>{task}</h3>}</div>
      </div>
      <div className="footer">
        <p>{`Fecha: ${time}`}</p>
        {author && <p>{`Autor: ${author}`}</p>}
      </div>
    </IonCard>
  );
};

export default Notification;
