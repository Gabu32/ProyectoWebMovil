import React, { useState } from "react";
import {
  IonCard,
  IonCardContent,
  IonIcon,
  IonLabel,
  IonCheckbox,
} from "@ionic/react";
import {
  checkmarkCircleOutline,
  createOutline,
  star,
  starOutline,
} from "ionicons/icons";
import "./Task.css";

interface TaskProps {
  name: string;
  isCompleted: boolean;
}

const Task: React.FC<TaskProps> = ({ name, isCompleted: initialCompleted }) => {
  const [isCompleted, setIsCompleted] = useState(initialCompleted);
  const [isFav, setIsFav] = useState(false);

  const toggleCompletion = () => {
    setIsCompleted((prev) => !prev);
  };

  const toggleFavorite = () => {
    setIsFav((prev) => !prev);
  };

  return (
    <IonCard className={`task-card ${isCompleted ? "completed" : ""}`}>
      <IonCardContent className="task-card-content">
        <div className="task-info">
          <div style={{ display: "flex", alignItems: "center" }}>
            <IonCheckbox checked={isCompleted} onIonChange={toggleCompletion} />
            <IonLabel
              className="task-name"
              style={
                isCompleted
                  ? { textDecoration: "line-through", color: "gray" }
                  : {}
              }
            >
              {name}
            </IonLabel>
          </div>
          {!isCompleted && (
            <IonIcon
              icon={isFav ? star : starOutline}
              className="favorite-icon"
              onClick={toggleFavorite}
              style={{
                cursor: "pointer",
                marginLeft: "8px",
                color: isFav ? "gold" : "gray",
              }}
            />
          )}
        </div>
      </IonCardContent>
    </IonCard>
  );
};

export default Task;
