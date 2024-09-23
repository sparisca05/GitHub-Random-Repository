import { useState, useEffect } from 'react'
import './App.css'
import axios from 'axios';

interface Language {
  title: string;
  value: string;
}

interface Repository {
  name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  html_url: string;
}

function App() {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('Select a language');
  const [loading, setLoading] = useState(false);

  const [repository, setRepository] = useState<Repository | null>(null);
  const [error, setError] = useState('');  

  useEffect(() => {
    axios.get('https://raw.githubusercontent.com/kamranahmedse/githunt/master/src/components/filters/language-filter/languages.json')
      .then((response) => setLanguages(response.data));
  }, []);

  const fetchRandomRepo = async () => {
    try {
      setRepository(null);  // Limpiar el repositorio actual
      setLoading(true);  // Mostrar mensaje de carga
      setError('');  // Limpiar errores previos
      // Hacer una petición GET a la API de GitHub usando Axios
      const response = await axios.get(`https://api.github.com/search/repositories?q=language:${selectedLanguage}&sort=stars&order=desc`);
      const repos = response.data.items;  // Obtener la lista de repositorios
      if (repos.length > 0) {
        const randomRepo = repos[Math.floor(Math.random() * repos.length)];  // Seleccionar un repositorio aleatorio
        setRepository(randomRepo);  // Actualizar el estado con el repositorio seleccionado
      } else {
        setLoading(false);
        setError('No repositories found.');
      }
    } catch (err) {
      setLoading(false);
      setError('Error fetching repositories.');
    }
  };

  // Función para alternar el dropdown
  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <>
      <div>
        <h2>GitHub Repository Finder</h2>
      </div>
      <div className='finder'>
        <button onClick={toggleDropdown}>{selectedLanguage}</button>
        <div>
          {isOpen && (
            <ul
              className='dropdown'
            >
              {languages.map((language, index) => (
                <li
                  key={index}
                  onClick={() => {
                    setSelectedLanguage(`${language.title}`);
                    setIsOpen(false);
                    fetchRandomRepo();
                  }}
                >
                  {language.title}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          {error ? <div className='output' style={{backgroundColor: '#ffc9c9'}}>{error}</div> : 
            <div className='output'>
              {repository ? (
                <div className='repository'>
                  <h2>{repository.name}</h2>
                  <p>{repository.description || 'No hay descripción disponible'}</p>
                  <div style={{display: 'flex'}}>
                    <p>
                      <strong>Stars:</strong> {repository.stargazers_count}
                    </p>
                    <p>
                      <strong>Forks:</strong> {repository.forks_count}
                    </p>
                    <p>
                      <strong>Issues:</strong> {repository.open_issues_count}
                    </p>
                    <p>
                      <a href={repository.html_url} target="_blank" rel="noopener noreferrer">
                        See on GitHub
                      </a>
                    </p>
                  </div>
                </div>
              ) : loading ?
                <p>Loading, please wait...</p> : <p>Please select a language</p>
              }
            </div>
          }
        </div>
        <div>
          {selectedLanguage === 'Select a language' ? null 
          : 
            error ? 
              <button style={{backgroundColor: 'red'}} className='search-button' onClick={fetchRandomRepo}>Click to retry</button> 
              :
              <button className='search-button' onClick={fetchRandomRepo}>Refresh</button>
          }
        </div>
      </div>
    </>
  )
}

export default App
