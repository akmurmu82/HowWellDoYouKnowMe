import { Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
// import MCQs from './components/MCQs'; // Adjust the path as needed

function AllRoutes() {

    // const currentUser = JSON.parse(localStorage.getItem("currentUser"))
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} /> {/* Route for the landing page */}
            {/* <Route path="/mcqs" element={<MCQs />} />
            <Route path="/leaderboard" element={<Leaderboard currentUser={currentUser} />} /> */}
        </Routes>
    );
}

export default AllRoutes;