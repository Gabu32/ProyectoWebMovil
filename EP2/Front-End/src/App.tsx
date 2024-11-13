import { Redirect, Route } from "react-router-dom";
import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import Home from "./pages/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Landing from "./pages/Landing/Landing";
import ProjectsList from "./pages/ProjectList/ProjectsList";
import CreateProject from "./pages/CreateProject/CreateProject";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Ionic Dark Mode */
import "@ionic/react/css/palettes/dark.system.css";

/* Theme variables */
import "./theme/variables.css";
import ProjectPage from "./pages/ProjectPage/ProjectPage";
import Notifications from "./pages/Notifications/Notifications";
import CreateTask from "./pages/CreateTask/CreateTask";
import TaskPage from "./pages/TaskPage/TaskPage";

setupIonicReact();

const App: React.FC = () => {
  const isAuthenticated = !!localStorage.getItem("token");
  //const isAuthenticated = 1;
  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          {/* Rutas */}
          <Route exact path="/login">
            <Login />
          </Route>
          <Route exact path="/register">
            <Register />
          </Route>
          <Route exact path="/landing">
            <Landing />
          </Route>
          <Route exact path="/projects">
            {isAuthenticated ? <ProjectsList /> : <Redirect to="/landing" />}
          </Route>
          <Route exact path="/create-project">
            {isAuthenticated ? <CreateProject /> : <Redirect to="/landing" />}
          </Route>
          <Route exact path="/task/:projectId/:id">
            <TaskPage />
          </Route>
          <Route exact path="/create-task/:id">
            <CreateTask />
          </Route>
          <Route exact path="/notification">
            <Notifications />
          </Route>
          <Route exact path="/project/:id">
            <ProjectPage />
          </Route>

          <Redirect
            exact
            from="/"
            to={isAuthenticated ? "/projects" : "/landing"}
          />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
