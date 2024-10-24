import { IonContent, IonPage, IonTitle } from "@ionic/react";
import Project from "../components/Project";
import "./Home.css";
import Task from "../components/Task";
import Header from "../components/Header";

const Home: React.FC = () => {
  return (
    <IonPage>
      <Header />

      <IonContent fullscreen>
        <h2>Hola, Usuario</h2>

        <h4>Elementos recientes</h4>
        <Project
          title="Proyecto 1"
          progress={25}
          totalTasks={8}
          completedTasks={2}
          isFavorite={true}
        />
        <Project
          title="Proyecto 2"
          progress={10}
          totalTasks={8}
          completedTasks={2}
          isFavorite={false}
        />

        <Task name="Nombre de la tarea" isCompleted={false} />
        <Task name="Nombre de la tarea" isCompleted={false} />
      </IonContent>
    </IonPage>
  );
};

export default Home;
