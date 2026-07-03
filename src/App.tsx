import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import VariantC from "./pages/VariantC";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Psicoeducacao from "./pages/Psicoeducacao";
import Exercicios from "./pages/Exercicios";
import ExerciciosRestritos from "./pages/ExerciciosRestritos";
import AcerteDistorcaoPage from "./pages/exercicios/AcerteDistorcaoPage";
import MuralhaEvidenciasPage from "./pages/exercicios/MuralhaEvidenciasPage";
import RegistroPage from "./pages/exercicios/RegistroPage";
import JardimPage from "./pages/exercicios/JardimPage";
import BaralhoAdultoPage from "./pages/exercicios/BaralhoAdultoPage";
import ParesMentePage from "./pages/exercicios/ParesMentePage";
import ChuvaPreocupacoesPage from "./pages/exercicios/ChuvaPreocupacoesPage";
import BalaoPensamentosPage from "./pages/exercicios/BalaoPensamentosPage";
import CacaFatosPage from "./pages/exercicios/CacaFatosPage";
import PacienteHub from "./pages/paciente/Hub";
import PHQ9 from "./pages/paciente/PHQ9";
import GAD7 from "./pages/paciente/GAD7";
import Escala from "./pages/paciente/Escala";
import BrunoPainel from "./pages/bruno/Painel";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<VariantC />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/psicoeducacao" element={<Psicoeducacao />} />
        <Route path="/exercicios" element={<Exercicios />} />
        <Route path="/exercicios/restritos" element={<ExerciciosRestritos />} />
        <Route path="/exercicios/acerte-distorcao" element={<AcerteDistorcaoPage />} />
        <Route path="/exercicios/muralha-evidencias" element={<MuralhaEvidenciasPage />} />
        <Route path="/exercicios/registro" element={<RegistroPage />} />
        <Route path="/exercicios/jardim" element={<JardimPage />} />
        <Route path="/exercicios/baralho-adulto" element={<BaralhoAdultoPage />} />
        <Route path="/exercicios/pares" element={<ParesMentePage />} />
        <Route path="/exercicios/chuva" element={<ChuvaPreocupacoesPage />} />
        <Route path="/exercicios/balao" element={<BalaoPensamentosPage />} />
        <Route path="/exercicios/fatos" element={<CacaFatosPage />} />
        <Route path="/paciente" element={<PacienteHub />} />
        <Route path="/paciente/phq9" element={<PHQ9 />} />
        <Route path="/paciente/gad7" element={<GAD7 />} />
        <Route path="/paciente/escala/:escalaId" element={<Escala />} />
        <Route path="/bruno/painel" element={<BrunoPainel />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}