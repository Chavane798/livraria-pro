"use client";
import { useState, useEffect } from "react";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { storage } from '../components/Data_Base_API';

function App() {
    const [currentPath, setCurrentPath] = useState(""); 
    const [itemsList, setItemsList] = useState([]);

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

            setItemsList([...filePromises]);
        } catch (error) {
            console.error("Error fetching items:", error);
        }
    };

    useEffect(() => {
        fetchStorageItems(currentPath);
    }, [currentPath]);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl text-center m-4 gap-4 ">Bem-vindo à minha biblioteca!</h1>
            <div className="justify-center m-6 bg-slate-100 p-8 raunded">
                <p>Explore um vasto acervo de livros sobre programação, onde você encontrará 
                recursos para todos os níveis de conhecimento, desde iniciantes até desenvolvedores avançados.</p> 
                <p>Nossa biblioteca 
                oferece acesso gratuito a conteúdos de qualidade, cobrindo diversas linguagens e frameworks, como JavaScript, 
                Python, React, Next.js e muito mais.</p>
                <p>Descubra novos conceitos, aprofunde-se em tecnologias inovadoras e aprimore suas habilidades. 
                Estamos aqui para ajudar você a crescer e se destacar no mundo da programação!</p>
            </div>
            
            <ul className="grid grid-cols-3 gap-4 place-content-center">
                {itemsList.map((item, index) => (
                    <li key={index} className="p-8 border-2 rounded gap-2">
                        <>
                            <a 
                                href={item.url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="block text-justify text-wrap mb-2"
                            >
                                📄 {item.name}
                            </a>
                            <a 
                                href={item.url} 
                                download 
                                className="p-1 ring-offset-2 ring-4 rounded block text-center"
                            >
                                Download
                            </a>
                        </>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
