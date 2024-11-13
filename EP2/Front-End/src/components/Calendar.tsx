import React, { useState } from "react";
import { IonDatetime, IonButton, useIonRouter } from "@ionic/react";
import "./Calendar.css"; // Archivo CSS para el estilo

const Calendar: React.FC<{ tasks: any[]; proyecto_id: number }> = ({
  tasks,
  proyecto_id,
}) => {
  const [selectedDate, setSelectedDate] = useState<string | undefined>();
  const router = useIonRouter();

  const pendingTasksDates = tasks
    .filter((task) => !task.completado)
    .map((task) => task.fecha_vencimiento.split("T")[0]);

  const handleDateChange = (e: any) => {
    setSelectedDate(e.detail.value);
    const selectedTask = tasks.find(
      (task) =>
        task.fecha_vencimiento.split("T")[0] === e.detail.value.split("T")[0]
    );
    if (selectedTask) {
      console.log("OPUREBASBD", selectedTask);
      router.push(`/task/${proyecto_id}/${selectedTask.id}`);
    }
  };

  return (
    <IonDatetime
      preferWheel={false}
      presentation="date"
      value={selectedDate}
      onIonChange={handleDateChange}
      highlightedDates={pendingTasksDates.map((date) => ({
        date,
        textColor: "#800080",
        backgroundColor: "#ffc0cb",
      }))}
    />
  );
};

export default Calendar;
