# Portal PHP & Infraestrutura Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrar o portal para a arquitetura Docker (Nginx, PHP-FPM, Postgres) e implementar a página inicial com o design "Golden Portal" (Vanilla PHP/JS/CSS).

**Architecture:** Docker compose com 3 containers idênticos ao projeto bsempresa. PHP servindo um Front Controller em `public/index.php`. Views em PHP com HTML e CSS puros, implementando *fade-up* on scroll e estilos *glow*.

**Tech Stack:** Docker, Nginx, PHP 8.3 FPM, PostgreSQL 16, Vanilla CSS/JS.

**Spec:** `docs/superpowers/specs/2026-08-25-portal-php-postgres-design.md`

## Global Constraints

- O repositório usará `docker-compose.yml` e rede `proxy-network`.
- Não utilizar bibliotecas externas de UI ou frameworks pesados de PHP.
- Apenas CSS nativo e JS nativo (Intersection Observer para animações).

---

### Task 1: Infraestrutura Docker (Nginx, PHP-FPM, Postgres)

**Files:**
- Create: `docker-compose.yml`
- Create: `docker/nginx.conf`
- Create: `docker/Dockerfile.php`
- Create: `database/schema.sql`

**Interfaces:**
- Produces: Um ambiente funcional exposto internamente para o Nginx Proxy Manager.

- [ ] **Step 1: Criar o docker-compose.yml**

```yaml
services:
  nginx:
    image: nginx:alpine
    volumes:
      - ./:/var/www/html
      - ./docker/nginx.conf:/etc/nginx/conf.d/default.conf:ro
    depends_on:
      - php
    networks:
      - proxy-network
      - portal-network
    command: >
      sh -c "exec nginx -g 'daemon off;'"

  php:
    build:
      context: .
      dockerfile: docker/Dockerfile.php
    environment:
      - DB_HOST=postgres
      - DB_PORT=5432
      - DB_NAME=portal
      - DB_USER=portal
      - DB_PASS=portal
    depends_on:
      - postgres
    networks:
      - portal-network

  postgres:
    image: postgres:16-alpine
    environment:
      - POSTGRES_DB=portal
      - POSTGRES_USER=portal
      - POSTGRES_PASSWORD=portal
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./database/schema.sql:/docker-entrypoint-initdb.d/schema.sql:ro
    networks:
      - portal-network

volumes:
  postgres_data:

networks:
  proxy-network:
    external: true
    name: proxy-network
  portal-network:
    driver: bridge
```

- [ ] **Step 2: Criar o Nginx config**

```nginx
server {
    listen 80;
    server_name localhost;
    root /var/www/html/public;
    index index.php index.html;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass php:9000;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }
}
```

- [ ] **Step 3: Criar o Dockerfile do PHP**

```dockerfile
FROM php:8.3-fpm-alpine
RUN apk add --no-cache postgresql-dev \
    && docker-php-ext-install pdo pdo_pgsql
```

- [ ] **Step 4: Criar schema inicial vazio**

```sql
-- schema.sql
CREATE TABLE IF NOT EXISTS configuracoes (
    id SERIAL PRIMARY KEY,
    chave VARCHAR(50) UNIQUE NOT NULL,
    valor TEXT NOT NULL
);
```

- [ ] **Step 5: Commit**

```bash
git add docker-compose.yml docker/ database/
git commit -m "feat: adicionar infraestrutura docker"
```

---

### Task 2: Estrutura Base do PHP (Front Controller)

**Files:**
- Create: `public/index.php`
- Create: `views/layout.php`
- Create: `views/404.php`

**Interfaces:**
- Produces: Sistema de roteamento simples baseado em requisições via `index.php`.

- [ ] **Step 1: Roteador em index.php**

```php
<?php
$request = $_SERVER['REQUEST_URI'];
$path = parse_url($request, PHP_URL_PATH);

ob_start();

switch ($path) {
    case '/':
    case '':
        require __DIR__ . '/../views/home.php';
        break;
    case '/neuroatlas':
        require __DIR__ . '/../views/neuroatlas.php';
        break;
    default:
        http_response_code(404);
        require __DIR__ . '/../views/404.php';
        break;
}

$content = ob_get_clean();
require __DIR__ . '/../views/layout.php';
```

- [ ] **Step 2: Criar layout padrão (Aura Golden Portal)**

