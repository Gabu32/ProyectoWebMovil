import React, { useState } from "react";
import { IonButton, IonCard, IonCardContent, IonIcon, IonLabel } from "@ionic/react";
import {
  star,
  starOutline,
  documentTextOutline,
  peopleOutline,
} from "ionicons/icons";
import { useHistory } from 'react-router-dom';
import "./Project.css";

interface ProjectProps {
  id: number;
  title: string;
  progress: number;
  totalTasks: number;
  completedTasks: number;
  es_favorito: boolean;
  onClick: () => void;
}

const Project: React.FC<ProjectProps> = ({
  id,
  title,
  progress,
  totalTasks,
  completedTasks,
  es_favorito,
  onClick,
}) => {
  const [isFav, setIsFav] = useState(es_favorito);

  const toggleFavorite = () => {
    setIsFav((prev) => !prev);
  };
  
  const history = useHistory();

  const handleCardClick = () => {
    onClick();
  };

  return (
    <IonCard className="projectCard" onClick={handleCardClick}>
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
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite();
          }}
        />
      </IonCardContent>
    </IonButton>
  );
};

export default Project;
