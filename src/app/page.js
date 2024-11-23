"use client";
import { useState, useEffect, useCallback } from "react";
import { analytics } from "../components/Data_Base_API";
import { logEvent } from "firebase/analytics";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { storage } from "../components/Data_Base_API";
import Head from "next/head";

function Page() {
    // Estados
    const [currentPath, setCurrentPath] = useState("");
    const [itemsList, setItemsList] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showPopup, setShowPopup] = useState(true);
    const [loading, setLoading] = useState(false);

    // Log de evento de acesso à página
    useEffect(() => {
        logEvent(analytics, "page_view", {
            page_title: "Página Inicial",
            page_location: window.location.href,
        });
    }, []);

    // Função para buscar itens do Firebase Storage
    const fetchStorageItems = useCallback(async (path) => {
        setLoading(true);
        try {
            const directoryRef = ref(storage, path);
            const response = await listAll(directoryRef);

            const filePromises = await Promise.all(
                response.items.map(async (item) => ({
                    name: item.name,
                    url: await getDownloadURL(item),
                }))
            );

            const sortedItems = filePromises.sort((a, b) => a.name.localeCompare(b.name));
            setItemsList(sortedItems);
        } catch (error) {
            console.error("Erro ao buscar itens:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Atualiza os itens ao mudar o caminho atual
    useEffect(() => {
        fetchStorageItems(currentPath);
    }, [currentPath, fetchStorageItems]);

    // Filtra os itens com base no termo de pesquisa
    const filteredItems = itemsList.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <Head>
                <title>Mundo da Programação - Biblioteca Online de Livros de Programação</title>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta name="description" content="Explore um vasto acervo de livros sobre programação." />
            </Head>

            <div className="container mx-auto p-4 max-w-7xl">
                <h1 className="text-3xl text-center m-4">Bem-vindo à minha biblioteca!</h1>

                {/* Pop-up de boas-vindas */}
                {showPopup && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-8 rounded shadow-lg max-w-md w-full text-justify">
                            <h2 className="text-2xl font-bold mb-4">Bem-vindo à Biblioteca Online!</h2>
                            <p className="mb-4">
                                Explore um vasto acervo de livros sobre programação. 
                                Aqui você encontrará recursos para todos os níveis de conhecimento, 
                                desde iniciantes até desenvolvedores avançados.
                            </p>
                            <p className="mb-4">
                                Descubra novas tecnologias, aprofunde suas habilidades e alcance 
                                o próximo nível na sua jornada como programador!
                            </p>
                            <button
                                onClick={() => setShowPopup(false)}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                Vamos começar!
                            </button>
                        </div>
                    </div>
                )}

                {/* Campo de pesquisa */}
                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Pesquise por nome..."
                        className="w-full p-2 border rounded"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Mensagem de carregamento */}
                {loading && <p className="text-center text-gray-500">Carregando itens...</p>}

                {/* Lista de itens filtrados */}
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 place-content-center">
                    {filteredItems.map((item, index) => (
                        <li key={index} className="p-4 border-2 rounded gap-2">
                            <>
                                <a
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block text-justify text-wrap mb-2 text-base sm:text-lg"
                                    aria-label={`Visualizar o arquivo ${item.name}`}
                                >
                                    📄 {item.name}
                                </a>
                                <a
                                    href={item.url}
                                    download
                                    className="p-1 ring-offset-2 ring-4 rounded block text-center"
                                    aria-label={`Baixar o arquivo ${item.name}`}
                                >
                                    Baixar
                                </a>
                            </>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}

export default Page;
