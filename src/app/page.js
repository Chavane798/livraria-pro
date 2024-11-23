"use client";
import { useState, useEffect } from "react";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { storage } from "../components/Data_Base_API";
import Head from "next/head";
import Footer from "@/components/Footer";

function App() {
    const [currentPath, setCurrentPath] = useState("");
    const [itemsList, setItemsList] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showPopup, setShowPopup] = useState(true); 

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
            setItemsList(sortedItems);
        } catch (error) {
            console.error("Error fetching items:", error);
        }
    };

    useEffect(() => {
        fetchStorageItems(currentPath);
    }, [currentPath]);

    // Filtrar os itens com base no termo de pesquisa
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
                        <div className="bg-white p-8 rounded shadow-lg max-w-md w-full text-center">
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
                            </>
                        </li>
                    ))}
                </ul>
            </div>
            <Footer />
        </>
    );
}

export default App;

