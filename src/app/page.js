"use client";
import { useState, useEffect } from "react";
import { analytics } from "../components/Data_Base_API";
import { logEvent } from "firebase/analytics";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { storage } from "../components/Data_Base_API";
import Head from "next/head";

function Page() {
    const [currentPath, setCurrentPath] = useState("");
    const [itemsList, setItemsList] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showPopup, setShowPopup] = useState(true);
    const [categorizedItems, setCategorizedItems] = useState({});

    // Log de evento de acesso à página (somente no cliente e se Analytics estiver disponível)
    useEffect(() => {
        if (analytics) {
            logEvent(analytics, "page_view", {
                page_title: "Página Inicial",
                page_location: window.location.href,
            });
        }
    }, []);

    const fetchStorageItems = async (path) => {
        try {
            const directoryRef = ref(storage, path);
            const response = await listAll(directoryRef);

            const filePromises = await Promise.all(
                response.items.map(async (item) => ({
                    name: item.name,
                    url: await getDownloadURL(item),
                }))
            );

            // Ordenar os itens por nome
            const sortedItems = filePromises.sort((a, b) => a.name.localeCompare(b.name));

            // Categorizar os itens por linguagem de programação
            const categories = {
                CSS: [],
                HTML: [],
                Java: [],
                PHP: [],
                C: [],
                Outros: [],
            };

            sortedItems.forEach((item) => {
                const lowerName = item.name.toLowerCase();
                if (lowerName.includes("css")) {
                    categories.CSS.push(item);
                } else if (lowerName.includes("html")) {
                    categories.HTML.push(item);
                } else if (lowerName.includes("java")) {
                    categories.Java.push(item);
                } else if (lowerName.includes("php")) {
                    categories.PHP.push(item);
                } else if (lowerName.includes("c")) {
                    categories.C.push(item);
                } else {
                    categories.Outros.push(item);
                }
            });

            setCategorizedItems(categories);
        } catch (error) {
            console.error("Error fetching items:", error);
        }
    };

    useEffect(() => {
        fetchStorageItems(currentPath);
    }, [currentPath]);

    // Filtrar os itens com base no termo de pesquisa
    const filteredCategories = Object.fromEntries(
        Object.entries(categorizedItems).map(([category, items]) => [
            category,
            items.filter((item) =>
                item.name.toLowerCase().includes(searchTerm.toLowerCase())
            ),
        ])
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

                {/* Categorias */}
                {Object.keys(filteredCategories).map((category) => (
                    <div key={category} className="mb-8">
                        <h2 className="text-xl font-bold mb-4">{category}</h2>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 place-content-center">
                            {filteredCategories[category].map((item, index) => (
                                <li key={index} className="p-4 border-2 rounded gap-2">
                                    <a
                                        href={item.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block text-justify text-wrap mb-2 text-base sm:text-lg"
                                    >
                                        📄 {item.name}
                                    </a>
                                    <a
                                        href={item.url}
                                        download
                                        className="p-1 ring-offset-2 ring-4 rounded block text-center"
                                    >
                                        Visualizar
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </>
    );
}

export default Page;
