// api/optimize.js
export default async function handler(req, res) {
  // Configuration CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { resume, jobDescription } = req.body;

    if (!resume || !jobDescription) {
      return res.status(400).json({ error: 'CV et description du poste requis' });
    }

    // Appel à l'API Claude
    const optimizedResume = await optimizeWithClaude(resume, jobDescription);

    res.status(200).json({ optimizedResume });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ error: 'Erreur lors de l\'optimisation: ' + error.message });
  }
}

async function optimizeWithClaude(resume, jobDescription) {
  const prompt = `Tu es un expert en recrutement et optimisation de CV. J'ai un CV et une description de poste. Adapte le CV pour maximiser les chances d'être retenu pour ce poste.

CV ACTUEL:
${resume}

DESCRIPTION DU POSTE:
${jobDescription}

CONSIGNES:
- Réorganise le CV pour mettre en avant les éléments les plus pertinents pour ce poste
- Reformule les expériences en utilisant des mots-clés de la description du poste
- Quantifie les réalisations quand c'est possible
- Garde un format professionnel et structuré
- Assure-toi que le CV reste authentique et véridique
- Améliore la présentation sans inventer d'informations

IMPORTANT: Réponds UNIQUEMENT avec le CV optimisé en format texte, sans commentaires supplémentaires.`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`API Claude error: ${errorData.error?.message || 'Unknown error'}`);
  }

  const data = await response.json();
  return data.content[0].text;
}
