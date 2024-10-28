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

            const folderPromises = response.prefixes.map((folderRef) => ({
                name: folderRef.name,
                fullPath: folderRef.fullPath,
                isFolder: true,
            }));

            const filePromises = await Promise.all(
                response.items.map(async (item) => ({
                    name: item.name,
                    url: await getDownloadURL(item),
                    isFolder: false,
                }))
            );

            setItemsList([...folderPromises, ...filePromises]);
        } catch (error) {
            console.error("Error fetching items:", error);
        }
    };

    const handleFolderClick = (folderPath) => {
        setCurrentPath(folderPath);
    };

    const handleBackClick = () => {
        const parentPath = currentPath.split("/").slice(0, -1).join("/");
        setCurrentPath(parentPath);
    };

    useEffect(() => {
        fetchStorageItems(currentPath);
    }, [currentPath]);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl  text-center mb-4">Welcome to my website</h1>

            {currentPath && (
                <button 
                    onClick={handleBackClick}
                    className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                    Back
                </button>
            )}

            <h2 className="text-xl">{currentPath || "Root"}</h2>
            
            <ul className="list-none mt-4 space-y-2">
                {itemsList.map((item, index) => (
                    <li key={index} className="p-2 bg-gray-100 rounded hover:bg-gray-200 transition">
                        {item.isFolder ? (
                            <span 
                                onClick={() => handleFolderClick(item.fullPath)} 
                                className="cursor-pointer text-blue-600 hover:underline"
                            >
                                📁 {item.name}
                            </span>
                        ) : (
                            <a 
                                href={item.url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-blue-600 hover:underline"
                            >
                                📄 {item.name}
                            </a>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
