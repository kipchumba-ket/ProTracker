import Navbar from "../components/navBar/Navbar";
import Sidebar from "../components/sidebar/Sidebar";
import UserBio from "../components/userBio/UserBio";


function UserBioPage() {
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
          <UserBio />
        </div>
      </div>
    </>
  );
}

export default UserBioPage;
