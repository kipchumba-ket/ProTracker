import AdminDashCohorts from "../components/AdminDashCohorts";
import Navbar from "../components/navBar/Navbar";
import Sidebar from "../components/sidebar/Sidebar";

function AdminDashCohortsPage() {
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
          <AdminDashCohorts />
        </div>
      </div>
    </>
  );
}

export default AdminDashCohortsPage;
