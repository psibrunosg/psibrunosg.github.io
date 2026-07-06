# Handoff: Laboratório de Neuroanatomia 3D

Este documento serve como um registro do estado atual do projeto de visualização 3D de neuroanatomia e um guia para futuras melhorias.

## 📌 Estado Atual (v1.0)
- **Framework:** React + `@react-three/fiber` + `@react-three/drei`.
- **Página Principal:** `src/pages/Neuroanatomia3D.tsx` (acessível via `/psicoeducacao/neuroanatomia`).
- **Componente 3D:** `src/components/3d/BrainModel.tsx`.
- **Modelos Utilizados:** Modelos `.obj` extraídos do BodyParts3D (DBCLS), renderizados e coloridos dinamicamente no frontend.
- **Estruturas Mapeadas:**
  - Amígdala (Esquerda e Direita)
  - Hipocampo (Esquerdo e Direito)
  - Córtex Pré-Frontal (Giros frontais inferior, médio e superior)
  - Tronco Cerebral/Contexto (Ponte e Bulbo)

## 🚀 Ideias para Futuras Melhorias

### 1. Otimização de Performance (Crítico)
Os modelos `.obj` do BodyParts3D são extremamente detalhados (high-poly). Carregar 10+ arquivos `.obj` no carregamento da página consome muita banda e processamento (especialmente em celulares).
- **Ação Recomendada:** Usar o Blender (ou ferramentas de linha de comando como `gltf-pipeline` / `Draco`) para unir os `.obj` de uma mesma área (ex: unir todos os giros frontais em um único "Prefrontal_Cortex.glb") e comprimir as malhas usando Draco compression.
- **Impacto:** O carregamento passará de segundos para milissegundos e o celular não esquentará renderizando milhares de polígonos invisíveis.

### 2. UI e Experiência do Usuário (UX)
- **Rótulos 3D Dinâmicos:** Atualmente o nome da área aparece quando há "hover". Seria interessante ter linhas flutuantes (usando `<Line>` do Drei) conectando o modelo a um painel de UI 2D para um visual mais "futurista" ou de "laboratório".
- **Isolamento de Peças:** Quando clicar em uma parte (ex: Amígdala), as outras partes podem ficar com opacidade `0.1` (quase invisíveis) para destacar a peça principal.
- **Animações de Câmera:** Ao clicar no Hipocampo, a câmera (`OrbitControls`) poderia automaticamente fazer um zoom suave (usando `drei/CameraControls` ou gsap) focando na peça.

### 3. Expansão de Conteúdo Psicoeducativo
- **Novas Estruturas:** Adicionar o Córtex Cingulado Anterior (relacionado ao controle de erros e TOC), a Ínsula (percepção de dor/interocepção, vital para ansiedade somática) e os Gânglios da Base.
- **Modos de Funcionamento:** Criar um botão "Ativar Crise de Ansiedade" onde a Amígdala "pulsa" em vermelho forte e o Córtex Pré-Frontal perde o brilho, mostrando visualmente o "sequestro da amígdala".

### 4. Refatoração de Código
- **JSON de Configuração:** Mover a lista de URLs dos `.obj` e os textos psicoeducativos de dentro do código `.tsx` para um arquivo `.json` separado, facilitando a edição do conteúdo sem tocar na lógica do React.

## 🛠️ Ferramentas Recomendadas para o Próximo Ciclo
- **Blender 3D:** Para limpeza, redução de polígonos (Decimate modifier) e exportação em `.glb`.
- **gltf.report:** Ferramenta web para analisar e comprimir modelos GLTF/GLB facilmente.
