import { cn } from "../../lib/utils";
import { useFormContext } from "react-hook-form";

interface Props {
  index: number;
  idealAnswer: string;
}

export function TrueFalseArea({ index, idealAnswer }: Props) {
  const { register } = useFormContext();

  return (
    <div className="space-y-3 pt-2 bg-slate-50/50 dark:bg-zinc-900/30 p-4 rounded-xl border border-gray-100 dark:border-white/5">
      <label className="font-bold text-[11px] text-gray-500 dark:text-zinc-400 uppercase tracking-widest block">
        Correct Answer
      </label>
      <div className="flex items-center gap-4">
        {/* True Option */}
        <label
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl border cursor-pointer transition-all",
            idealAnswer === "True"
              ? "bg-emerald-50/60 border-emerald-200 text-emerald-800 dark:bg-emerald-950/20 dark:border-emerald-900/40 dark:text-emerald-300 font-bold shadow-sm"
              : "bg-white dark:bg-[#1f2226] border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-zinc-800/40 text-gray-700 dark:text-zinc-300",
          )}
        >
          <input
            type="radio"
            value="True"
            {...register(`questions.${index}.idealAnswer`)}
            className="hidden"
          />
          <div
            className={cn(
              "w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all",
              idealAnswer === "True"
                ? "border-emerald-500 dark:border-emerald-400"
                : "border-gray-300 dark:border-zinc-650"
            )}
          >
            {idealAnswer === "True" && (
              <div className="w-1.5 h-1.5 bg-emerald-500 dark:bg-emerald-400 rounded-full" />
            )}
          </div>
          True
        </label>

        {/* False Option */}
        <label
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl border cursor-pointer transition-all",
            idealAnswer === "False"
              ? "bg-rose-50/60 border-rose-200 text-rose-800 dark:bg-rose-950/20 dark:border-rose-900/40 dark:text-rose-300 font-bold shadow-sm"
              : "bg-white dark:bg-[#1f2226] border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-zinc-800/40 text-gray-700 dark:text-zinc-300",
          )}
        >
          <input
            type="radio"
            value="False"
            {...register(`questions.${index}.idealAnswer`)}
            className="hidden"
          />
          <div
            className={cn(
              "w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all",
              idealAnswer === "False"
                ? "border-rose-500 dark:border-rose-400"
                : "border-gray-300 dark:border-zinc-650"
            )}
          >
            {idealAnswer === "False" && (
              <div className="w-1.5 h-1.5 bg-rose-500 dark:bg-rose-400 rounded-full" />
            )}
          </div>
          False
        </label>
      </div>
    </div>
  );
}
