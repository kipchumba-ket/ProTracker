import { Route, RouterProvider, Routes } from "react-router-dom";
import "./App.css";
import CohortList from "./components/CohortList/cohortlist";
import Navbar from "./components/navBar/Navbar";
import Sidebar from "./components/sidebar/Sidebar";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import { Provider } from "react-redux";
import store from "./components/store.js";
import { Switch } from "react-router-dom/cjs/react-router-dom.min";
import EmailEntry from "./components/passwordReset/emailEntry";
import NewPasswordEntry from "./components/passwordReset/newPasswordEntry";
import ProjectListPage from "./pages/ProjectListPage";
import ProjectDetailsPage from "./pages/ProjectDetailsPage";
import AdminDashProjectsPage from "./pages/AdminDashProjectsPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import CohortListPage from "./pages/CohortListPage";
import ActivitiesPage from "./pages/ActivitiesPage";
import AdminDashCohortsPage from "./pages/AdminCohortsPage";
import UserBioPage from "./pages/UserBioPage";
import PrivateRoute from "./PrivateRoute";
import Toast from "./components/toast/toast";

function App() {
  let token = localStorage.getItem("jwt");

  let isAuthenticated = token ? true : false;

  return (
    // <Login/>
    <Provider store={store}>
      <div className="app">
        <Toast />
        <Switch>
          <Route exact path="/">
            <div id="login-page">
              <Login />
            </div>
          </Route>

          <Route exact path="/signup">
            <div id="login-page">
              <SignUp />
            </div>
          </Route>

          <Route exact path="/emailentry">
            <div id="login-page">
              <EmailEntry />
            </div>
          </Route>

          <Route exact path="/newpass">
            <div id="login-page">
              <NewPasswordEntry />
            </div>
          </Route>

          <PrivateRoute
            path="/projectList"
            component={ProjectListPage}
            isAuthenticated={isAuthenticated}
          />

          <PrivateRoute
            path="/projectdetails"
            component={ProjectDetailsPage}
            isAuthenticated={isAuthenticated}
          />

          <PrivateRoute
            path="/adminprojects"
            component={AdminDashProjectsPage}
            isAuthenticated={isAuthenticated}
          />

          <PrivateRoute
            path="/adminusers"
            component={AdminUsersPage}
            isAuthenticated={isAuthenticated}
          />

          <Route path="/cohortlist">
            <div id="sidebar">
              <Sidebar />
            </div>
            <div id="main-body">
              <div id="nav-row">
                <Navbar />
              </div>
              <div id="body-row">
                <CohortList />
              </div>
            </div>
          </Route>

          <PrivateRoute
            path="/activities"
            component={ActivitiesPage}
            isAuthenticated={isAuthenticated}
          />
          <PrivateRoute
            path="/admincohorts"
            component={AdminDashCohortsPage}
            isAuthenticated={isAuthenticated}
          />
          <PrivateRoute
            path="/userProfile"
            component={UserBioPage}
            isAuthenticated={isAuthenticated}
          />
        </Switch>
      </div>
    </Provider>
  );
}
export default App;
