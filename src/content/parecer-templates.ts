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
export const templatesNeoDominio: Record<string, Record<string, string>> = {
  N: {
    "Muito Baixo": "O domínio Neuroticismo apresentou escore muito baixo, indicando notável estabilidade emocional. O(a) avaliando(a) tende a ser emocionalmente equilibrado(a), calmo(a) e resiliente diante de estressores.",
    "Baixo": "O escore baixo em Neuroticismo sugere boa estabilidade emocional. O(a) avaliando(a) demonstra adequada regulação afetiva e menor vulnerabilidade ao estresse.",
    "Médio": "O Neuroticismo situa-se na faixa média, indicando padrão emocional dentro do esperado para a população de referência.",
    "Alto": "O escore alto em Neuroticismo indica tendência a experienciar emoções negativas com maior intensidade e frequência, incluindo ansiedade, irritabilidade e instabilidade emocional.",
    "Muito Alto": "O Neuroticismo apresentou escore muito alto, sugerindo vulnerabilidade emocional significativa, com propensão acentuada a ansiedade, humor depressivo e dificuldades de regulação afetiva.",
  },
  E: {
    "Muito Baixo": "A Extroversão apresentou escore muito baixo, indicando forte preferência por solidão e ambientes tranquilos. O(a) avaliando(a) tende a ser introspectivo(a) e reservado(a).",
    "Baixo": "O escore baixo em Extroversão sugere tendência à introversão, com preferência por atividades individuais e círculos sociais reduzidos.",
    "Médio": "A Extroversão situa-se na faixa média, indicando equilíbrio entre sociabilidade e necessidade de tempo pessoal.",
    "Alto": "O escore alto em Extroversão indica pessoa sociável, assertiva e energética, com tendência a buscar estimulação social e experiências ativas.",
    "Muito Alto": "A Extroversão apresentou escore muito alto, sugerindo forte orientação interpessoal, alta assertividade e busca constante de estimulação social.",
  },
  O: {
    "Muito Baixo": "A Abertura à Experiência apresentou escore muito baixo, indicando forte preferência pelo familiar e convencional. O(a) avaliando(a) tende a valorizar tradição e estabilidade.",
    "Baixo": "O escore baixo em Abertura sugere preferência por abordagens práticas e concretas, com menor interesse por questões abstratas ou artísticas.",
    "Médio": "A Abertura à Experiência situa-se na faixa média, indicando equilíbrio entre curiosidade intelectual e pragmatismo.",
    "Alto": "O escore alto em Abertura indica curiosidade intelectual, sensibilidade estética e receptividade a novas ideias e experiências.",
    "Muito Alto": "A Abertura apresentou escore muito alto, sugerindo forte criatividade, rica vida imaginativa e acentuada sensibilidade estética e intelectual.",
  },
  A: {
    "Muito Baixo": "A Amabilidade apresentou escore muito baixo, indicando postura competitiva e independente nas relações interpessoais, com tendência ao ceticismo em relação às intenções alheias.",
    "Baixo": "O escore baixo em Amabilidade sugere postura mais crítica e assertiva nas relações, priorizando interesses pessoais sobre a harmonia grupal.",
    "Médio": "A Amabilidade situa-se na faixa média, indicando equilíbrio entre cooperação e assertividade nas relações interpessoais.",
    "Alto": "O escore alto em Amabilidade indica pessoa cooperativa, empática e sensível às necessidades dos outros, valorizando harmonia nas relações.",
    "Muito Alto": "A Amabilidade apresentou escore muito alto, sugerindo forte orientação prossocial, confiança nas pessoas e disposição acentuada para ceder e cooperar.",
  },
  C: {
    "Muito Baixo": "A Conscienciosidade apresentou escore muito baixo, indicando tendência à desorganização e dificuldade com planejamento, disciplina e metas de longo prazo.",
    "Baixo": "O escore baixo em Conscienciosidade sugere estilo mais flexível e espontâneo, com menor ênfase em organização e cumprimento rigoroso de obrigações.",
    "Médio": "A Conscienciosidade situa-se na faixa média, indicando nível adequado de organização, responsabilidade e orientação para objetivos.",
    "Alto": "O escore alto em Conscienciosidade indica pessoa organizada, disciplinada e orientada para realizações, com forte senso de dever.",
    "Muito Alto": "A Conscienciosidade apresentou escore muito alto, sugerindo elevado nível de autodisciplina, perfeccionismo e forte orientação para metas e desempenho.",
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
