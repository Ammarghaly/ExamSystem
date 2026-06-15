import SignUpForm from "../components/auth/SignUpForm";
import imgUrl from "../assets/illustration.png";
import logoIcon from "../assets/icon-logo.png";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row bg-[#fcf8ff] dark:bg-[#101214] font-sans">
      {/* Left Side */}
      <section className="hidden lg:flex w-1/2 flex-col justify-start p-8 xl:p-12 relative overflow-hidden bg-[#4f46e5] gap-12 xl:gap-16">
        {/* Background Gradients */}
       <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#818cf8] to-[#4f46e5] opacity-90"></div>
        <div className="absolute -top-[10%] -right-[10%] w-64 h-64 bg-white/10 rounded-full blur-3xl z-0"></div>
        <div className="absolute -bottom-[10%] -left-[10%] w-96 h-96 bg-black/10 rounded-full blur-3xl z-0"></div>

        {/* Top Branding */}
        <div className="relative z-10 flex items-center gap-3 text-white">
          <img
            src={logoIcon}
            alt="Academix"
            className="w-12 h-12 object-contain"
          />
          <span className="text-2xl font-bold tracking-tight">Academix</span>
        </div>

        {/* Main Content */}
        <div className="relative z-10 w-full mx-auto flex flex-col justify-center py-2">
          <h1 className="text-4xl xl:text-5xl font-extrabold text-[#dad7ff] mb-4 lg:mb-6 leading-tight">
            The Future of Education
          </h1>
          <p className="text-lg xl:text-xl font-medium text-[#dad7ff]/90 mb-8 lg:mb-12 leading-relaxed">
            Empowering the next generation of academic excellence through intelligent mentorship and automated exam generation.
          </p>

          <div className="w-full max-w-[400px] aspect-square mx-auto rounded-3xl overflow-hidden shadow-2xl bg-[#e4e1ee]/10 backdrop-blur-sm border border-[#dad7ff]/20">
            <img
              alt="Educational AI Concept"
              className="w-full h-full object-cover mix-blend-luminosity opacity-90 hover:opacity-100 transition-opacity duration-500"
              src={imgUrl}
            />
          </div>
        </div>

        {/* Footer Text */}
        <div className="relative mt-auto z-10 text-[#dad7ff]/50 text-xs xl:text-sm uppercase tracking-widest font-semibold">
          The Intelligent Mentor System © 2026
        </div>
      </section>

      {/* Right Side */}
      <section className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 md:p-12 bg-[#fcf8ff] dark:bg-[#101214] overflow-y-auto">
        <div className="w-full max-w-[500px] my-auto">
          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-10 flex flex-col items-center justify-center gap-3 animate-in fade-in duration-300">
            <img
              src={logoIcon}
              alt="Academix"
              className="w-14 h-14 object-contain mx-auto"
            />
            <span className="text-3xl font-extrabold text-[#3525cd] dark:text-indigo-400 tracking-tight">Academix</span>
          </div>

          <div className="bg-white dark:bg-[#1f2226] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-[#e4e1ee] dark:border-white/5 p-6 md:p-8 transition-all duration-300">
            <SignUpForm />
          </div>
        </div>
      </section>
    </div>
  );
}
