import { AlertTriangle, Sparkles, X } from "lucide-react";

interface InsufficientCreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
  requiredCredits: number;
  availableCredits: number;
  onGoToPricing: () => void;
}

export default function InsufficientCreditsModal({
  isOpen,
  onClose,
  requiredCredits,
  availableCredits,
  onGoToPricing,
}: InsufficientCreditsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 border border-border rounded-2xl w-full max-w-md shadow-2xl relative p-6 flex flex-col items-center text-center space-y-4">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Warning Icon */}
        <div className="w-14 h-14 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
          <AlertTriangle className="w-7 h-7" />
        </div>

        {/* Text Details */}
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-foreground font-sans">
            Insufficient Credits!
          </h3>
          <p className="text-sm text-muted-foreground font-sans leading-relaxed">
            Generating this exam requires <span className="font-bold text-foreground">{requiredCredits}</span> credits, but you only have <span className="font-bold text-foreground">{availableCredits}</span> available in your account.
          </p>
        </div>

        {/* Info Box */}
        <div className="w-full bg-slate-50 dark:bg-zinc-800/40 p-4 rounded-xl border border-border text-xs text-muted-foreground flex items-start gap-2.5 text-left leading-relaxed">
          <Sparkles className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
          <span>
            Upgrade your plan or purchase one-time credit add-ons to continue generating high-quality exams dynamically.
          </span>
        </div>

        {/* Buttons */}
        <div className="w-full pt-2 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 border border-border rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onGoToPricing}
            className="w-full py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:opacity-90 shadow-md shadow-primary/10 transition-opacity cursor-pointer"
          >
            Go to Plans & Shippers
          </button>
        </div>
      </div>
    </div>
  );
}
