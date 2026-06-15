import icone from '../../assets/icon-logo.png'

export default function PricingAIPanel() {
  return (
    <div className="relative h-64 w-full overflow-hidden rounded-2xl bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-500/10 flex items-center justify-center p-6 text-center">
      {/* Decorative blurred backdrops */}
      <div className="absolute w-48 h-48 rounded-full bg-indigo-500/10 blur-3xl -top-10 -left-10 pointer-events-none" />
      <div className="absolute w-48 h-48 rounded-full bg-sky-500/10 blur-3xl -bottom-10 -right-10 pointer-events-none" />
      
      <div className="relative z-10 space-y-4 max-w-full mx-auto flex flex-col items-center">
        <div className="w-13 h-13 rounded-full bg-primary/10 flex items-center justify-center text-primary animate-pulse">
          <img src={icone} className="w-10 h-10"/>
        </div>
        <h3 className="text-xl font-bold text-primary font-sans">
          AI Excellence for Every Institution
        </h3>
        <p className="text-sm md:text-base text-muted-foreground leading-relaxed font-sans">
          Over 50,000 educators trust Academaix to automate the rigor of academic assessment.
        </p>
      </div>
    </div>
  );
}
