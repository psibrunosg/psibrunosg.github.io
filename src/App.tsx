import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import VariantA from "./pages/VariantA";
import VariantB from "./pages/VariantB";
import VariantC from "./pages/VariantC";
import Compare from "./pages/Compare";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/a" element={<VariantA />} />
        <Route path="/b" element={<VariantB />} />
        <Route path="/c" element={<VariantC />} />
        <Route path="/compare" element={<Compare />} />
      </Routes>
    </BrowserRouter>
  );
}
