import Navbar from "../components/navBar/Navbar";
import Projectdetails from "../components/projectdetails/Projectdetails";
import Sidebar from "../components/sidebar/Sidebar";


function ProjectDetailsPage() {
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
          <Projectdetails/>
        </div>
      </div>
    </>
  );
}

export default ProjectDetailsPage;
