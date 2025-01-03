import SocialMidia from './socialmidia';

export default function Footer() {
  return (
    <footer className="bg-black text-white p-5 flex flex-col md:flex-row gap-5 justify-between items-start rounded-lg relative">
      {/* Social Media Section */}
      <div className="flex-1 min-w-full md:min-w-[250px] m-2">
        <SocialMidia />
      </div>

      {/* Contact Section */}
      <div className="flex-1 min-w-full md:min-w-[250px] m-2">
        <h3 className="mb-4 text-lg font-semibold">Contacto</h3>
        <p className="mb-2">
          Email: 
          <a 
            href="mailto:gervasiochavane798@gmail.com" 
            className="hover:text-blue-500 transition-colors"
          >
             gervasiochavane798@gmail.com
          </a>
        </p>
        <p>
          Telefone: 
          <a 
            href="tel:+258848191186" 
            className="hover:text-blue-500 transition-colors"
            aria-label="Telefone: +258 848 191 186"
          >
             +258 848 191 186
          </a>
        </p>
      </div>

      {/* Footer Bottom Section */}
      <div className="absolute bottom-2 text-center w-full text-sm">
        <p>&copy; 2024 Gervásio Bernardo Chavane. Todos os direitos reservados enjoy.</p>
      </div>
    </footer>
  );
}
