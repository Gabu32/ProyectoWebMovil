import React from 'react';
import { IonCard, IonIcon, IonLabel } from '@ionic/react';
import { personCircle, starOutline, star } from 'ionicons/icons';
import './Task.css';

interface TaskProps {
    title: string;
    isFavorite: boolean
  }

const Task: React.FC<TaskProps> = ({title, isFavorite}) => {
  return (
    <IonCard className="task-item">
        <IonIcon icon={personCircle} className="icon" />
        <IonLabel className="task-tittle">
            <h2>{title}</h2>
        </IonLabel>
      
        <IonIcon icon={isFavorite ? star : starOutline} className="star-icon" />
    </IonCard>
  );
};

export default Task;
