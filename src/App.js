import React, { useState } from 'react';

// Icônes en tant que composants simples (sans lucide-react pour simplifier)
const FileTextIcon = () => (
  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const ZapIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const CopyIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const DownloadIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const AlertIcon = () => (
  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

function App() {
  const [resume, setResume] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [optimizedResume, setOptimizedResume] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const optimizeResume = async () => {
    if (!resume.trim() || !jobDescription.trim()) {
      setError('Veuillez remplir les deux champs avant de continuer.');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      // Version démo - optimisation simple côté client
      const optimizedCV = await simulateAIOptimization(resume, jobDescription);
      setOptimizedResume(optimizedCV);
      
    } catch (err) {
      setError('Erreur lors de l\'optimisation: ' + err.message);
      console.error('Erreur complète:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Simulation d'optimisation IA (version démo)
  const simulateAIOptimization = async (cv, job) => {
    // Simule un délai API
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Extraction de mots-clés de base du job
    const jobKeywords = extractKeywords(job);
    
    // Optimisation basique
    let optimized = cv;
    
    // Ajoute une section d'objectif basée sur le poste
    const jobTitle = extractJobTitle(job);
    if (jobTitle) {
      optimized = `# OBJECTIF PROFESSIONNEL\n\nRecherche un poste de ${jobTitle} où je pourrai mettre à profit mes compétences et mon expérience pour contribuer au succès de l'entreprise.\n\n` + optimized;
    }
    
    // Ajoute des mots-clés pertinents
    optimized += `\n\n## MOTS-CLÉS PERTINENTS\n${jobKeywords.slice(0, 8).join(' • ')}\n`;
    
    // Ajoute un message d'optimisation
    optimized += `\n\n---\n✨ CV OPTIMISÉ AUTOMATIQUEMENT ✨\nAdapté pour le poste : ${jobTitle || 'Poste visé'}\nMots-clés intégrés : ${jobKeywords.length} détectés\n---`;
    
    return optimized;
  };

  const extractJobTitle = (text) => {
    const patterns = [
      /recherchons un[e]? ([^.\n]+)/i,
      /poste de ([^.\n]+)/i,
      /nous recrutons un[e]? ([^.\n]+)/i,
      /titre du poste[:\s]+([^.\n]+)/i
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) return match[1].trim();
    }
    return null;
  };

  const extractKeywords = (text) => {
    const techWords = [
      'JavaScript', 'React', 'Node.js', 'Python', 'Java', 'HTML', 'CSS', 
      'TypeScript', 'Vue.js', 'Angular', 'MongoDB', 'SQL', 'Git', 'Docker',
      'AWS', 'Azure', 'Kubernetes', 'API', 'REST', 'GraphQL', 'Agile', 'Scrum'
    ];
    
    const skillWords = [
      'leadership', 'communication', 'gestion', 'analyse', 'créativité',
      'autonomie', 'équipe', 'projet', 'innovation', 'stratégie'
    ];
    
    const allKeywords = [...techWords, ...skillWords];
    return allKeywords.filter(keyword => 
      text.toLowerCase().includes(keyword.toLowerCase())
    );
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      // Feedback visuel simple
      alert('CV copié dans le presse-papiers !');
    });
  };

  const downloadAsText = (content, filename) => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-6 shadow-lg">
            <FileTextIcon />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">
            Optimiseur de CV IA
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Transformez votre CV en quelques secondes grâce à l'intelligence artificielle pour maximiser vos chances
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* CV Input */}
          <div className="group">
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">📄</span>
                </div>
                <h2 className="text-xl font-bold text-gray-800">Votre CV actuel</h2>
              </div>
              <textarea
                value={resume}
                onChange={(e) => setResume(e.target.value)}
                placeholder="Collez ici votre CV (format texte ou markdown)...

Exemple:
# Jean Dupont
Développeur Full Stack

## Expérience
- 3 ans en développement web
- Maîtrise JavaScript, React, Node.js

## Compétences
- Frontend: React, Vue.js, HTML/CSS
- Backend: Node.js, Python
- Base de données: MongoDB, PostgreSQL"
                className="w-full h-80 p-6 bg-white/50 border-0 rounded-2xl resize-none focus:ring-4 focus:ring-blue-500/20 focus:bg-white/80 transition-all duration-300 text-gray-700 placeholder-gray-400"
              />
            </div>
          </div>

          {/* Job Description Input */}
          <div className="group">
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">💼</span>
                </div>
                <h2 className="text-xl font-bold text-gray-800">Description du poste</h2>
              </div>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Collez ici la description du poste visé...

Exemple:
Nous recherchons un Développeur Frontend Senior

Responsabilités:
- Développer des interfaces utilisateur avec React
- Collaborer avec l'équipe UX/UI
- Optimiser les performances des applications

Compétences requises:
- 5+ ans d'expérience en React
- Maîtrise de TypeScript
- Expérience en tests automatisés"
                className="w-full h-80 p-6 bg-white/50 border-0 rounded-2xl resize-none focus:ring-4 focus:ring-purple-500/20 focus:bg-white/80 transition-all duration-300 text-gray-700 placeholder-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 mx-auto max-w-2xl">
            <div className="bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-2xl p-6 flex items-center gap-4 shadow-lg">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <AlertIcon />
              </div>
              <span className="text-red-700 font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Optimize Button */}
        <div className="text-center mb-12">
          <button
            onClick={optimizeResume}
            disabled={isLoading}
            className="group relative px-12 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg rounded-2xl hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 disabled:transform-none"
          >
            <div className="flex items-center gap-3">
              <ZapIcon className={`w-6 h-6 ${isLoading ? 'animate-pulse' : 'group-hover:rotate-12'} transition-transform duration-300`} />
              {isLoading ? 'Magie en cours...' : 'Optimiser mon CV'}
            </div>
            {!isLoading && (
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            )}
          </button>
        </div>

        {/* Results */}
        {optimizedResume && (
          <div className="space-y-8">
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center">
                    <span className="text-white font-bold text-xl">✨</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">CV Optimisé</h2>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => copyToClipboard(optimizedResume)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100/80 text-gray-700 rounded-xl hover:bg-gray-200/80 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    <CopyIcon />
                    Copier
                  </button>
                  <button
                    onClick={() => downloadAsText(optimizedResume, 'cv_optimise.txt')}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    <DownloadIcon />
                    Télécharger
                  </button>
                </div>
              </div>
              
              <div className="bg-white/60 border border-gray-200/50 rounded-2xl p-8 shadow-inner">
                <pre className="whitespace-pre-wrap text-sm text-gray-800 leading-relaxed">
                  {optimizedResume}
                </pre>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm border border-blue-200/30 rounded-3xl p-8 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold">💡</span>
                </div>
                <div>
                  <h3 className="font-bold text-blue-900 mb-4 text-lg">Prochaines étapes</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-blue-800">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-xs font-bold">1</div>
                      <span>Copiez le CV optimisé</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-xs font-bold">2</div>
                      <span>Mettez en forme dans Word/Google Docs</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-xs font-bold">3</div>
                      <span>Relisez et personnalisez</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-xs font-bold">4</div>
                      <span>Exportez en PDF</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
