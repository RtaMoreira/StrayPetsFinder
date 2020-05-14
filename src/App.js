import React from "react";
import "./App.css";
import ScreenAddLostReport from "./components/ScreenAddLostReport";
import ScreenMap from "./components/ScreenMap";
import ScreenSignUp from "./components/Auth/ScreenSignUp";
import ScreenSignIn from "./components/Auth/ScreenSignIn";
import ScreenPwForgot from "./components/Auth/ScreenPwForgot";
import ScreenAccount from "./components/ScreenAccount";
import ScreenEditReport from "./components/ScreenEditReport";
import Header from "./components/Header";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import theme from "./assets/AppTheme";
import { ThemeProvider } from "@material-ui/styles";
import {FirebaseContext,db,auth,storage} from "./firebaseConfig";
import useAuth from "./components/Auth/useAuth";


function App() {
const user = useAuth();
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <BrowserRouter>
        <FirebaseContext.Provider value={{user, db,auth,storage}}>
          <Header />
          <Switch>
            <Route exact path="/" component={ScreenMap} />
            <Route path="/addLostReport" component={ScreenAddLostReport} />
            <Route path="/signUp" component={ScreenSignUp} />
            <Route path="/signIn" component={ScreenSignIn} />
            <Route path="/recoverAccount" component={ScreenPwForgot} />
            <Route path="/account" component={ScreenAccount} />
            <Route path="/edit-report" component={ScreenEditReport} />

          </Switch>
          </FirebaseContext.Provider>
        </BrowserRouter>
      </ThemeProvider>
    </div>
  );
}

export default App;
