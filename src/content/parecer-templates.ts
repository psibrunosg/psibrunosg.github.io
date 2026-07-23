// Templates de texto interpretativo para pareceres psicológicos
// Tom técnico-clínico, 1-3 frases por classificação

export const templatesPorTeste: Record<string, Record<string, string>> = {
  phq9: {
    "Mínima": "O instrumento PHQ-9 não indicou sintomatologia depressiva clinicamente significativa no período avaliado. O(a) avaliando(a) apresenta funcionamento emocional dentro dos parâmetros esperados para humor.",
    "Leve": "Os resultados do PHQ-9 sugerem sintomas depressivos de intensidade leve. Recomenda-se monitoramento clínico e avaliação da necessidade de intervenção psicoterapêutica.",
    "Moderada": "O PHQ-9 aponta para sintomatologia depressiva de intensidade moderada, com impacto funcional provável. Indica-se acompanhamento psicoterapêutico e avaliação quanto à necessidade de intervenção farmacológica.",
    "Moderadamente grave": "Os resultados indicam sintomatologia depressiva moderadamente grave, sugerindo comprometimento significativo no funcionamento cotidiano. Recomenda-se intervenção psicoterapêutica e avaliação psiquiátrica.",
    "Grave": "O PHQ-9 revela sintomatologia depressiva de intensidade grave, com comprometimento funcional importante. Indica-se acompanhamento psicoterapêutico intensivo e encaminhamento psiquiátrico para avaliação de tratamento combinado.",
  },
  gad7: {
    "Mínima": "O GAD-7 não identificou sintomatologia ansiosa clinicamente significativa. O(a) avaliando(a) apresenta níveis de ansiedade dentro dos parâmetros de normalidade.",
    "Leve": "Os resultados do GAD-7 indicam sintomas ansiosos de intensidade leve. Sugere-se monitoramento clínico e orientações sobre manejo da ansiedade.",
    "Moderada": "O GAD-7 aponta para sintomatologia ansiosa moderada, com possível impacto no funcionamento diário. Recomenda-se intervenção psicoterapêutica, com ênfase em técnicas de manejo da ansiedade.",
    "Grave": "Os resultados revelam sintomatologia ansiosa de intensidade grave, com comprometimento funcional significativo. Indica-se psicoterapia e avaliação psiquiátrica para tratamento combinado.",
  },
  bai: {
    "Mínimo": "O Inventário de Ansiedade de Beck indica nível mínimo de ansiedade. Não foram identificados sintomas ansiosos clinicamente relevantes.",
    "Leve": "O BAI aponta para ansiedade de intensidade leve. Os sintomas merecem acompanhamento, porém não indicam comprometimento funcional significativo.",
    "Moderado": "Os resultados do BAI indicam ansiedade moderada, sugerindo a presença de sintomas somáticos e cognitivos de ansiedade com repercussão funcional. Recomenda-se intervenção psicoterapêutica.",
    "Grave": "O BAI revela ansiedade de intensidade grave, com sintomas somáticos e cognitivos expressivos. Indica-se tratamento psicoterapêutico e avaliação psiquiátrica.",
  },
  bdi: {
    "Mínimo": "O Inventário de Depressão de Beck aponta nível mínimo de depressão. Não foram identificados indicadores depressivos clinicamente significativos.",
    "Leve": "O BDI-II indica sintomatologia depressiva leve. Recomenda-se monitoramento e intervenção preventiva.",
    "Moderado": "Os resultados do BDI-II apontam para depressão moderada, com impacto funcional nas atividades cotidianas. Indica-se acompanhamento psicoterapêutico estruturado.",
    "Grave": "O BDI-II revela sintomatologia depressiva grave, com comprometimento funcional importante e possível risco. Recomenda-se intervenção imediata com psicoterapia e avaliação psiquiátrica.",
  },
  bhs: {
    "Mínimo": "A Escala de Desesperança de Beck indica nível mínimo de desesperança. O(a) avaliando(a) demonstra expectativas positivas em relação ao futuro.",
    "Leve": "O BHS aponta para desesperança leve. Embora haja algumas cognições pessimistas, o nível não sugere risco significativo.",
    "Moderado": "Os resultados indicam desesperança moderada, refletindo expectativas negativas sobre o futuro que merecem atenção clínica. Sugere-se trabalho psicoterapêutico focado em reestruturação cognitiva.",
    "Grave": "O BHS revela desesperança grave, constituindo fator de risco importante. Indica-se avaliação de risco, intervenção terapêutica intensiva e monitoramento contínuo.",
  },
  asrs: {
    "Sem indicativo": "O ASRS-18 não identificou indicativos de Transtorno de Déficit de Atenção e Hiperatividade. Os padrões de atenção e atividade relatados encontram-se dentro dos parâmetros esperados.",
    "Provável": "Os resultados do ASRS-18 sugerem indicativo provável de TDAH. Recomenda-se avaliação neuropsicológica aprofundada para confirmação diagnóstica.",
    "Altamente provável": "O ASRS-18 indica alta probabilidade de TDAH, com sintomas expressivos de desatenção e/ou hiperatividade-impulsividade. Indica-se avaliação neuropsicológica completa e acompanhamento multidisciplinar.",
  },
  g36: {
    "Inferior": "O desempenho no G-36 classifica-se como Inferior, sugerindo capacidade intelectual geral abaixo da média da população de referência. Recomenda-se investigação complementar.",
    "Médio Inferior": "O resultado no G-36 situa-se na faixa Médio Inferior, indicando capacidade intelectual geral ligeiramente abaixo da média. O desempenho pode refletir fatores contextuais ou educacionais.",
    "Médio": "O G-36 indica capacidade intelectual geral na faixa Média, compatível com o desempenho da maioria da população de referência.",
    "Médio Superior": "O desempenho no G-36 classifica-se como Médio Superior, indicando capacidade intelectual geral acima da média da população de referência.",
    "Superior": "O resultado no G-36 situa-se na faixa Superior, evidenciando capacidade intelectual geral significativamente acima da média.",
    "Muito Superior": "O G-36 indica capacidade intelectual geral na faixa Muito Superior, representando desempenho excepcional em raciocínio não verbal.",
  },
  teadi: {
    "Inferior": "O TEADI indica desempenho inferior em atenção dividida, sugerindo dificuldades na capacidade de distribuir recursos atencionais entre estímulos simultâneos.",
    "Médio Inferior": "Os resultados do TEADI apontam para atenção dividida na faixa Médio Inferior. O(a) avaliando(a) pode apresentar alguma dificuldade em situações que demandam processamento simultâneo.",
    "Médio": "O TEADI indica capacidade de atenção dividida na faixa Média, compatível com o desempenho esperado para a faixa etária e escolaridade.",
    "Médio Superior": "O desempenho no TEADI situa-se na faixa Médio Superior, indicando boa capacidade de distribuir atenção entre múltiplos estímulos.",
    "Superior": "O TEADI revela desempenho superior em atenção dividida, evidenciando excelente capacidade de processamento simultâneo de informações.",
  },
  tealt: {
    "Inferior": "O TEALT indica desempenho inferior em atenção alternada, sugerindo dificuldades na flexibilidade atencional e alternância entre tarefas.",
    "Médio Inferior": "Os resultados do TEALT apontam para atenção alternada na faixa Médio Inferior. O(a) avaliando(a) pode apresentar lentidão na alternância entre demandas cognitivas.",
    "Médio": "O TEALT indica capacidade de atenção alternada na faixa Média, com flexibilidade atencional compatível com o esperado.",
    "Médio Superior": "O desempenho no TEALT situa-se na faixa Médio Superior, indicando boa flexibilidade atencional e capacidade de alternar entre tarefas.",
    "Superior": "O TEALT revela desempenho superior em atenção alternada, evidenciando excelente flexibilidade e velocidade de alternância cognitiva.",
  },
};

