import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./LandingPage";
import Register from "./Register";
import OrderMedicine from "./OrderMedicine";
import Supply from "./Supply";
import Track from "./Track";
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 overflow-y-hidden">
        <Header />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/order-medicine" element={<OrderMedicine />} />
          <Route path="/control-supply-chain" element={<Supply />} />
          <Route path="/track-medicine" element={<Track />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
