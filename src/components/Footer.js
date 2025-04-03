import SocialMidia from './socialmidia';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-100 p-8 flex flex-col gap-8 relative">
      {/* Conteúdo principal do footer */}
      <div className="flex flex-col md:flex-row gap-8 justify-between w-full">
        {/* Social Media Section */}
        <div className="flex-1 min-w-full md:min-w-[250px]">
          <h3 className="mb-4 text-lg font-semibold text-white">Redes Sociais</h3>
          <SocialMidia />
        </div>

        {/* Contact Section */}
        <div className="flex-1 min-w-full md:min-w-[250px]">
          <h3 className="mb-4 text-lg font-semibold text-white">Contacto</h3>
          <ul className="space-y-3">
            <li>
              <a 
                href="mailto:gervasiochavane798@gmail.com" 
                className="hover:text-blue-400 transition-colors flex items-center gap-2"
                aria-label="Enviar email para gervasiochavane798@gmail.com"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                gervasiochavane798@gmail.com
              </a>
            </li>
            <li>
              <a 
                href="tel:+258848191186" 
                className="hover:text-blue-400 transition-colors flex items-center gap-2"
                aria-label="Ligar para +258 848 191 186"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zm3 14a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
                +258 848 191 186
              </a>
            </li>
          </ul>
        </div>

        {/* Additional Links Section (opcional) */}
        <div className="flex-1 min-w-full md:min-w-[250px]">
          <h3 className="mb-4 text-lg font-semibold text-white">Links Úteis</h3>
          <ul className="space-y-2">
            <li><a href="/sobre" className="hover:text-blue-400 transition-colors">Sobre Mim</a></li>
            <li><a href="/portfolio" className="hover:text-blue-400 transition-colors">Portfólio</a></li>
            <li><a href="/blog" className="hover:text-blue-400 transition-colors">Blog</a></li>
            <li><a href="/privacidade" className="hover:text-blue-400 transition-colors">Política de Privacidade</a></li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom Section */}
      <div className="border-t border-gray-700 pt-6 text-center text-sm text-gray-400">
        <p>
          &copy; {currentYear} Gervásio Bernardo Chavane. Todos os direitos reservados.
          <span className="block mt-2 md:inline md:ml-4">
            Desenvolvido com ❤️ e Next.js
          </span>
        </p>
      </div>
    </footer>
  );
}