import CohortList from "../components/CohortList/cohortlist";
import Navbar from "../components/navBar/Navbar";
import Sidebar from "../components/sidebar/Sidebar";

function CohortLisPage() {
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
          <CohortList/>
        </div>
      </div>
    </>
  );
}

export default CohortLisPage;
