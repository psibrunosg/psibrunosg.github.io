import fs from 'fs';
import path from 'path';

// O usuário pediu especificamente voz da Nvidia, mas preparamos o script
// para lidar com falhas usando fallbacks (ex: OpenAI, Edge TTS) no 9router.
const NINEROUTER_URL = process.env.NINEROUTER_URL || "https://api.9router.com";
const NINEROUTER_KEY = process.env.NINEROUTER_KEY || "";

const MODEL = "nvidia/tts"; // O modelo NVIDIA sugerido. Fallbacks podem ser tentados se falhar.

const OUT_DIR = path.resolve(process.cwd(), "public/audio");

// Roteiro do vídeo Luta ou Fuga (Amígdala vs Pré-Frontal)
const lines = [
  { id: "intro", text: "Você já sentiu o coração acelerar do nada? Isso é o seu cérebro acionando o modo Luta ou Fuga." },
  { id: "amygdala", text: "Tudo começa aqui, na Amígdala. Ela é o nosso sistema de alarme, focada em detectar ameaças em frações de segundo." },
  { id: "brainstem", text: "O alarme desce para o Tronco Encefálico, disparando batimentos cardíacos rápidos e respiração ofegante." },
  { id: "prefrontal", text: "Enquanto isso, o Córtex Pré-Frontal tenta avaliar a situação de forma lógica." },
  { id: "conflict", text: "Mas, num estado de estresse agudo, a Amígdala rouba a energia, desligando nosso lado racional." },
  { id: "conclusion", text: "Por isso, a primeira etapa para acalmar a mente é acalmar o corpo. Respire fundo e devolva o controle ao Córtex Pré-Frontal." }
];

async function generateTTS(line) {
  console.log(`Gerando áudio para: ${line.id}...`);
  try {
    const res = await fetch(`${NINEROUTER_URL}/v1/audio/speech`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NINEROUTER_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: MODEL,
        input: line.text,
        // voice: "nome_da_voz_se_necessario"
      })
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Erro na API (${res.status}): ${errorText}`);
    }

    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (!fs.existsSync(OUT_DIR)) {
      fs.mkdirSync(OUT_DIR, { recursive: true });
    }

    const filePath = path.join(OUT_DIR, `${line.id}.mp3`);
    fs.writeFileSync(filePath, buffer);
    console.log(`Salvo: ${filePath}`);
    return true;
  } catch (error) {
    console.error(`Falha ao gerar ${line.id}:`, error.message);
    return false;
  }
}

async function main() {
  if (!NINEROUTER_KEY) {
    console.warn("⚠️ NINEROUTER_KEY não definida no ambiente.");
    console.warn("Se der erro de autenticação, avise o Agente para que possamos usar o Voice Box (fallback).");
  }

  let successCount = 0;
  for (const line of lines) {
    const success = await generateTTS(line);
    if (success) successCount++;
  }

  if (successCount < lines.length) {
    console.error(`\n❌ Apenas ${successCount} de ${lines.length} áudios foram gerados com sucesso.`);
    console.error("Como você mencionou, se a voz da Nvidia der erro, avise o Agente para utilizarmos o prompt que usa o Voice Box.");
  } else {
    console.log(`\n✅ Todos os áudios gerados com sucesso!`);
  }
}

main();
