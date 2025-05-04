import {Route, Routes} from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import IsAuth from "./components/utils/IsAuth";
import {observer} from "mobx-react-lite";
import UsersTablePage from "./pages/users/UsersTablePage";
import LogoutComponent from "./components/utils/LogoutComponent";
import Profile from "./pages/users/Profile";
import Settings from "./pages/users/Settings";
import Page404 from "./pages/Page404";
import UserDeleted from "./pages/UserDeleted";
import MainPage from "./pages/MainPage";
import AfterLoginPage from "./pages/auth/AfterLoginPage";
import MyServices from "./pages/My";
import ServicePage from "./pages/ServicePage";

function App() {
    return (
        <Routes>
            <Route path="/after-login" element={<AfterLoginPage />} />
            <Route path={'/login'} element={<LoginPage/>}/>
            <Route path={'/register'} element={<RegisterPage/>}/>
            <Route element={<IsAuth/>}>
                <Route path={'/services'} element={<MainPage/>}/>
                <Route path={'/'} element={<MainPage/>}/>
                <Route path={'/my'} element={<MyServices/>}/>
                <Route path={'/services/:id'} element={<ServicePage />} />

                <Route path={'/users/settings'} element={<Settings/>}/>
                <Route path={'/users/null'} element={<UserDeleted/>}/>
                <Route path={'/users/:username'} element={<Profile/>}/>

                <Route path={'/users'} element={<UsersTablePage/>}/>

                <Route path={'/404'} element={<Page404/>}/>

                <Route path={'/logout'} element={<LogoutComponent/>}/>
            </Route>
        </Routes>
    )
        ;
}

export default observer(App);
