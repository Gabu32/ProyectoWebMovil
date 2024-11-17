import React, { useState } from "react";
import { IonCard, IonCardContent, IonIcon, IonLabel } from "@ionic/react";
import {
  star,
  starOutline,
  documentTextOutline,
  peopleOutline,
} from "ionicons/icons";
import "./Project.css";
import axios from "axios";

interface ProjectProps {
  id: number;
  title: string;
  progress: number;
  totalTasks: number;
  completedTasks: number;
  es_favorito: boolean;
  onClick: () => void;
  onFavoriteToggle: (id: number, es_favorito: boolean) => void;
}

const Project: React.FC<ProjectProps> = ({
  id,
  title,
  progress,
  totalTasks,
  completedTasks,
  es_favorito,
  onClick,
  onFavoriteToggle,
}) => {
  const toggleFavorite = async () => {
    try {
      const token = localStorage.getItem("token");
      const newFavState = !es_favorito;
      const response = await axios.put(
        `http://localhost:5000/api/proyectos/${id}/favorite`,
        { es_favorito: newFavState },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        onFavoriteToggle(id, newFavState);
      }
    } catch (error) {
      console.error("Error al actualizar favorito:", error);
    }
  };

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
            <span>{progress.toFixed(1)}%</span>
          </div>
        </div>
        <IonIcon
          icon={es_favorito ? star : starOutline}
          className="favoriteIcon"
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite();
          }}
        />
      </IonCardContent>
    </IonCard>
  );
};

export default Project;
