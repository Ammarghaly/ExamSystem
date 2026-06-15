import { cn } from "../../lib/utils";
import { useFormContext } from "react-hook-form";

interface Props {
  index: number;
  options: any[];
  handleOptionCorrectToggle: (optIndex: number) => void;
  questionErrors: any;
}

export function MultipleChoiceArea({
  index,
  options,
  handleOptionCorrectToggle,
  questionErrors,
}: Props) {
  const { register, watch } = useFormContext();

  return (
    <div className="space-y-3 pt-2 bg-slate-50/50 dark:bg-zinc-900/30 p-4 rounded-xl border border-gray-100 dark:border-white/5">
      <label className="font-bold text-[11px] text-gray-500 dark:text-zinc-400 uppercase tracking-widest block">
        Answers (Select the correct one)
      </label>
      <div className="space-y-3">
        {options.map((opt, optIndex) => {
          const isCorrect = watch(`questions.${index}.options.${optIndex}.isCorrect`);

          return (
            <div
              key={opt.id}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl border transition-all",
                isCorrect
                  ? "bg-indigo-50/60 border-indigo-200 dark:bg-indigo-950/20 dark:border-indigo-900/50 shadow-sm"
                  : "bg-white dark:bg-[#1f2226] border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 hover:bg-gray-50/50 dark:hover:bg-zinc-800/40",
              )}
            >
              <button
                type="button"
                onClick={() => handleOptionCorrectToggle(optIndex)}
                className={cn(
                  "flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full border-2 focus:outline-none transition-all cursor-pointer",
                  isCorrect
                    ? "border-indigo-600 bg-indigo-600 dark:border-indigo-500 dark:bg-indigo-500"
                    : "border-gray-300 dark:border-zinc-650 bg-transparent"
                )}
              >
                {isCorrect && (
                  <div className="w-1.5 h-1.5 bg-white dark:bg-zinc-950 rounded-full" />
                )}
              </button>
              <div className="flex-1">
                <input
                  type="text"
                  {...register(`questions.${index}.options.${optIndex}.text`)}
                  placeholder={`Option ${optIndex + 1}`}
                  className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-550 focus:outline-none"
                />
              </div>
            </div>
          );
        })}

        {questionErrors?.options && !Array.isArray(questionErrors.options) && (
          <p className="text-red-500 text-xs font-semibold">
            {(questionErrors.options as any).message}
          </p>
        )}

        {Array.isArray(questionErrors?.options) &&
          questionErrors?.options.map(
            (optError: any, i: number) =>
              optError?.text && (
                <p key={i} className="text-red-500 text-xs font-semibold">
                  Option {i + 1}: {optError.text.message}
                </p>
              ),
          )}
      </div>
    </div>
  );
}
