import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import VariantC from "./pages/VariantC";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<VariantC />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}