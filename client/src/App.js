import {Routes, Route, useLocation} from "react-router-dom";
import Signup from "./pages/Signup/Signup";
import Login from "./pages/Login/Login";
import Chat from "./pages/Chat/Chat";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage/HomePage";
import Header from "./components/Header/Header";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {closeMessage} from "./redux/actions/notificationActions";
import Preloader from "./components/Preloader/Preloader";
import Profile from "./pages/Profile/Profile";

function App() {

    const user = useSelector(state => state.user);
    const location = useLocation();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(closeMessage())
    }, [location]);


    return (
        <div className="App">
            <Header/>
            <Preloader show={user.isLoading}/>
            <Routes>
                <Route exact path="/" element={<HomePage/>}/>
                <Route exact path="/signup" element={<Signup/>}/>
                <Route exact path="/login" element={<Login/>}/>

                <Route exact path='/' element={<ProtectedRoute user={user}/>}>
                    <Route exact path="/chat" element={<Chat/>}/>
                    <Route exact path="/chat/:chatId" element={<Chat/>}/>
                    <Route exact path="/profile" element={<Profile/>}/>

                </Route>

            </Routes>
        </div>
    );
}

export default App;
