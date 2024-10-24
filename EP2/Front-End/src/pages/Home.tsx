import { IonContent, IonPage } from "@ionic/react";
import Project from "../components/Project";
import "./Home.css";
import Task from "../components/Task";
import Header from "../components/Header";

const Home: React.FC = () => {
  return (
    <IonPage>
      <Header />
      <IonContent fullscreen>
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
      </IonContent>
    </IonPage>
  );
};

export default Home;
