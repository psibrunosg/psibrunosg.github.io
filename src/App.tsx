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
import BalancaPage from "./pages/exercicios/BalancaPage";
import RoletaPage from "./pages/exercicios/RoletaPage";
import TrilhaPage from "./pages/exercicios/TrilhaPage";
import ChuvaPreocupacoesPage from "./pages/exercicios/ChuvaPreocupacoesPage";
import Neuroanatomia3D from "./pages/Neuroanatomia3D";
import BalaoPensamentosPage from "./pages/exercicios/BalaoPensamentosPage";
import CacaFatosPage from "./pages/exercicios/CacaFatosPage";
import GPSPage from "./pages/exercicios/GPSPage";
import MaquinaTempoPage from "./pages/exercicios/MaquinaTempoPage";
import TortaPage from "./pages/exercicios/TortaPage";
import LabPrevisaoPage from "./pages/exercicios/LabPrevisaoPage";
import ConecteABCPage from "./pages/exercicios/ConecteABCPage";
import AEscavacaoPage from "./pages/exercicios/AEscavacaoPage";
import TedioPage from "./pages/exercicios/TedioPage";
import InundacaoPage from "./pages/exercicios/InundacaoPage";
import FantasiaPage from "./pages/exercicios/FantasiaPage";
import LESSPage from "./pages/exercicios/LESSPage";
import EscritaPage from "./pages/exercicios/EscritaPage";
import PontosPage from "./pages/exercicios/PontosPage";
import ReformulacaoPage from "./pages/exercicios/ReformulacaoPage";
import CartaPage from "./pages/exercicios/CartaPage";
import OculosPage from "./pages/exercicios/OculosPage";
import BussolaPage from "./pages/exercicios/BussolaPage";
import PerfeccionometroPage from "./pages/exercicios/PerfeccionometroPage";
import DiarioPage from "./pages/exercicios/DiarioPage";
import DireitosPage from "./pages/exercicios/DireitosPage";
import ForcasPage from "./pages/exercicios/ForcasPage";
import RodaPage from "./pages/exercicios/RodaPage";
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
        <Route path="/psicoeducacao/neuroanatomia" element={<Neuroanatomia3D />} />
        <Route path="/exercicios" element={<Exercicios />} />
        <Route path="/exercicios/restritos" element={<ExerciciosRestritos />} />
        <Route path="/exercicios/acerte-distorcao" element={<AcerteDistorcaoPage />} />
        <Route path="/exercicios/muralha-evidencias" element={<MuralhaEvidenciasPage />} />
        <Route path="/exercicios/registro" element={<RegistroPage />} />
        <Route path="/exercicios/jardim" element={<JardimPage />} />
        <Route path="/exercicios/baralho-adulto" element={<BaralhoAdultoPage />} />
        <Route path="/exercicios/pares" element={<ParesMentePage />} />
        <Route path="/exercicios/balanca" element={<BalancaPage />} />
        <Route path="/exercicios/roleta" element={<RoletaPage />} />
        <Route path="/exercicios/trilha/:trilhaId" element={<TrilhaPage />} />
        <Route path="/exercicios/chuva" element={<ChuvaPreocupacoesPage />} />
        <Route path="/exercicios/balao" element={<BalaoPensamentosPage />} />
        <Route path="/exercicios/fatos" element={<CacaFatosPage />} />
        <Route path="/exercicios/gps" element={<GPSPage />} />
        <Route path="/exercicios/maquina-tempo" element={<MaquinaTempoPage />} />
        <Route path="/exercicios/torta" element={<TortaPage />} />
        <Route path="/exercicios/previsoes" element={<LabPrevisaoPage />} />
        <Route path="/exercicios/conecte" element={<ConecteABCPage />} />
        <Route path="/exercicios/escavacao" element={<AEscavacaoPage />} />
        <Route path="/exercicios/tedio" element={<TedioPage />} />
        <Route path="/exercicios/inundacao" element={<InundacaoPage />} />
        <Route path="/exercicios/fantasia" element={<FantasiaPage />} />
        <Route path="/exercicios/less" element={<LESSPage />} />
        <Route path="/exercicios/escrita" element={<EscritaPage />} />
        <Route path="/exercicios/pontos" element={<PontosPage />} />
        <Route path="/exercicios/reformulacao" element={<ReformulacaoPage />} />
        <Route path="/exercicios/carta" element={<CartaPage />} />
        <Route path="/exercicios/oculos" element={<OculosPage />} />
        <Route path="/exercicios/bussola" element={<BussolaPage />} />
        <Route path="/exercicios/perfeccionometro" element={<PerfeccionometroPage />} />
        <Route path="/exercicios/lapsos" element={<DiarioPage />} />
        <Route path="/exercicios/direitos" element={<DireitosPage />} />
        <Route path="/exercicios/forcas" element={<ForcasPage />} />
        <Route path="/exercicios/emocoes" element={<RodaPage />} />
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