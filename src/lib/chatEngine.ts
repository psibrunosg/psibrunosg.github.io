export interface ChatNodo {
  id: string;
  tipo: "pergunta" | "fim";
  texto: string;
  campo?: { tipo: "texto" | "area"; placeholder: string };
  /** Próximo nó para nós de campo livre (nós com opções definem o destino em cada opção). */
  proxNodo?: string;
  opcoes?: Array<{ id: string; texto: string; proxNodo: string }>;
}

export interface ChatScript {
  [nodoId: string]: ChatNodo;
}

export interface ChatHistorico {
  nodo: string;
  resposta: string;
  xp: number;
}

export function procesarChat(
  script: ChatScript,
  nodoAtual: string,
  resposta: string,
  escolhaIdx?: number
): { proximoNodo: string; xp: number } {
  const nodo = script[nodoAtual];
  if (!nodo) return { proximoNodo: "fim", xp: 0 };

  const xpBase = 10;
  let proximoNodo = "fim";

  if (nodo.opcoes && escolhaIdx !== undefined) {
    const opcao = nodo.opcoes[escolhaIdx];
    if (opcao) {
      proximoNodo = opcao.proxNodo;
    }
  } else if (nodo.campo && resposta.trim()) {
    proximoNodo = nodo.proxNodo ?? "fim";
  }

  return { proximoNodo, xp: xpBase };
}
