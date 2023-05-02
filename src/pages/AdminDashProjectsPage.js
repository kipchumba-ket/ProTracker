import AdminDashProjects from "../components/AdminDashProjects";
import Navbar from "../components/navBar/Navbar";
import Sidebar from "../components/sidebar/Sidebar";

function AdminDashProjectsPage() {
  return (
    <>
      <div id="sidebar">
        <Sidebar />
      </div>
      <div id="main-body">
        <div id="nav-row">
          <Navbar />
        </div>
        <div id="body-row">
          <AdminDashProjects />
        </div>
      </div>
    </>
  );
}

export default AdminDashProjectsPage;