// NEO — textos interpretativos por domínio × classificação
// O montador (gerarTextoInterpretativo) já imprime o nome do domínio, a
// classificação e o percentil num cabeçalho próprio. Por isso estes textos
// entram direto no que o escore diz sobre a pessoa, sem repetir "o escore
// foi alto, indicando...". Tom assertivo por decisão do Bruno.
export const templatesNeoDominio: Record<string, Record<string, string>> = {
  N: {
    "Muito Baixo": "A estabilidade emocional é notável. O(a) avaliando(a) mantém-se calmo(a) e equilibrado(a) sob pressão e se recupera rápido de estressores, com pouca reverberação afetiva.",
    "Baixo": "A regulação afetiva é consistente. O(a) avaliando(a) tolera bem frustração e apresenta baixa vulnerabilidade ao estresse.",
    "Médio": "O padrão emocional acompanha o da população de referência: há reatividade a estressores, sem que ela comprometa o funcionamento.",
    "Alto": "O(a) avaliando(a) experiencia emoções negativas com intensidade e frequência acima da média. Ansiedade, irritabilidade e oscilação de humor integram o funcionamento cotidiano.",
    "Muito Alto": "Há vulnerabilidade emocional significativa. Ansiedade, humor depressivo e dificuldade de regulação afetiva aparecem de forma acentuada e interferem no funcionamento.",
  },
  E: {
    "Muito Baixo": "O(a) avaliando(a) prefere a solidão e ambientes tranquilos. É introspectivo(a) e reservado(a), e o contato social prolongado consome mais energia do que repõe.",
    "Baixo": "O funcionamento é introvertido. O(a) avaliando(a) prioriza atividades individuais e mantém círculo social reduzido, por preferência e não por dificuldade.",
    "Médio": "Sociabilidade e necessidade de tempo pessoal se equilibram: o(a) avaliando(a) transita entre os dois sem custo relevante.",
    "Alto": "O(a) avaliando(a) é sociável, assertivo(a) e energético(a). Busca ativamente estimulação social e funciona bem em contextos de grupo.",
    "Muito Alto": "A orientação interpessoal é forte e constante. O(a) avaliando(a) exerce assertividade com naturalidade e busca estimulação social de modo persistente.",
  },
  O: {
    "Muito Baixo": "O(a) avaliando(a) prefere o familiar e o convencional. Valoriza tradição e estabilidade, e vê pouco ganho em revisar o que já está resolvido.",
    "Baixo": "A abordagem é prática e concreta. O(a) avaliando(a) tem menor interesse por questões abstratas ou artísticas e privilegia o que tem aplicação direta.",
    "Médio": "Curiosidade intelectual e pragmatismo aparecem em proporção equivalente: o(a) avaliando(a) se abre ao novo sem abrir mão do que já funciona.",
    "Alto": "O(a) avaliando(a) é intelectualmente curioso(a), sensível esteticamente e receptivo(a) a ideias e experiências novas.",
    "Muito Alto": "A vida imaginativa é rica e a sensibilidade estética e intelectual é acentuada. O(a) avaliando(a) busca o novo de forma ativa e produz a partir dele.",
  },
  A: {
    "Muito Baixo": "As relações são conduzidas em chave competitiva e independente. O(a) avaliando(a) mantém ceticismo quanto às intenções alheias e não cede terreno com facilidade.",
    "Baixo": "A postura relacional é crítica e assertiva. O(a) avaliando(a) sustenta os próprios interesses quando eles colidem com a harmonia do grupo.",
    "Médio": "Cooperação e assertividade se equilibram: o(a) avaliando(a) coopera sem abrir mão de posição própria.",
    "Alto": "O(a) avaliando(a) é cooperativo(a) e empático(a), atento(a) às necessidades dos outros e ativo(a) na preservação da harmonia relacional.",
    "Muito Alto": "A orientação prossocial é forte. O(a) avaliando(a) confia nas pessoas e cede com facilidade — disposição que favorece o vínculo e pede atenção quanto à própria delimitação.",
  },
  C: {
    "Muito Baixo": "Planejamento, disciplina e metas de longo prazo são áreas de dificuldade. A desorganização é consistente e gera custo prático.",
    "Baixo": "O estilo é flexível e espontâneo. O(a) avaliando(a) dá menos ênfase a organização e ao cumprimento rigoroso de obrigações.",
    "Médio": "Organização, responsabilidade e orientação para objetivos estão em nível adequado ao funcionamento cotidiano.",
    "Alto": "O(a) avaliando(a) é organizado(a), disciplinado(a) e orientado(a) para realizações, com senso de dever bem estabelecido.",
    "Muito Alto": "A autodisciplina é elevada e a orientação para metas e desempenho é forte, com traço perfeccionista — configuração que sustenta alto rendimento e cobra custo em flexibilidade.",
  },
};

