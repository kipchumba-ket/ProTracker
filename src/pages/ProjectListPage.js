import Navbar from "../components/navBar/Navbar";
import Sidebar from "../components/sidebar/Sidebar";
import UserProjectList from "../components/userprojectlist/userProjectList";


function ProjectListPage() {
  return (
    <>
      <div id="sidebar">
        <Sidebar/>
      </div>
      <div id="main-body">
        <div id="nav-row">
          <Navbar/>
        </div>
        <div id="body-row">
          <UserProjectList/>
        </div>
      </div>
    </>
  );
}

export default ProjectListPage;
