import Activities from "../components/Activities";
import Navbar from "../components/navBar/Navbar";
import Sidebar from "../components/sidebar/Sidebar";


function ActivitiesPage() {
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
          <Activities/>
        </div>
      </div>
    </>
  );
}

export default ActivitiesPage;
