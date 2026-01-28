import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Betting from "./components/Betting";
import "./App.css";
import Circket from "./Games/Circket";
import Tennis from "./Games/Tennis";
import Soccer from "./Games/Soccer";
import Horse from "./Games/Horse";
import Grayhound from "./Games/Grayhound";
import Basketball from "./Games/Basketball";
import Lottery from "./Games/Lottery";
import Casino from "./Games/Casino";
import Games from "./components/Games";
import Blogs from "./pages/Blogs";
import SingleBlog from "./pages/SingleBlog";
import Market from "./Games/Market";
import Inplay from "./Games/Inplay";
import Login from "./pages/Login";
import Ballbyball from "./Games/Ballbyball";
import Profile from "./Account/Profile";
import Rolling from "./Account/Rolling";
import Statement from "./Account/Statement";
import Bethistory from "./Account/Bethistory";
import ProfitLoss from "./Account/ProfitLoss";
import PasswordHistory from "./Account/PasswordHistory";
import Activity from "./Account/Activity";
import Soccerbet from "./Games/Soccerbet";
import Horsebet from "./Games/Horsebet";
import Greyhoundbet from "./Games/Greyhoundbet";
import Tennisbet from "./Games/Tennisbet";
import Basketballbet from "./Games/Basketballbet";
import MobileNavigation from "./components/MobileNav";
import Account from "./pages/Account";
import Sports from "./pages/Sports";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cricketbet from "./Games/Cricketbet";
import PrivateRoute from "./redux/PrivateRoute";
import Events from "./Account/Events";
import EventMatches from "./Account/EventMatches";
import ProfitHistory from "./Account/ProfitHistory";
import OpenBet from "./pages/OpenBet";
import Register from "./pages/Regiterpage";
import ForgotPassword from "./pages/Forgetpassword";
import Casinogame from "./Games/Casinogame";
import Originalgames from "./Games/Originalgames";
import GameProviders from "./components/GameProviders";
import Gamesections from "./components/Gamesections";
import GamePlayer from "./components/GamePlayer";

function App() {
  return (
    <Router>
      <Routes>
        {/* ================= PUBLIC ROUTES WITHOUT LAYOUT ================= */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        {/* ================= MAIN LAYOUT ROUTES ================= */}
        <Route path="/*" element={
          <div className="flex flex-col">
            <Navbar />
            <MobileNavigation />
            <div className="flex flex-1 relative">
              {/* Sidebar nav */}
              <Sidebar />

              {/* Main Content */}
              <div className="flex-1 md:p-2 w-[55%]">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/in-play" element={<Inplay />} />
                  <Route path="/cricket" element={<Circket />} />
                  <Route path="/tennis" element={<Tennis />} />
                  <Route path="/soccer" element={<Soccer />} />
                  <Route path="/live-casinogame" element={<Casinogame />} />
                  <Route path="/originalgames" element={<Originalgames />} />

                  <Route path="/provider" element={<GameProviders />} />
 
        <Route path="/games/:providerId" element={<Gamesections />} />
      
        <Route path="/play/:gameId" element={<GamePlayer />} />
                  
                  {/* ================= PROTECTED ROUTES ================= */}
                  <Route element={<PrivateRoute />}>
                    <Route path="/horse-racing" element={<Horse />} />
                    <Route path="/greyhound-racing" element={<Grayhound />} />
                    <Route path="/basketball" element={<Basketball />} />
                    <Route path="/lottery" element={<Lottery />} />
                    <Route path="/live-casino" element={<Games />} />
                    <Route path="/tips-previews" element={<Blogs />} />
                    <Route path="/blog/:id" element={<SingleBlog />} />
                    <Route path="/multi-markets" element={<Market />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/rolling" element={<Rolling />} />
                    <Route path="/statement" element={<Statement />} />
                    <Route path="/bet-history" element={<Bethistory />} />
                    <Route path="/p&l" element={<ProfitLoss />} />
                    <Route path="/event/:id" element={<Events />} />
                    <Route path="/event-matches/:id" element={<EventMatches />} />
                    <Route path="/profit-history/:id" element={<ProfitHistory />} />
                    <Route path="/passhistory" element={<PasswordHistory />} />
                    <Route path="/activity" element={<Activity />} />
                    <Route path="/soccerbet/:match/:gameid" element={<Soccerbet />} />
                    <Route path="/horsebet" element={<Horsebet />} />
                    <Route path="/greyhound-bet" element={<Greyhoundbet />} />
                    <Route path="/tennis-bet/:match/:gameid" element={<Tennisbet />} />
                    <Route path="/cricket-bet/:match/:gameid" element={<Cricketbet />} />
                    <Route path="/basketball-bet" element={<Basketballbet />} />
                    <Route path="/ballbyball" element={<Ballbyball />} />
                    <Route path="/account" element={<Account />} />
                    <Route path="/sports" element={<Sports />} />
                    <Route path="/open-bet" element={<OpenBet />} />
                    
                    
                  </Route>
                </Routes>
              </div>

              {/* Running Bets Section */}
              <Betting />
            </div>
            <ToastContainer
              position="top-right"
              autoClose={800}
              hideProgressBar={true}
              newestOnTop={false}
              closeOnClick={true}
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
            />
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;