# Handoff — continuar a auditoria em outra máquina

Cole o bloco abaixo como primeira mensagem numa sessão nova do Claude Code, com o repositório aberto. Ele carrega as regras de trabalho, o estado real e o que falta.

---

```
Você continua um trabalho de auditoria e correção no repositório
psibrunosg.github.io — plataforma clínica em produção de um psicólogo
(React 19 + Vite + TS + Supabase + three.js, deploy no GitHub Pages).
Dados reais de paciente: nome, CPF, respostas de escalas psicométricas,
transcrições de IA. LGPD aplica. Português do Brasil.

## COMO TRABALHAR AQUI

Modo Orquestrador. Decisões de alto nível suas; escrita de código
delegada a sub-agentes, exceto quando delegar custa mais que fazer.
Pipeline de 3 fases, aguardando cada uma: Construção → Conferência (QA,
agente separado) → Auditoria e regressão (agente separado). QA e
Auditoria respondem só {"status":"PASS"} ou
{"status":"FAIL","reason":"<até 10 palavras>"}.

ARMADILHAS JÁ PAGAS — não repita:

1. NÃO passe `model` no Agent. `model:"sonnet"` e `"haiku"` mapeiam para
   IDs inexistentes e o agente morre na hora. Todos herdam o modelo da
   sessão.
2. Dispare sub-agentes em lotes de 2–3, nunca 7. Sete em paralelo
   estouram o limite de sessão e matam o trabalho no meio. Grave o
   resultado de cada lote em disco antes do lote seguinte.
3. Passe aos agentes uma LISTA NUMERADA DE HIPÓTESES para confirmar ou
   derrubar, não um escopo aberto. Rende relatórios mais precisos e mais
   baratos, e as correções mais valiosas vêm de agentes derrubando
   hipóteses concretas.
4. Confira os PASS por conta própria antes de consolidar. Um agente já
   devolveu PASS sobre código com bug real. PASS é sinal, não prova.
5. `npm install` ANTES de qualquer coisa. O node_modules costuma estar
   defasado e o build falha por gsap/lottie-web ausentes.

"CORRIGIDO" TEM TRÊS ESTADOS NESTE PROJETO: no repo, no banco e no ar.
Edge functions NÃO vão junto com o deploy do GitHub Pages. Uma
verificação que confere só o repositório superestima o que está
resolvido — já aconteceu nesta auditoria. Sempre cheque as três.

VERIFICAÇÃO: todo achado precisa de âncora arquivo:linha. Cole saída
real de comando, sem paráfrase. Para gates de segurança, teste por HTTP
contra o ambiente ao vivo, não leia só o código. Distinga bytes em disco
de bytes transferidos.

Prefira reuso ao que já existe no repo antes de abstrair. Comente
simplificações deliberadas com `ponytail:` nomeando o teto e o caminho
de upgrade.

## ESTADO ATUAL (2026-08-10)

Relatório completo: docs/auditoria/2026-08-06-auditoria.md — leia a
seção "Revalidação" primeiro, ela prevalece sobre o corpo.

TODOS OS P0 ESTÃO FECHADOS nas três camadas. Feito e verificado:
- C-SSRS ligado em detectarRiscos (a escala de risco suicida não
  disparava alerta nenhum)
- Exclusão LGPD transacional via RPC excluir_paciente_completo, testada
  ponta a ponta como `authenticated` com o JWT do terapeuta
- Policy de UPDATE em respostas_questionarios (não existia; marcar risco
  como resolvido falhava em silêncio por RLS)
- Leitura de sessão do banco em useExerciseSession (nunca existira)
- Acesso restrito revalidado no servidor a cada montagem, falhando
  fechado (era decidido por localStorage editável no devtools)
- Contraste do botão primário nos temas escuro e noturno
- 5 edge functions publicadas e testadas por HTTP

Banco (projeto BSpsi, ref hpyarwrgcdbulekfyozs, org etvdpbjnqfmdrfvuxxjz):
1 usuário, 27 respostas, 8 pacientes, 0 sessões de exercício. Esse zero
é histórico — a gravação estava quebrada desde julho e só agora foi
destravada; deve sair de zero quando um paciente completar um exercício.

O connector do Supabase precisa estar autorizado NA CONTA DONA DO BSpsi.
Se `list_projects` devolver gestao_pessoas/bsfinanceiro, é a conta
errada e nenhuma chamada por projeto funciona.

## O QUE FALTA, EM ORDEM

P1 de segurança (banco):
1. exercise_sessions tem SELECT `to public` com predicado
   `code_is_active(code)` que NÃO amarra a linha ao chamador: conhecer um
   código ativo lê as sessões de todos os códigos ativos. Agora dá para
   fechar — o cliente já filtra por código.
2. respostas_questionarios aceita INSERT anônimo com patient_code
   arbitrário para toda escala fora da lista restrita (ysq, phq9, gad7…).
   Um YSQ falso vira "o mais recente" lido por psicoed-personalizada.
3. Seis tabelas clínicas com RLS `using(true) to authenticated`
   (pacientes, paciente_perfil, paciente_mensagens, paciente_anexos,
   paciente_psicoed, conceituacoes_registros). Latente hoje: existe 1
   usuário. Qualquer conta criada lê todo o prontuário.
4. formularios_anonimos e respostas_formularios_anonimos usam
   `auth.role() = 'authenticated'` em vez do UUID do terapeuta.
5. Proteção contra senha vazada desligada no Auth (um clique no
   dashboard).

P1 nunca revalidados (são de código, ninguém reconferiu):
6. _shared/redacao.ts redige só o nome próprio; anexos guardam CPF,
   endereço e terceiros em claro, e voltam ao prompt do LLM.
7. Prompt injection em conceituacao-chat: anexo entra sem sanitização,
   saída do modelo volta ao cliente e é persistida.
8. Transferência de dado clínico a 7 provedores de LLM sem DPA nem base
   documentada (art. 11 e 33 da LGPD).

P1 de produto:
9. Zero code splitting: 77 rotas estáticas, bundle único de 3,36 MB.
10. 8 exercícios nunca chamam save() — o payload clínico é descartado no
    unmount. Pior caso: RoletaTerapeutica, onde o delta antes/depois é o
    insight inteiro.
11. Painel: select("*") traz PII de toda a base a cada load, e o erro do
    fetch é descartado (falha de rede aparece como "Nenhuma resposta").
12. ChuvaPreocupacoes só é jogável arrastando, sem teclado e sem
    useReducedMotion.
13. Quiz do 3D não persiste, então 2 dos 5 territórios do mapa nunca
    acendem conclusão.
14. showContext default true carrega o córtex no primeiro paint (~18,5 MB).
15. Chave de API de LLM em localStorage.

Depois disso, as 4 reformas grandes (Faixa 3 do relatório): nova
arquitetura de informação do painel, contrato do ExercicioShell, trilha
de psicoeducação reusando trilhas.ts, e o cérebro 3D de 8 modos para 1
caminho com payload ≤ 2 MB.

## COMECE ASSIM

Rode `npm install`, depois `npm run build`, `npm test` e
`npm run check:neuro-models` para confirmar a linha de base. Confirme o
connector do Supabase com `list_projects`. Leia a seção "Revalidação" do
relatório. Então me diga por onde quer começar — minha sugestão é o
bloco de segurança do banco (itens 1 a 5), que é curto, verificável e
fecha o que sobrou de exposição real.
```

---

## Notas para quem cola o prompt

- O bloco acima é autossuficiente: não depende do histórico desta sessão.
- Se o Claude Code do outro PC não tiver os plugins **caveman** e **ponytail** instalados, o trabalho segue igual — eles afetam o estilo da prosa e o viés por simplicidade, não a correção técnica.
- O que **não** é opcional é o connector do Supabase autorizado na conta certa. Sem ele, metade dos itens pendentes não é verificável.
- Branch de trabalho desta rodada: `fix/faixa1-contraste-e-exclusao-lgpd`, já mesclada em `main`.
