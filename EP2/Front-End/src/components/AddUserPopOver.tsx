// AddUserPopover.tsx
import React, { useState } from "react";
import {
  IonButton,
  IonInput,
  IonPopover,
  IonItem,
  IonLabel,
} from "@ionic/react";
import axios from "axios";

interface AddUserPopoverProps {
  isOpen: boolean;
  onDidDismiss: () => void;
  projectId: string;
  onUserAdded: () => void;
}

const AddUserPopover: React.FC<AddUserPopoverProps> = ({
  isOpen,
  onDidDismiss,
  projectId,
  onUserAdded,
}) => {
  const [email, setEmail] = useState("");

  const handleAddUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:5000/api/proyectos/${projectId}/usuarios`,
        { email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Usuario agregado exitosamente");
      setEmail("");
      onUserAdded();
      onDidDismiss();
    } catch (error) {
      console.error("Error al agregar usuario:", error);
      alert("No se pudo agregar el usuario. Verifica que el correo es válido.");
    }
  };

  return (
    <IonPopover isOpen={isOpen} onDidDismiss={onDidDismiss}>
      <IonItem>
        <IonLabel position="stacked">Correo del usuario a agregar</IonLabel>
        <IonInput
          value={email}
          placeholder="usuario@example.com"
          onIonChange={(e) => setEmail(e.detail.value!)}
          type="email"
        />
      </IonItem>
      <IonButton expand="block" onClick={handleAddUser}>
        Invitar
      </IonButton>
    </IonPopover>
  );
};

export default AddUserPopover;
