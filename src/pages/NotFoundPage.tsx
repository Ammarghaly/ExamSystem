import { Link } from "react-router-dom";
import { BookOpen, Sparkles, LayoutGrid } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-background">
      <style>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.96) translateY(12px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        @keyframes floatEffect {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        .animate-fade-in-scale {
          animation: fadeInScale 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-float {
          animation: floatEffect 5s ease-in-out infinite;
        }
      `}</style>

      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-primary/5 blur-[80px]"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[300px] h-[300px] rounded-full bg-secondary-container/10 blur-[60px]"></div>
      </div>

      {/* Main Content Area */}
      <main className="relative z-10 flex flex-col items-center max-w-2xl w-full text-center animate-fade-in-scale">
        {/* Illustration / Icon */}
        <div className="relative animate-float">
          <div className="w-32 h-32 rounded-xl bg-surface/80 backdrop-blur-md flex items-center justify-center shadow-sm border border-outline-variant/30">
            <div className="relative">
              <BookOpen className="w-16 h-16 text-primary" />
              <div className="absolute -top-2 -right-2 bg-secondary-container text-on-secondary-container p-1.5 rounded-lg shadow-sm">
                <Sparkles className="w-5 h-5 fill-current" />
              </div>
            </div>
          </div>
          {/* Subtle decorative background rings */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-primary/10 rounded-full -z-10"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-primary/5 rounded-full -z-10"></div>
        </div>

        {/* Error Identity */}
        <h1 className="font-sans text-[36px] md:text-[40px] font-extrabold text-primary mt-12 mb-4 tracking-tight leading-tight">
          404 - Page Not Found
        </h1>
        <p className="font-sans text-xl font-semibold text-muted-foreground max-w-[480px] w-full mx-auto leading-relaxed mb-8">
          It seems the page you are looking for hasn't been added to the curriculum yet.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Link
            className="inline-flex items-center justify-center px-8 h-12 bg-primary text-primary-foreground font-sans font-semibold rounded-lg shadow-sm hover:opacity-90 active:scale-95 transition-all duration-200"
            to="/teacher/dashboard"
          >
            <LayoutGrid className="mr-2 w-5 h-5" />
            Back to Dashboard
          </Link>
        </div>
      </main>

      {/* Brand Identifier (Bottom) */}
      <footer className="absolute bottom-6 w-full text-center z-10">
        <div className="flex items-center justify-center gap-2">
          <span className="font-sans text-base font-bold text-primary opacity-50">
            Academix
          </span>
          <span className="text-outline text-xs">•</span>
          <span className="text-muted-foreground text-xs opacity-50">
            Intelligent Mentor
          </span>
        </div>
      </footer>

      {/* Background Grid Texture */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03] z-0"
        style={{
          backgroundImage: "radial-gradient(var(--color-primary) 0.5px, transparent 0.5px)",
          backgroundSize: "24px 24px",
        }}
      ></div>
    </div>
  );
}
