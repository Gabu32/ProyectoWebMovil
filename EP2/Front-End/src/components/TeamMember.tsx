import React from "react";
import { IonIcon, IonItem, IonLabel } from "@ionic/react";
import { closeCircleOutline, person, trash } from "ionicons/icons";
import { IonButton } from "@ionic/react";

import "./TeamMember.css";

interface TeamProps {
  name: string;
  role: string;
  canDelete: boolean;
  onDelete: () => void;
}

const TeamMember: React.FC<TeamProps> = ({
  name,
  role,
  canDelete,
  onDelete,
}) => {
  return (
    <IonItem className="team-member" lines="none">
      <IonIcon icon={person} />
      <div className="label-container">
        <IonLabel>
          {name} ({role})
        </IonLabel>
        {canDelete && (
          <IonButton color="danger" onClick={onDelete}>
            <IonIcon icon={trash} size="large" />
          </IonButton>
        )}
      </div>
    </IonItem>
  );
};

export default TeamMember;
