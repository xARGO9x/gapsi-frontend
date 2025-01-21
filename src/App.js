import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import "./App.css";
import trash from "../src/assets/three-dots-vertical.svg";
import logoGapsi from "../src/assets/logo-gapsi.png";
import MenuHeader from "./components/MenuHeader";
import WelcomeMessage from "./components/WelcomeMessage";
import FooterVersion from "./components/FooterVersion";
import ProviderList from "./pages/ProviderList";

function App() {
  return (
    <Router>
      <div className="App" style={{ height: "100vh", overflow: "hidden" }}>
        <MenuHeader logo={logoGapsi} iconMenu={trash} />
        <div
          style={{
            marginTop: "55px",
            marginLeft: "10px",
            marginRight: "10px",
            height: "92%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Routes>
            <Route path="/" element={<WelcomeMessage logo={logoGapsi} />} />
            <Route path="/provider-list" element={<ProviderList />} />
          </Routes>
          <FooterVersion />
        </div>
      </div>
    </Router>
  );
}

export default App;
