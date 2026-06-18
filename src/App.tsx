import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import VariantC from "./pages/VariantC";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<VariantC />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
