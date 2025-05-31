import { Grid, Typography, Paper } from "@mui/material";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Outlet,
} from "react-router-dom";
import "./App.css";
import { useState, useEffect,  } from "react";
import LoginRegister from "./components/LoginRegister";
import UserList from "./components/UserList";
import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserPhotos from "./components/UserPhotos";
import fetchModel from "./libs/fetchModelData";

const Layout = (props) => {
    return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TopBar />
        </Grid>
        <div className="main-topbar-buffer" />
        <Grid item sm={3}>
          <Paper className="main-grid-item">
            <UserList loginUser={props.loginUser}/>
          </Paper>
        </Grid>
        <Grid item sm={9}>
          <Paper className="main-grid-item">
            <Outlet />
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}

const App = (props) => {
    const [loginUser, setLoginUser] = useState(null);
    const [error, setError] = useState();

    console.log(`user: ${loginUser}`);

    const userIdCookie = document.cookie
    .split('; ')
    .find(row => row.startsWith('user_id='))
    ?.split('=')[1];
    console.log(userIdCookie);
    useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchModel(
          `api/user/${userIdCookie}`, "GET"
        );
        const user = await response.json();
        setLoginUser(user);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("An error occurred while fetching the data.");
      }
    };
    fetchData();
  }, [userIdCookie]);
    // return (
    //     <Router>
    //       <Routes>
    //         <Route path="/" element={<Layout loginUser={loginUser}/>}>
    //           <Route path="/users" element={<UserList loginUser={loginUser}/>}></Route>
    //           <Route path="/users/:userId" element={<UserDetail loginUser={loginUser} />} />
    //           <Route path="/login-register" element={<LoginRegister onLogin={setLoginUser} loginUser={loginUser} />} />
    //         </Route>
    //       </Routes>
    //     </Router>
    // )
    return (
      <Router>
        <div className='roott'>
          <Grid container spacing={10}>
            <Grid item xs={12} className="topbar-sticky" >
              <TopBar 
                onLogin={setLoginUser} 
                //onPhotoUpload={handlePhotoUpload} 
                loginUser={loginUser}
                
              />
            </Grid>
              {!!loginUser && (<Grid item sm={2}>
                <Paper className="main-grid-item">
                  <UserList loginUser={loginUser} />
                </Paper>
              </Grid>)}
            <Grid item sm={!!loginUser ? 10 : 12} >
              <div className="main-grid-item ">
                  <Routes>
                    <Route
                        path={"/login-register"}
                        element = {<LoginRegister onLogin={setLoginUser} loginUser={loginUser}/>}
                    /> 
                    <Route
                        path={"/users/:userId"}
                        element = {<UserDetail 
                          loginUser={loginUser} 
                        />}
                    />
                    <Route
                        path="/photos/:userId"
                        element = {<UserPhotos 
                          loginUser={loginUser}
                          //photoIsUploaded={uploadedPhoto}
                          />}
                    />
                    <Route path="/users" element={<UserList loginUser={loginUser}/>} />
                    <Route path="/*" element = {<LoginRegister onLogin={setLoginUser} loginUser={loginUser}/>} />
                  </Routes>            
              </div>
            </Grid>
          </Grid>
        </div>
      </Router>
  );
}

export default App;