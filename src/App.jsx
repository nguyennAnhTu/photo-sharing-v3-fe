import { Grid, Typography, Paper } from "@mui/material";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Outlet,
} from "react-router-dom";
import "./App.css";
import { useState, useEffect } from "react";
import LoginRegister from "./components/LoginRegister";
import UserList from "./components/UserList";
import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserPhotos from "./components/UserPhotos";
import fetchModel from "./libs/fetchModelData";

const App = (props) => {
  const [loginUser, setLoginUser] = useState(null);
  const [error, setError] = useState();

  console.log(`user: ${loginUser}`);

  const userIdCookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("user_id="))
    ?.split("=")[1];
  console.log(userIdCookie);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchModel(`api/user/${userIdCookie}`, "GET");
        const user = await response.json();
        setLoginUser(user);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("An error occurred while fetching the data.");
      }
    };
    fetchData();
  }, [userIdCookie]);

  return (
    <Router>
      <div>
        <Grid container spacing={10}>
          <Grid item xs={12}>
            <TopBar onLogin={setLoginUser} loginUser={loginUser} />
          </Grid>
          {!!loginUser && (
            <Grid item sm={2}>
              <Paper>
                <UserList loginUser={loginUser} />
              </Paper>
            </Grid>
          )}
          <Grid item sm={!!loginUser ? 10 : 12}>
            <div>
              <Routes>
                <Route
                  path={"/login-register"}
                  element={
                    <LoginRegister
                      onLogin={setLoginUser}
                      loginUser={loginUser}
                    />
                  }
                />
                <Route
                  path={"/users/:userId"}
                  element={<UserDetail loginUser={loginUser} />}
                />
                <Route
                  path="/photos/:userId"
                  element={<UserPhotos loginUser={loginUser} />}
                />
                <Route
                  path="/users"
                  element={<UserList loginUser={loginUser} />}
                />
                <Route
                  path="/*"
                  element={
                    <LoginRegister
                      onLogin={setLoginUser}
                      loginUser={loginUser}
                    />
                  }
                />
              </Routes>
            </div>
          </Grid>
        </Grid>
      </div>
    </Router>
  );
};

export default App;
