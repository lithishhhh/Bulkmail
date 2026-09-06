import { BrowserRouter, Routes, Route } from "react-router-dom";

import AdminLogin from "./pages/AdminLogin";
import BulkMail from "./pages/Bulkmail";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Admin Login */}
        <Route path="/" element={<AdminLogin />} />

        {/* BulkMail Dashboard */}
        <Route path="/dashboard" element={<BulkMail />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;