```php
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portal Psicologia</title>
    <link rel="stylesheet" href="/css/style.css">
</head>
<body>
    <main>
        <?= $content ?>
    </main>
    <script src="/js/animations.js"></script>
</body>
</html>
```

- [ ] **Step 3: Criar 404.php temporário**

```php
<div class="container text-center fade-up">
    <h1>404 - Página não encontrada</h1>
    <a href="/" class="btn-golden">Voltar ao Início</a>
</div>
```

- [ ] **Step 4: Commit**

```bash
git add public/index.php views/layout.php views/404.php
git commit -m "feat: adicionar front controller"
```

---

### Task 3: Design Golden Portal (CSS & Home)

**Files:**
- Create: `public/css/style.css`
- Create: `public/js/animations.js`
- Create: `views/home.php`
- Create: `views/neuroatlas.php`

**Interfaces:**
- Produces: Arquivos estáticos e a view principal para o visual premium e cinemático.

- [ ] **Step 1: Criar estilos globais e Animações (style.css)**

```css
:root {
    --bg-dark: #090a0f;
    --gold: #d4af37;
    --gold-glow: rgba(212, 175, 55, 0.4);
    --text-main: #f0f0f0;
}
body {
    background-color: var(--bg-dark);
    color: var(--text-main);
    font-family: system-ui, -apple-system, sans-serif;
    margin: 0;
    padding: 0;
    overflow-x: hidden;
}
.hero {
    min-height: 80vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 2rem;
    background: radial-gradient(circle at center, rgba(30,35,50,1) 0%, var(--bg-dark) 100%);
}
h1 {
    font-family: 'Georgia', serif;
    font-size: 3rem;
    font-weight: 300;
    margin-bottom: 1rem;
}
p.subtitle {
    font-size: 1.2rem;
    max-width: 600px;
    color: #a0a0a0;
    line-height: 1.6;
}
.grid {
    display: flex;
    gap: 2rem;
    padding: 4rem 2rem;
    justify-content: center;
    flex-wrap: wrap;
}
.card {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255,255,255,0.1);
    padding: 2rem;
    border-radius: 12px;
    width: 300px;
    transition: all 0.4s ease;
    text-decoration: none;
    color: inherit;
}
.card:hover {
    border-color: var(--gold);
    box-shadow: 0 0 20px var(--gold-glow);
    transform: translateY(-5px);
}
.card h2 {
    color: var(--gold);
    margin-top: 0;
}
.fade-up {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.8s ease, transform 0.8s ease;
}
.fade-up.visible {
    opacity: 1;
    transform: translateY(0);
}
```

- [ ] **Step 2: Script Intersection Observer (animations.js)**

```javascript
document.addEventListener("DOMContentLoaded", () => {
    const elements = document.querySelectorAll('.fade-up');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    elements.forEach(el => observer.observe(el));
});
```

- [ ] **Step 3: Criar home.php com a copy humanizada**

```php
<section class="hero fade-up">
    <h1>Compreender a própria mente é o primeiro passo para cuidar dela.</h1>
    <p class="subtitle">Olá. Sou Bruno, psicólogo clínico. Este portal é um espaço seguro dedicado à sua saúde mental, pautado na ciência, na transparência e na empatia.</p>
</section>

<section class="grid">
    <a href="/psicoeducacao" class="card fade-up">
        <h2>📚 Psicoeducação Lúdica</h2>
        <p>Uma biblioteca de metáforas e artigos para ajudar você a visualizar e dar nome ao que sente, tornando o processo mais leve.</p>
    </a>
    <a href="/neuroatlas" class="card fade-up">
        <h2>🧠 NeuroAtlas</h2>
        <p>Uma ferramenta interativa que ilustra como nosso cérebro reage ao estresse e à cura. Porque entender a biologia também é acolhimento.</p>
    </a>
</section>
```

- [ ] **Step 4: Criar view base do NeuroAtlas**

```php
<div class="fade-up" style="padding: 2rem; text-align:center;">
    <h1 style="color: #d4af37;">NeuroAtlas 3D</h1>
    <p>O ambiente isolado para imersão no modelo cerebral será carregado aqui.</p>
</div>
```

- [ ] **Step 5: Commit**

```bash
git add public/css/style.css public/js/animations.js views/home.php views/neuroatlas.php
git commit -m "feat: implementar design golden portal e copy humanizada"
```
