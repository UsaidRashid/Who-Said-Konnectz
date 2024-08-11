import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import profile from "../Images/profile.png";

export default function Header() {
  const navigate = useNavigate();
  async function logout() {
    try {
      const response = await axios.get("http://localhost:3002/logout");

      if (response.status === 200) {
        localStorage.removeItem("token");
        alert(response.data.message);
        navigate("/");
      } else {
        alert("Unexpected status code: " + response.status);
      }
    } catch (error) {
      console.error("Error logging out:", error);
      if (error.response) {
        alert(
          "Error from server: " +
            error.response.status +
            " - " +
            error.response.data.message
        );
      } else if (error.request) {
        alert("No response from the server");
      } else {
        alert("Error setting up the request: " + error.message);
      }
    }
  }

  return (
    <div className=" bg-emerald-400 py-6 border-b-4 border-emerald-500 fixed top-0 w-full z-10">
      <nav class="navbar navbar-expand-lg bg-emerald-400">
        <div className="d-flex flex-column w-100">
          <h1 className="ms-12 text-white text-5xl">Who-Said Konnectz</h1>
          <p className="ms-96 text-white">Connecting Forever...</p>
        </div>
        <div className="d-flex flex-row w-50 justify-content-evenly me-5">
          {localStorage.getItem("token") ? (
            // <div className="d-flex flex-row justify-content-evenly w-50">
            <button
              className="btn btn-danger rounded-pill w-50"
              onClick={logout}
            >
              Log out
            </button>
          ) : (
            // </div>
            <button
              className="btn btn-success rounded-pill w-50"
              onClick={() => navigate("/login")}
            >
              Log in
            </button>
          )}
          <Link class="nav-link text-dark fs-s" to="/profile">
            {" "}
            <img
              className=" bottom-0 start-0"
              src={profile}
              style={{
                height: "50px",
                width: "50px",
                borderRadius: "50px",
              }}
            />
          </Link>
        </div>
      </nav>
    </div>
  );
}
