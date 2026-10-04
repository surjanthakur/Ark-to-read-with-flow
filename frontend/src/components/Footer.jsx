export default function Footer() {
  return (
    <>
      <footer
        className="relative w-full bg-[#f4f4f0] border-t-4 border-black pt-12 pb-6 px-6 md:px-12 font-sans overflow-hidden"
        style={{
          // Adds the subtle grid background matching the reference image
          backgroundImage: `linear-gradient(#e5e5e5 1px, transparent 1px), linear-gradient(90deg, #e5e5e5 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
          {/* Left Side: Button, Socials, and Quote */}
          <div className="flex flex-col gap-6 w-full md:w-1/2">
            {/* Top: Donate Button */}
            <div>
              <a href="https://www.buymeacoffee.com/tsurjan506a">
                <img src="https://img.buymeacoffee.com/button-api/?text=buy me a Diet Coke&emoji=&slug=tsurjan506a&button_colour=FFDD00&font_colour=000000&font_family=Arial&outline_colour=000000&coffee_colour=ffffff" />
              </a>
            </div>

            {/* Bottom of Button: Social Links (Names only) */}
            <div className="flex gap-6 text-lg font-bold">
              <a
                href="#"
                className="text-black hover:text-[#ff8ae2] hover:underline decoration-2 underline-offset-4 transition-all"
              >
                X
              </a>
              <a
                href="#"
                className="text-black hover:text-[#ff8ae2] hover:underline decoration-2 underline-offset-4 transition-all"
              >
                GitHub
              </a>
            </div>

            {/* Bottom: Motivational Quote Card */}
            <div className="mt-4 max-w-md bg-[#fcf6c5] border-2 border-black p-5 rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] -rotate-1 relative">
              <p className="font-bold text-black text-md leading-relaxed">
                "Don't dig through the internet — let Lily find the best resources for you. Keep
                learning, keep building."
              </p>
            </div>
          </div>

          {/* Right Side: Large Square QR Code Div */}
          <div className="w-full md:w-auto flex justify-center md:justify-end">
            <div className="w-full max-w-70 aspect-square bg-white border-4 border-black p-4 rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rotate-2 flex flex-col items-center justify-center relative">
              {/* Placeholder for QR Code Image */}
              <div className="w-full h-full bg-gray-100 border-2 border-dashed border-gray-400 rounded-xl flex items-center justify-center overflow-hidden relative">
                <span className="text-gray-500 font-bold text-sm text-center px-4">
                  [Insert your QR Code Image Here]
                </span>
                {/* Example: <img src="/your-qr-code.png" alt="QR Code" className="w-full h-full object-cover" /> */}
              </div>

              {/* Playful badge overlay matching the theme */}
              <div className="absolute -top-4 -right-4 bg-[#c4f75d] border-2 border-black rounded-full w-16 h-16 flex items-center justify-center font-black text-[10px] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rotate-12">
                SCAN ME
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Name */}
        <div className="max-w-6xl mx-auto mt-16 pt-6 border-t-2 border-black/10 flex justify-end">
          <p className="font-black text-xl text-black uppercase tracking-tight bg-[#ff8ae2] px-4 py-1 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] -rotate-1">
            Surjan Thakur
          </p>
        </div>
      </footer>
    </>
  );
}
