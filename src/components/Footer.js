export default function Footer() {
    return (
        <>
            <div className="justify-center m-6 bg-slate-100 p-8 rounded text-center">
                <ul className="space-y-2">
                    <li>
                        <a 
                            href="https://github.com/Chavane798" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-blue-500 hover:underline"
                        >
                            GitHub
                        </a>
                    </li>
                    <li>
                        <a 
                            href="https://linkedin.com/in/seu-usuario" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-blue-500 hover:underline"
                        >
                            LinkedIn
                        </a>
                    </li>
                    <li>
                        <a 
                            href="https://twitter.com/seu-usuario" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-blue-500 hover:underline"
                        >
                            Twitter
                        </a>
                    </li>
                </ul>
            </div>
        </>
    );
}
