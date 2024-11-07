import { Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import MCQs from './MCQs';
import LeaderBoard from './Leaderboard';

function AllRoutes() {

    const currentUser = JSON.parse(localStorage.getItem("currentUser"))
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} /> {/* Route for the landing page */}
            <Route path="/mcqs" element={<MCQs />} />
            <Route path="/leaderboard" element={<LeaderBoard currentUser={currentUser} />} />
        </Routes>
    );
}

export default AllRoutes;