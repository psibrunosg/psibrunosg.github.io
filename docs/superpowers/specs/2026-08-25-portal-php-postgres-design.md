# Portal Psicologia - Especificação de Arquitetura e Migração (PHP & PostgreSQL)

## 1. Objetivo
Migrar o portal atual (React/Vite) para uma arquitetura SSR (Server-Side Rendered) extremamente veloz e focada em SEO, utilizando PHP puro e PostgreSQL. O foco desta fase é o **NeuroAtlas** e a **Psicoeducação Lúdica**, postergando funcionalidades operacionais como o Diário Terapêutico (Mindset Ponytail).

## 2. Arquitetura e Infraestrutura (Padrão VPS Oracle)
Baseado na infraestrutura de sucesso da "VPS 1" (projeto `bsempresa`), a "VPS 2" utilizará o mesmo padrão de orquestração via Docker, garantindo familiaridade e estabilidade.

- **Orquestração:** Docker & Docker Compose.
- **Proxy/SSL:** Nginx Proxy Manager (rede `proxy-network`) rodando paralelamente para gerenciamento de domínios e Let's Encrypt.
- **Containers da Aplicação (3 Serviços):**
  1. `nginx`: Nginx Alpine servindo os arquivos estáticos e atuando como proxy reverso para o PHP-FPM.
  2. `php`: Imagem PHP (FPM) customizada com as extensões do PostgreSQL.
  3. `postgres`: PostgreSQL 16 Alpine.
- **Redes:**
  - `proxy-network`: Rede externa para o Nginx Proxy Manager injetar o tráfego.
  - `psico-network`: Rede interna isolada para comunicação entre Nginx, PHP e Postgres.

## 3. Componentes Principais

### 3.1. Engine de Psicoeducação Lúdica (Foco Público)
- **Roteamento Leve:** Um `index.php` (Front Controller) para processar as URLs amigáveis.
- **Armazenamento:** Textos e artigos (como Mundo Torajo e Terapia do Esquema) podem ser escritos em Markdown (`.md`) e convertidos via biblioteca nativa em PHP.
- **Vantagem SEO:** Todo o HTML é gerado no servidor. O tempo de resposta (TTFB) cai drasticamente se comparado ao React.

### 3.2. NeuroAtlas (Módulo 3D)
- Arquivos `.obj` e texturas migram diretamente para a pasta estática do Nginx.
- Refatoração do código de visualização: saída do `React Three Fiber` e entrada do **Three.js puro** (`Vanilla JS`).
- A lógica de interação clínica (62 referências, marcações de áreas cerebrais) continua a mesma, porém gerenciada por eventos DOM nativos (`addEventListener`).

### 3.3. Banco de Dados (PostgreSQL)
- Schema inicial focado nas configurações do sistema ou metadados de acesso.
- Preparado desde o dia 1 para suportar futuras features (Diário Terapêutico, Agendamentos), utilizando a mesma estrutura de variáveis de ambiente (`DB_HOST`, `DB_USER`) padronizada no repositório `bsempresa`.

## 4. Escopo Adiado (YAGNI)
Alinhado à aprovação do escopo restrito:
- Diário Terapêutico (Opção A) e Bíper de Contato (Opção B) estão **pausados** para a próxima fase.
- Painel de administração (CMS) descartado; edições diretas pelo código.
