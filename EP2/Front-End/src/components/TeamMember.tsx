import React from "react";
import { IonIcon, IonItem, IonLabel } from "@ionic/react";
import { person } from "ionicons/icons";

import "./TeamMember.css";

interface TeamProps {
  name: string;
  role: string;
}

const TeamMember: React.FC<TeamProps> = ({ name, role }) => {
  return (
    <IonItem className="team-member">
      <IonIcon icon={person} />
      <IonLabel>
        <div>
          {name} ({role})
        </div>
        <div>Permisos ▼</div>
      </IonLabel>
    </IonItem>
  );
};

export default TeamMember;
