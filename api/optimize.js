const optimizeResume = async () => {
    if (!resume.trim() || !jobDescription.trim()) {
      setError('Veuillez remplir les deux champs avant de continuer.');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/optimize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resume: resume,
          jobDescription: jobDescription
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de l\'optimisation');
      }

      const data = await response.json();
      setOptimizedResume(data.optimizedResume);
      
    } catch (err) {
      setError('Erreur lors de l\'optimisation: ' + err.message);
      console.error('Erreur complète:', err);
    } finally {
      setIsLoading(false);
    }
  };
