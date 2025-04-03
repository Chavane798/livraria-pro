"use client";
import { useState, useEffect, useMemo } from "react";
import { analytics } from "../components/Data_Base_API";
import { logEvent } from "firebase/analytics";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { storage } from "../components/Data_Base_API";
import Head from "next/head";
import Link from "next/link";

function Page() {
  const [currentPath] = useState("");
  const [itemsList, setItemsList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showPopup, setShowPopup] = useState(true);
  const [categorizedItems, setCategorizedItems] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  // Categorias pré-definidas
  const categories = useMemo(() => ({
    CSS: [],
    HTML: [],
    Java: [],
    PHP: [],
    C: [],
    JavaScript: [],
    Python: [],
    Outros: [],
  }), []);

  // Analytics
  useEffect(() => {
    if (analytics) {
      logEvent(analytics, "page_view", {
        page_title: "Página Inicial",
        page_location: window.location.href,
      });
    }

    // Verificar preferência de tema do usuário
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);

  // Buscar itens do storage
  const fetchStorageItems = async (path) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const directoryRef = ref(storage, path);
      const response = await listAll(directoryRef);

      const filePromises = await Promise.all(
        response.items.map(async (item) => ({
          name: item.name.replace(/\.[^/.]+$/, ""), // Remove extensão do arquivo
          url: await getDownloadURL(item),
          fullName: item.name,
        }))
      );

      const sortedItems = filePromises.sort((a, b) => a.name.localeCompare(b.name));
      setItemsList(sortedItems);

      // Categorização
      const newCategories = JSON.parse(JSON.stringify(categories));

      sortedItems.forEach((item) => {
        const lowerName = item.fullName.toLowerCase();
        let categorized = false;

        // Verifica cada categoria
        Object.keys(newCategories).forEach(cat => {
          if (cat !== "Outros" && lowerName.includes(cat.toLowerCase())) {
            newCategories[cat].push(item);
            categorized = true;
          }
        });

        if (!categorized) {
          newCategories.Outros.push(item);
        }
      });

      setCategorizedItems(newCategories);
    } catch (err) {
      console.error("Error fetching items:", err);
      setError("Não foi possível carregar os arquivos. Por favor, tente novamente mais tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStorageItems(currentPath);
  }, [currentPath]);

  // Filtro de busca memoizado
  const filteredCategories = useMemo(() => {
    return Object.fromEntries(
      Object.entries(categorizedItems)
        .filter(([_, items]) => items.length > 0)
        .map(([category, items]) => [
          category,
          items.filter((item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
          ),
        ])
    );
  }, [categorizedItems, searchTerm]);

  // Alternar tema
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <>
      <Head>
        <title>Mundo da Programação - Biblioteca Online de Livros de Programação</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Explore um vasto acervo de livros sobre programação." />
      </Head>

      <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        {/* Barra de navegação */}
        <nav className="fixed top-0 left-0 w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-md z-50">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors flex items-center gap-2">
              <span className="text-3xl">📚</span>
              Biblioteca Online
            </Link>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
                aria-label={darkMode ? "Modo claro" : "Modo escuro"}
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
            </div>
          </div>
        </nav>

        <div className="container mx-auto px-4 max-w-7xl pt-20 pb-10">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 dark:text-white">
              Bem-vindo à Biblioteca Online!
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Explore nossa coleção de livros sobre programação. Recursos para todos os níveis, desde iniciantes até desenvolvedores avançados.
            </p>
          </div>

          {/* Pop-up de boas-vindas */}
          {showPopup && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-100 animate-fade-in">
                <div className="text-center mb-6">
                  <span className="text-4xl mb-4 block">📚</span>
                  <h2 className="text-2xl font-bold mb-3 dark:text-white">
                    Bem-vindo à Biblioteca Online!
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Explore um vasto acervo de livros sobre programação.
                    Aqui você encontrará recursos para todos os níveis de
                    conhecimento, desde iniciantes até desenvolvedores avançados.
                  </p>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowPopup(false)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-all duration-200 flex items-center gap-2 group"
                  >
                    <span>Vamos começar!</span>
                    <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Mensagens de estado */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="relative">
                <div className="w-12 h-12 rounded-full absolute border-4 border-solid border-gray-200 dark:border-gray-700"></div>
                <div className="w-12 h-12 rounded-full animate-spin absolute border-4 border-solid border-blue-500 border-t-transparent"></div>
              </div>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Carregando biblioteca...</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Isso pode levar alguns segundos</p>
            </div>
          )}

          {error && (
            <div className="max-w-2xl mx-auto bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 shadow-sm">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                    Erro ao carregar a biblioteca
                  </h3>
                  <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                    <p>{error}</p>
                  </div>
                  <div className="mt-4">
                    <button 
                      onClick={() => fetchStorageItems(currentPath)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                    >
                      <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                      </svg>
                      Tentar novamente
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Campo de pesquisa */}
          <div className="mb-8 sticky top-20 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm py-4 z-10 border-b border-gray-200 dark:border-gray-700">
            <div className="relative max-w-2xl mx-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Pesquise por nome do livro..."
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-300 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white transition-all duration-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Campo de pesquisa de livros"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-all duration-200"
                  aria-label="Limpar pesquisa"
                >
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Categorias */}
          {!isLoading && !error && (
            <div className="space-y-10">
              {Object.keys(filteredCategories).length === 0 ? (
                <p className="text-center py-10 dark:text-gray-300">
                  Nenhum resultado encontrado para "{searchTerm}"
                </p>
              ) : (
                Object.entries(filteredCategories).map(([category, items]) => (
                  <div key={category} className="mb-8">
                    <h2 className="text-xl font-semibold mb-4 dark:text-white">
                      {category} <span className="text-sm text-gray-500 dark:text-gray-400">({items.length})</span>
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {items.map((item, index) => (
                        <div
                          key={index}
                          className="group p-6 border border-gray-200 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 dark:border-gray-700 dark:hover:shadow-gray-700/50 bg-white dark:bg-gray-800"
                        >
                          <h3 className="text-lg font-medium mb-3 dark:text-white">
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors flex items-center group-hover:translate-x-1 duration-200"
                            >
                              <span className="mr-3 text-2xl">📄</span>
                              <span className="truncate">{item.name}</span>
                            </a>
                          </h3>
                          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                            <span className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                              </svg>
                              PDF
                            </span>
                            <span className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                              Download
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Rodapé */}
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-6 mt-10">
          <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-300">
            <p>© {new Date().getFullYear()} Biblioteca Online. Todos os direitos reservados.</p>
          </div>
        </footer>
      </div>
    </>
  );
}

export default Page;