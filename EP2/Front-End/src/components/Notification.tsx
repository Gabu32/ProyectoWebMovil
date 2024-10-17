import React, { useState } from "react";
import { IonCard, IonCardContent, IonContent, IonIcon, IonLabel } from "@ionic/react";
import {
  star,
  starOutline,
  documentTextOutline,
  peopleOutline,
} from "ionicons/icons";
import "./Notification.css";

interface notificationProps {
    project: string;
    task: string;
    description: string;
    time: string;
    author: string;
  }

const Notification: React.FC<notificationProps> = ({project, task, description, time, author}) => {
    return (
    <IonContent>
        <IonLabel  className="container">
        <div className="notification">
          <div className="notificationContent">
            <div className="leftSection">
              <h2>{project}</h2>
              <p>{description}</p>
            </div>
            <div className="rightSection">
              <h3>{task}</h3>
            </div>
          </div>
          <div className="footer">
            <p>Hora: {time}</p>
            <p>Autor: {author}</p>
          </div>
        </div>
        </IonLabel>
    </IonContent>    
    );
};

export default Notification;