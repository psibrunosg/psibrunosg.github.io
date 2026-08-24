# Psi Bruno SG

Site psicoeducativo e ferramentas clínicas de Bruno Souza. O repositório contém páginas públicas, exercícios, área do paciente, painel profissional e experiências interativas.

## Estado técnico

- Aplicação atual: Vite + React + TypeScript.
- Dados e funções: Supabase.
- Publicação atual: build estático.
- Arquitetura-alvo: HTML semântico, CSS, PHP e JavaScript com ES Modules.
- Migração: progressiva e reversível; nenhuma rota clínica pode perder comportamento ou controles de acesso.

## Requisitos locais

- Node.js 24.
- npm compatível com o lockfile.
- Variáveis locais em `.env.local`:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`

Nunca commitar `.env`, chaves administrativas, service-role keys ou credenciais de provedores.

## Comandos

```bash
npm ci
npm run dev
npm run lint
npm run test
npm run check:neuro-models
npm run check:repo-hygiene
npm run build
```

## Estrutura

- `src/pages/`: rotas e páginas atuais.
- `src/components/`: componentes compartilhados e experiências.
- `src/content/`: conteúdo estruturado.
- `src/lib/`: integrações e regras reutilizáveis.
- `public/`: assets públicos.
- `supabase/`: migrations e Edge Functions.
- `docs/specs/`: especificações aprovadas.
- `docs/superpowers/plans/`: planos de implementação revisáveis.

## Segurança e dados clínicos

O projeto manipula dados pessoais e clínicos. Mudanças em autenticação, RLS, códigos de paciente, formulários, escalas ou painel profissional exigem testes específicos e validação de autorização. Nunca substituir dado ausente por zero nem expor segredo no navegador.

## Regra de contribuição

1. Ler a especificação aplicável.
2. Trabalhar em tarefas pequenas e testáveis.
3. Preservar mudanças locais não relacionadas.
4. Executar os verificadores proporcionais ao risco.
5. Registrar evidência antes de declarar conclusão.