// NEO — textos interpretativos por faceta × classificação (abreviados)
export const templatesNeoFaceta: Record<string, Record<string, string>> = {
  N1: { "Muito Baixo": "Baixa propensão à ansiedade.", "Baixo": "Pouca tendência ansiosa.", "Médio": "Níveis de ansiedade dentro do esperado.", "Alto": "Tendência elevada à ansiedade e apreensão.", "Muito Alto": "Propensão acentuada à ansiedade e preocupação constante." },
  N2: { "Muito Baixo": "Rara expressão de hostilidade.", "Baixo": "Baixa tendência à irritação.", "Médio": "Expressão de hostilidade dentro do esperado.", "Alto": "Tendência à irritabilidade e raiva.", "Muito Alto": "Propensão acentuada à hostilidade e raiva." },
  N3: { "Muito Baixo": "Rara tendência ao humor depressivo.", "Baixo": "Pouca propensão depressiva.", "Médio": "Tendência ao humor depressivo dentro do esperado.", "Alto": "Propensão a sentimentos de tristeza e culpa.", "Muito Alto": "Vulnerabilidade acentuada ao humor depressivo." },
  N4: { "Muito Baixo": "Muito pouca tendência ao embaraço social.", "Baixo": "Baixa sensibilidade ao constrangimento.", "Médio": "Sensibilidade ao embaraço dentro do esperado.", "Alto": "Tendência elevada ao embaraço e autoconsciência.", "Muito Alto": "Acentuada propensão ao constrangimento em situações sociais." },
  N5: { "Muito Baixo": "Excelente controle de impulsos.", "Baixo": "Bom autocontrole.", "Médio": "Controle de impulsos adequado.", "Alto": "Dificuldade em resistir a impulsos e desejos.", "Muito Alto": "Acentuada dificuldade no controle de impulsos." },
  N6: { "Muito Baixo": "Alta resiliência ao estresse.", "Baixo": "Boa capacidade de lidar com pressão.", "Médio": "Vulnerabilidade ao estresse dentro do esperado.", "Alto": "Dificuldade em lidar com situações estressantes.", "Muito Alto": "Alta vulnerabilidade ao estresse e à pressão." },
  E1: { "Muito Baixo": "Pouca necessidade de vínculos afetivos.", "Baixo": "Tendência ao distanciamento interpessoal.", "Médio": "Capacidade de acolhimento adequada.", "Alto": "Facilidade em estabelecer vínculos afetivos.", "Muito Alto": "Forte necessidade de proximidade e acolhimento." },
  E2: { "Muito Baixo": "Forte preferência pela solidão.", "Baixo": "Tendência a evitar grupos.", "Médio": "Sociabilidade dentro do esperado.", "Alto": "Gosta de estar em grupo e socializar.", "Muito Alto": "Forte necessidade de contato social constante." },
  E3: { "Muito Baixo": "Postura submissa e pouco assertiva.", "Baixo": "Baixa assertividade.", "Médio": "Assertividade adequada.", "Alto": "Postura assertiva e dominante.", "Muito Alto": "Forte tendência à liderança e dominância." },
  E4: { "Muito Baixo": "Ritmo de vida muito lento e passivo.", "Baixo": "Baixo nível de atividade.", "Médio": "Nível de atividade adequado.", "Alto": "Pessoa ativa e energética.", "Muito Alto": "Ritmo de vida muito acelerado e intenso." },
  E5: { "Muito Baixo": "Evita estímulos intensos.", "Baixo": "Pouca busca por sensações.", "Médio": "Busca de sensações dentro do esperado.", "Alto": "Aprecia experiências excitantes e novidades.", "Muito Alto": "Forte busca por estímulos intensos e excitação." },
  E6: { "Muito Baixo": "Pouca expressão de alegria.", "Baixo": "Tendência a emoções positivas reduzidas.", "Médio": "Expressão de emoções positivas adequada.", "Alto": "Tendência a experienciar alegria e otimismo.", "Muito Alto": "Forte expressão de alegria, entusiasmo e otimismo." },
  O1: { "Muito Baixo": "Pouca vida imaginativa.", "Baixo": "Imaginação limitada.", "Médio": "Fantasia e imaginação dentro do esperado.", "Alto": "Rica vida imaginativa e criativa.", "Muito Alto": "Imaginação muito fértil e ativa." },
  O2: { "Muito Baixo": "Pouca sensibilidade estética.", "Baixo": "Baixo interesse artístico.", "Médio": "Apreciação estética dentro do esperado.", "Alto": "Sensibilidade estética e artística.", "Muito Alto": "Profunda sensibilidade artística e estética." },
  O3: { "Muito Baixo": "Pouca consciência emocional.", "Baixo": "Atenção reduzida às emoções.", "Médio": "Consciência emocional adequada.", "Alto": "Valorização e atenção às emoções próprias.", "Muito Alto": "Intensa consciência e valorização da experiência emocional." },
  O4: { "Muito Baixo": "Forte preferência por rotinas fixas.", "Baixo": "Pouca disposição para novas atividades.", "Médio": "Abertura a novas atividades dentro do esperado.", "Alto": "Disposição para experimentar atividades variadas.", "Muito Alto": "Forte necessidade de diversidade e novas experiências." },
  O5: { "Muito Baixo": "Pouco interesse intelectual.", "Baixo": "Curiosidade intelectual limitada.", "Médio": "Curiosidade intelectual dentro do esperado.", "Alto": "Apreço por questões intelectuais e abstratas.", "Muito Alto": "Forte curiosidade intelectual e filosófica." },
  O6: { "Muito Baixo": "Forte adesão a valores tradicionais e convencionais.", "Baixo": "Tendência conservadora em valores.", "Médio": "Valores dentro do padrão convencional.", "Alto": "Disposição para reavaliação de valores sociais e morais.", "Muito Alto": "Postura questionadora e independente em relação a valores." },
  A1: { "Muito Baixo": "Forte desconfiança dos outros.", "Baixo": "Tendência ao ceticismo interpessoal.", "Médio": "Confiança interpessoal adequada.", "Alto": "Tendência a confiar nas pessoas.", "Muito Alto": "Confiança muito elevada nas intenções alheias." },
  A2: { "Muito Baixo": "Tendência à manipulação.", "Baixo": "Reserva e cautela nas interações.", "Médio": "Franqueza dentro do esperado.", "Alto": "Pessoa franca e transparente.", "Muito Alto": "Transparência acentuada, sem filtros sociais." },
  A3: { "Muito Baixo": "Pouca preocupação com os outros.", "Baixo": "Altruísmo reduzido.", "Médio": "Preocupação com os outros dentro do esperado.", "Alto": "Genuína preocupação com o bem-estar alheio.", "Muito Alto": "Forte orientação altruísta." },
  A4: { "Muito Baixo": "Postura confrontativa e competitiva.", "Baixo": "Pouca disposição para ceder.", "Médio": "Complacência dentro do esperado.", "Alto": "Tendência a ceder e evitar conflitos.", "Muito Alto": "Dificuldade em se posicionar e defender interesses." },
  A5: { "Muito Baixo": "Forte autoconfiança, possível arrogância.", "Baixo": "Baixa modéstia.", "Médio": "Modéstia dentro do esperado.", "Alto": "Pessoa modesta e humilde.", "Muito Alto": "Modéstia excessiva, tendência à autodesvalorização." },
  A6: { "Muito Baixo": "Pouca sensibilidade emocional nas relações.", "Baixo": "Pragmatismo nas relações.", "Médio": "Sensibilidade interpessoal adequada.", "Alto": "Empatia e sensibilidade às necessidades alheias.", "Muito Alto": "Sensibilidade emocional muito acentuada." },
  C1: { "Muito Baixo": "Baixa autoeficácia e senso de competência.", "Baixo": "Autoeficácia reduzida.", "Médio": "Senso de competência adequado.", "Alto": "Bom senso de capacidade e preparo.", "Muito Alto": "Forte senso de autoeficácia e competência." },
  C2: { "Muito Baixo": "Forte desorganização.", "Baixo": "Pouca organização.", "Médio": "Organização dentro do esperado.", "Alto": "Pessoa organizada e metódica.", "Muito Alto": "Organização excessiva, possível rigidez." },
  C3: { "Muito Baixo": "Pouca adesão a obrigações e normas.", "Baixo": "Senso de dever reduzido.", "Médio": "Senso de dever adequado.", "Alto": "Forte adesão a princípios éticos e obrigações.", "Muito Alto": "Rigor moral e ético muito acentuado." },
  C4: { "Muito Baixo": "Pouca ambição e orientação para metas.", "Baixo": "Baixo esforço por realizações.", "Médio": "Motivação para realizações dentro do esperado.", "Alto": "Pessoa ambiciosa e orientada para objetivos.", "Muito Alto": "Forte ambição, possível perfeccionismo." },
  C5: { "Muito Baixo": "Acentuada procrastinação e falta de autodisciplina.", "Baixo": "Dificuldade com autodisciplina.", "Médio": "Autodisciplina dentro do esperado.", "Alto": "Boa capacidade de se automotivar e manter foco.", "Muito Alto": "Autodisciplina muito elevada." },
  C6: { "Muito Baixo": "Tendência a agir sem pensar.", "Baixo": "Pouca ponderação antes de agir.", "Médio": "Ponderação dentro do esperado.", "Alto": "Cautela e reflexão antes de agir.", "Muito Alto": "Ponderação excessiva, possível indecisão." },
};

export const templatesNeoFFIDominio = templatesNeoDominio;
