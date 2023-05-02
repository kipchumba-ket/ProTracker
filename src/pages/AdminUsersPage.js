import AdminDashUsers from "../components/adminDashUsers/AdminDashUsers";
import Navbar from "../components/navBar/Navbar";
import Sidebar from "../components/sidebar/Sidebar";

function AdminUsersPage() {
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
          <AdminDashUsers/>
        </div>
      </div>
    </>
  );
}

export default AdminUsersPage;
