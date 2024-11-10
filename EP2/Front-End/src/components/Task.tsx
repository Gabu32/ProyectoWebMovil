import React, { useState } from "react";
import {
  IonCard,
  IonCardContent,
  IonIcon,
  IonLabel,
  IonCheckbox,
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import "./Task.css";

interface TaskProps {
  taskID: number;
  name: string;
  isCompleted: boolean;
  onClick: () => void;
}

const Task: React.FC<TaskProps> = ({
  name,
  isCompleted: initialCompleted,
  onClick,
}) => {
  const [isCompleted, setIsCompleted] = useState(initialCompleted);

  const toggleCompletion = () => {
    setIsCompleted((prev) => !prev);
  };

  const handleClick = () => {
    onClick();
  };

  return (
    <IonCard
      className={`task-card ${isCompleted ? "completed" : ""}`}
      onClick={handleClick}
    >
      <IonCardContent className="task-card-content">
        <div className="task-info">
          <div style={{ display: "flex", alignItems: "center" }}>
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
        </div>
      </IonCardContent>
    </IonCard>
  );
};

export default Task;
