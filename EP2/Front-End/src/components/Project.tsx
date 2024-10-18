import React, { useState } from "react";
import { IonCard, IonCardContent, IonIcon, IonLabel } from "@ionic/react";
import {
  star,
  starOutline,
  documentTextOutline,
  peopleOutline,
} from "ionicons/icons";
import "./Project.css";

interface ProjectProps {
  title: string;
  progress: number;
  totalTasks: number;
  completedTasks: number;
  isFavorite: boolean;
}

const Project: React.FC<ProjectProps> = ({
  title,
  progress,
  totalTasks,
  completedTasks,
  isFavorite,
}) => {
  const [isFav, setIsFav] = useState(isFavorite);

  const toggleFavorite = () => {
    setIsFav((prev) => !prev);
  };

  return (
    <IonCard className="projectCard">
      <IonCardContent className="projectCardContent">
        <div className="projectInfo">
          <IonLabel className="projectTitle">{title}</IonLabel>
          <div className="projectDetails">
            <IonIcon icon={documentTextOutline} />
            <span>
              {completedTasks}/{totalTasks}
            </span>
            <IonIcon icon={peopleOutline} />
            <span>{progress}%</span>
          </div>
        </div>
        <IonIcon
          icon={isFav ? star : starOutline}
          className="favoriteIcon"
          onClick={toggleFavorite}
          style={{ cursor: "pointer" }}
        />
      </IonCardContent>
    </IonCard>
  );
};

export default Project;
