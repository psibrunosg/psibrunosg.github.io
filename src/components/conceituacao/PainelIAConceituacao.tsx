import { useState } from "react";
import { Sparkles, Loader2, Info, Send, Paperclip, LogOut, Settings } from "lucide-react";
import { PROVEDORES, MODELOS_POR_PROVEDOR, nomeSeguro, type UseConceituacaoIAResult } from "@/hooks/useConceituacaoIA";
import { box, labelCls, inputCls } from "./CampoDiagrama";

// Restaura os rótulos amigáveis que o Beck já tinha antes da generalização —
// as outras ferramentas nunca tiveram rótulos amigáveis pra preservar, então
// usam a chave crua como fallback (comportamento genérico, sem regressão).
const LABELS_PERFIL_CONHECIDOS: Record<string, string> = {
  crenca_central: "Crença central",
  crencas_intermediarias: "Crenças intermediárias",
  estrategias_compensatorias: "Estratégias compensatórias",
};

// Chrome de IA compartilhado por todas as ferramentas de conceituação: seleção
// de paciente/provedor/modelo, contexto + rascunho automático, chat guiado,
// e anexos de referência. Cada ferramenta só desenha seu próprio diagrama por
// fora deste bloco — ver ConceituacaoCognitiva.tsx / ConceituacaoEsquema.tsx etc.
export function PainelIAConceituacao({ ia }: { ia: UseConceituacaoIAResult }) {
  const [mostrarConfig9Router, setMostrarConfig9Router] = useState(false);
  const e9router = ia.provider === "9router";
  const modelosProvider = MODELOS_POR_PROVEDOR[ia.provider];

  return (
    <>
      <div className="glass-card mb-6 rounded-2xl p-5">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-[var(--c-accent)]">Sugerir rascunho com IA</p>
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className={labelCls}>Paciente (opcional — usa escalas de-identificadas)</label>
            <select value={ia.pacienteChave} onChange={(e) => ia.setPacienteChave(e.target.value)} className={inputCls}>
              <option value="">Nenhum / genérico</option>
              {ia.grupos.map(([chave, rs]) => (
                <option key={chave} value={chave}>{nomeSeguro(rs[0])} ({rs.length} resposta{rs.length !== 1 ? "s" : ""})</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className={labelCls}>Provedor</label>
              <div className="flex gap-1">
                <select value={ia.provider} onChange={(e) => ia.escolherProvider(e.target.value)} className={inputCls}>
                  {PROVEDORES.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
                </select>
                {e9router && (
                  <button type="button" onClick={() => setMostrarConfig9Router((v) => !v)}
                    title="Configurar 9Router" aria-label="Configurar 9Router"
                    className="flex flex-shrink-0 items-center justify-center rounded-xl border border-[var(--c-border)] px-2 text-[var(--c-muted)] transition-colors hover:border-[var(--c-accent)] hover:text-[var(--c-accent)]">
                    <Settings size={14} />
                  </button>
                )}
              </div>
            </div>
            <div className="flex-1">
              <label className={labelCls}>Modelo</label>
              {modelosProvider ? (
                <select value={ia.model} onChange={(e) => ia.escolherModel(e.target.value)} className={inputCls}>
                  {modelosProvider.map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}
                </select>
              ) : (
                <input value={ia.model} onChange={(e) => ia.escolherModel(e.target.value)} placeholder="modelo configurado no seu 9Router" className={inputCls} />
              )}
            </div>
          </div>
        </div>
        {e9router && mostrarConfig9Router && (
          <div className="mt-3 grid gap-3 rounded-xl border border-[var(--c-border)] p-3 md:grid-cols-2">
            <div>
              <label className={labelCls}>URL do 9Router</label>
              <input value={ia.nineRouterUrl} onChange={(e) => ia.setNineRouterUrl(e.target.value)} placeholder="http://localhost:20128/v1" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>API key (opcional)</label>
              <input type="password" value={ia.nineRouterKey} onChange={(e) => ia.setNineRouterKey(e.target.value)} placeholder="deixe vazio se seu 9Router não exigir" className={inputCls} />
            </div>
            <p className="text-[10px] text-[var(--c-muted)] md:col-span-2">
              9Router local: a IA é chamada direto pelo seu navegador (a nuvem não alcança seu localhost). URL e chave ficam salvas só neste navegador.
            </p>
          </div>
        )}
        <div className="mt-3">
          <label className={labelCls}>Contexto clínico (opcional)</label>
          <textarea value={ia.contexto} onChange={(e) => ia.setContexto(e.target.value)} rows={2}
            placeholder="Observações livres — NÃO inclua nome, CPF, telefone ou outros dados identificáveis"
            className={`${inputCls} resize-y`} />
          <p className="mt-1 text-[10px] text-[var(--c-muted)]">Você é responsável por não digitar dados que identifiquem o paciente aqui.</p>
        </div>
        <button onClick={ia.sugerirRascunho} disabled={ia.loading}
          className="mt-3 flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold text-white disabled:opacity-60"
          style={{ background: "linear-gradient(120deg, var(--c-accent), var(--c-accent-lt))" }}>
          {ia.loading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
          {ia.loading ? "Gerando..." : "Sugerir rascunho (IA)"}
        </button>
        {ia.erro && <p className="mt-2 text-xs text-[var(--c-danger,#dc2626)]">{ia.erro}</p>}
      </div>

      {!ia.pacienteChave && (
        <div className="mb-6 flex items-start gap-2 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-[var(--c-text)]">
          <Info size={14} className="mt-0.5 flex-shrink-0 text-amber-500" />
          <span>Sem paciente selecionado: modo genérico — sem memória entre sessões e sem redação automática de nome. Não digite dados identificáveis.</span>
        </div>
      )}

      {ia.perfil && Object.keys(ia.perfil).length > 0 && (
        <div className={`${box} mb-6`}>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[var(--c-accent)]">Perfil de longo prazo deste paciente</p>
          <div className="space-y-1.5 text-xs text-[var(--c-text)]">
            {Object.entries(ia.perfil).filter(([chave, valor]) => chave !== "situacoes_recorrentes" && valor).map(([chave, valor]) => (
              <p key={chave}><span className="font-semibold">{LABELS_PERFIL_CONHECIDOS[chave] ?? chave}:</span> {String(valor)}</p>
            ))}
            {Array.isArray(ia.perfil.situacoes_recorrentes) && ia.perfil.situacoes_recorrentes.length > 0 && (
              <p><span className="font-semibold">Temas recorrentes:</span> {(ia.perfil.situacoes_recorrentes as { texto?: string }[]).map((s) => s?.texto ?? String(s)).join("; ")}</p>
            )}
          </div>
        </div>
      )}

      <div className="glass-card mb-6 rounded-2xl p-5">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--c-accent)]">Conversa guiada</p>
          {ia.pacienteId != null && ia.mensagens.length > 0 && (
            <button onClick={ia.encerrarSessao} disabled={ia.encerrarLoading}
              className="flex items-center gap-1.5 rounded-full border border-[var(--c-border)] px-3 py-1.5 text-[11px] font-medium text-[var(--c-muted)] transition-colors hover:text-[var(--c-accent)] disabled:opacity-60">
              {ia.encerrarLoading ? <Loader2 size={12} className="animate-spin" /> : <LogOut size={12} />}
              Encerrar sessão
            </button>
          )}
        </div>

        {ia.mensagens.length > 0 && (
          <div className="mb-3 max-h-72 space-y-2 overflow-y-auto rounded-xl border border-[var(--c-border)] p-3">
            {ia.mensagens.map((m, i) => (
              <div key={i} className={`rounded-xl px-3 py-2 text-xs ${m.papel === "terapeuta" ? "ml-6 bg-[var(--c-accent)]/10 text-[var(--c-text)]" : "mr-6 bg-[var(--c-surface)] text-[var(--c-text)]"}`}>
                <p className="mb-0.5 text-[9px] font-bold uppercase tracking-wider text-[var(--c-muted)]">{m.papel === "terapeuta" ? "Você" : "IA"}</p>
                {m.conteudo}
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <input value={ia.inputChat} onChange={(e) => ia.setInputChat(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !ia.chatLoading) ia.enviarMensagemChat(); }}
            placeholder="Responda ou descreva o caso — a IA vai perguntando e preenchendo o diagrama"
            className={inputCls} />
          <button onClick={ia.enviarMensagemChat} disabled={ia.chatLoading || !ia.inputChat.trim()}
            className="flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold text-white disabled:opacity-60"
            style={{ background: "linear-gradient(120deg, var(--c-accent), var(--c-accent-lt))" }}>
            {ia.chatLoading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
          </button>
        </div>
        {ia.chatErro && <p className="mt-2 text-xs text-[var(--c-danger,#dc2626)]">{ia.chatErro}</p>}
      </div>

      {ia.pacienteId != null && (
        <div className={`${box} mb-6`}>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[var(--c-accent)]">Referências (prontuário / documentos)</p>
          <p className="mb-3 text-[10px] text-[var(--c-muted)]">
            O nome deste paciente é trocado por iniciais+nascimento antes do envio à IA. Outros dados sensíveis do documento
            (CPF, endereço, nomes de terceiros) NÃO são filtrados — você é responsável por essa checagem.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <label className="flex cursor-pointer items-center gap-1.5 rounded-full border border-[var(--c-border)] px-3 py-1.5 text-[11px] font-medium text-[var(--c-text)] transition-colors hover:border-[var(--c-accent)]">
              <Paperclip size={12} /> Anexar PDF
              <input type="file" accept="application/pdf" className="hidden" onChange={ia.handleUploadPDF} disabled={ia.anexoLoading} />
            </label>
          </div>
          <div className="mt-3">
            <label className={labelCls}>Ou cole um trecho do prontuário</label>
            <textarea value={ia.anexoTexto} onChange={(e) => ia.setAnexoTexto(e.target.value)} rows={3} className={`${inputCls} resize-y`} />
            <button onClick={() => ia.salvarAnexo("texto", ia.anexoTexto)} disabled={ia.anexoLoading || !ia.anexoTexto.trim()}
              className="mt-2 rounded-full border border-[var(--c-border)] px-3 py-1.5 text-[11px] font-medium text-[var(--c-text)] transition-colors hover:border-[var(--c-accent)] disabled:opacity-60">
              {ia.anexoLoading ? "Salvando..." : "Salvar como referência"}
            </button>
          </div>
          {ia.anexoErro && <p className="mt-2 text-xs text-[var(--c-danger,#dc2626)]">{ia.anexoErro}</p>}
          {ia.anexoOk && !ia.anexoErro && (
            <p className="mt-2 text-xs text-[var(--c-accent)]">
              Referência salva — a IA vai usá-la nas próximas mensagens.
              {ia.anexoTruncado && " Documento grande: só o início foi guardado (limite de tamanho)."}
            </p>
          )}
        </div>
      )}

      {ia.aiUsado && (
        <div className="mb-6 flex items-start gap-2 rounded-2xl border border-[var(--c-accent)]/30 bg-[var(--c-accent)]/10 p-3 text-xs text-[var(--c-text)]">
          <Info size={14} className="mt-0.5 flex-shrink-0 text-[var(--c-accent)]" />
          <span>Rascunho gerado por IA — revise e edite antes de usar. Não é laudo.</span>
        </div>
      )}
    </>
  );
}
