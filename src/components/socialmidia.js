import { FaFacebook, FaInstagram, FaGithub, FaWhatsapp } from 'react-icons/fa';
import { MdOutlinePhoneAndroid } from 'react-icons/md';

export default function SocialMidia() {
    return (
        <section className="p-4">
            <ul className="space-y-4">
                <h3 className="text-xl font-bold mb-4">Social Media</h3>
                <li className="flex items-center">
                    <a 
                        href="https://www.facebook.com/gervasio.bernardo.50/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        aria-label="Facebook"
                        className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                    >
                        <FaFacebook className="mr-2" /> Facebook
                    </a>
                </li>
                <li className="flex items-center">
                    <a 
                        href="https://www.instagram.com/chavane_798/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        aria-label="Instagram"
                        className="flex items-center text-pink-500 hover:text-pink-700 transition-colors"
                    >
                        <FaInstagram className="mr-2" /> Instagram
                    </a>
                </li>
                <li className="flex items-center">
                    <a 
                        href="https://github.com/Chavane798" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        aria-label="Github"
                        className="flex items-center text-gray-700 hover:text-black transition-colors"
                    >
                        <FaGithub className="mr-2" /> Github
                    </a>
                </li>
                <li className="flex items-center">
                    <a 
                        href="tel:+258848191186"
                        aria-label="Telefone"
                        className="flex items-center text-green-600 hover:text-green-800 transition-colors"
                    >
                        <MdOutlinePhoneAndroid className="mr-2" /> Ligue para: 848191186
                    </a>
                </li>
                <li className="flex items-center">
                    <a 
                        href="https://wa.me/258848191186"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="WhatsApp"
                        className="flex items-center text-green-500 hover:text-green-700 transition-colors"
                    >
                        <FaWhatsapp className="mr-2" /> WhatsApp
                    </a>
                </li>
            </ul>
        </section>
    );
}
