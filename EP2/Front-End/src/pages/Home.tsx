import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonIcon,
  IonButtons,
  IonButton,
} from "@ionic/react";
import NavBar from "../components/NavBar";
import Project from "../components/Project";
import { personOutline, searchOutline, addOutline } from "ionicons/icons";
import "./Home.css";
import Task from "../components/Task";

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="light">
          <IonButtons slot="start">
            <IonButton>
              <IonIcon icon={personOutline} />
            </IonButton>
          </IonButtons>
          <IonTitle></IonTitle>
          <IonButtons slot="end">
            <IonButton>
              <IonIcon icon={searchOutline} />
            </IonButton>
            <IonButton>
              <IonIcon icon={addOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Blank</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
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
        <IonContent>
          <Task title="Taks 1" isFavorite={true} />
        </IonContent>
      </IonContent>
      <NavBar />
    </IonPage>
  );
};

export default Home;
