import React, { useRef, useEffect } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItemGroup, IonItemDivider, IonLabel, IonIcon, IonButtons, IonButton, IonAccordionGroup, IonAccordion, IonItem } from '@ionic/react';
import { personOutline, searchOutline, addOutline } from 'ionicons/icons';
import NavBar from '../../components/NavBar';
import Project from '../../components/Project';
import './Projects.css';




const ProjectsPage: React.FC = () => {

    const accordionGroup = useRef<null | HTMLIonAccordionGroupElement>(null);

        useEffect(() => {
            if (!accordionGroup.current) {
        return;
        }

        accordionGroup.current.value = ['Favoritos', 'Recientes', 'Todos'];
    }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="light"> 
          <IonButtons slot="start"> 
            <IonButton>
              <IonIcon icon={personOutline} />
            </IonButton>
          </IonButtons>
          <IonTitle> 
          </IonTitle>
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
      <IonContent>
<<<<<<< Updated upstream
        <IonAccordionGroup ref={accordionGroup} multiple={true}>
          {/* Sección Favoritos */}
=======
        <IonAccordionGroup  multiple={true}>
>>>>>>> Stashed changes
          <IonAccordion value='Favoritos'>
            <IonItem slot="header" color="light">
                <IonLabel>Favoritos</IonLabel>
            </IonItem>
            <div slot='content'>
                <Project title="Proyecto 1" progress={25} totalTasks={8} completedTasks={2} isFavorite={true} />
            </div>
          </IonAccordion>

          <IonAccordion value='Recientes'>
            <IonItem slot='header' color="light">
                <IonLabel>Recientes</IonLabel>
            </IonItem>
            <div slot='content'>
                <Project title="Proyecto 3" progress={33} totalTasks={3} completedTasks={1} isFavorite={false} />
            </div>
            
          </IonAccordion>

          <IonAccordion value='Todos'>
            <IonItem slot='header' color="light">
              <IonLabel>Todos los proyectos</IonLabel>
            </IonItem>
            <div slot='content'>
                <Project title="Proyecto 1" progress={25} totalTasks={8} completedTasks={2} isFavorite={true} />
                <Project title="Proyecto 2" progress={50} totalTasks={6} completedTasks={3} isFavorite={false} />
                <Project title="Proyecto 3" progress={33} totalTasks={3} completedTasks={1} isFavorite={false} />
                <Project title="Proyecto 4" progress={84} totalTasks={6} completedTasks={5} isFavorite={false} />
            </div>
          </IonAccordion>
        </IonAccordionGroup>
      </IonContent>
      <NavBar />
    </IonPage>
  );
};

export default ProjectsPage;
