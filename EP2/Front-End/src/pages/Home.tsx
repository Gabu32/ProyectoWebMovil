import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import NavBar from '../components/NavBar';
import Project from '../components/Project';
import './Home.css';
import Task from '../components/Task';

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Blank</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Blank</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <Project title="Proyecto 1" progress={25} totalTasks={8} completedTasks={2} isFavorite={true} />
          <Project title="Proyecto 2" progress={10} totalTasks={8} completedTasks={2} isFavorite={false} />
        </IonContent>
        <IonContent>
          <Task title='Taks 1' isFavorite={true}/>
        </IonContent>
      </IonContent>
      <NavBar />
    </IonPage>
  );
};

export default Home;
