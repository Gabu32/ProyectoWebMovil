import React from 'react';
import { IonTabButton, IonTabBar, IonLabel, IonIcon } from '@ionic/react';
import { homeOutline, folderOutline, notificationsOutline } from 'ionicons/icons';
import './navBar.css'

interface ContainerNavBar { }

const NavBar: React.FC<ContainerNavBar> = () => {
  return (
    <IonTabBar slot="bottom">
        <IonTabButton tab="home" href="/home">
            <IonIcon icon={homeOutline} />
            <IonLabel>Inicio</IonLabel>
        </IonTabButton>
        <IonTabButton tab="projects" href="/projects">
            <IonIcon icon={folderOutline} />
            <IonLabel>Proyectos</IonLabel>
        </IonTabButton>
        <IonTabButton tab="notifications" href="/notifications">
            <IonIcon icon={notificationsOutline} />
            <IonLabel>Notis.</IonLabel>
        </IonTabButton>
    </IonTabBar>
    );
};

export default NavBar;