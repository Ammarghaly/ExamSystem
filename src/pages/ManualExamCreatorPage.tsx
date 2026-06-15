import { TeacherLayout } from "../components/Layout/TeacherLayout";
import { Pencil, Plus, Play } from "lucide-react";
import { QuestionCard } from "../components/manual-exam/QuestionCard";
import { PageHeader } from "../components/Common/PageHeader";
import { PublishSettingsArea } from "../components/Common/PublishSettingsArea";
import { FormProvider } from "react-hook-form";
import { useManualExam } from "../hooks/useManualExam";
export type { ExamFormValues, QuestionType } from "../components/manual-exam/schema";

export default function ManualExamCreatorPage() {
  const {
    step,
    setStep,
    methods,
    handleSubmit,
    onSubmit,
    onInvalid,
    errors,
    fields,
    remove,
    addQuestion,
    handleProceed,
  } = useManualExam();

  return (
    <TeacherLayout>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit, onInvalid)}
          className="flex-1 flex flex-col overflow-y-auto bg-slate-50 relative"
        >
          {step === "build" ? (
            <>
              <main className="p-8 mx-auto w-full space-y-6 pb-12 flex-1 max-w-5xl">

                {/* Header */}
                <PageHeader
                  title="Create New Assessment"
                  subtitle="Design your comprehensive exam questions manually."
                  badge={{ icon: Pencil, text: "Manual Mode" }}
                />

                {/* Exam Metadata Form */}
                <div className="mt-8">
                  <div className="space-y-1.5 w-full">
                    <label className="font-bold text-[11px] text-gray-500 uppercase tracking-widest block">
                      Exam Title
                    </label>
                    <input
                      type="text"
                      {...methods.register("examTitle")}
                      placeholder="e.g., Intro to Quantum Mechanics - Midterm"
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
                    />
                    {errors.examTitle && (
                      <p className="text-red-500 text-xs font-semibold">
                        {errors.examTitle.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Questions List */}
                <div className="space-y-6 mt-8">
                  {fields.map((field, index) => (
                    <QuestionCard
                      key={field.id}
                      index={index}
                      onDelete={() => remove(index)}
                    />
                  ))}
                </div>

                {/* Add Question Button */}
                <button
                  type="button"
                  onClick={addQuestion}
                  className="w-full py-10 mt-6 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-2xl bg-white/50 dark:bg-zinc-900/30 flex flex-col items-center justify-center hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 hover:border-indigo-300 dark:hover:border-indigo-800 transition-all group cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform mb-3">
                    <Plus className="w-6 h-6" />
                  </div>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400 text-base">
                    Add Question
                  </span>
                  <span className="text-sm font-medium text-gray-500 dark:text-zinc-400 mt-1">
                    Multiple Choice or True/False
                  </span>
                </button>
              </main>

              {/* Sticky Footer Action Bar */}
              <div className="sticky bottom-0 w-full bg-white border-t border-gray-200 p-4 px-6 md:px-10 flex flex-col sm:flex-row gap-4 justify-between items-center shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.05)] z-20">
                <div className="flex items-center gap-10">
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                      Total Questions
                    </span>
                    <span className="font-extrabold text-lg text-gray-900">
                      {fields.length} items
                    </span>
                  </div>
                </div>
                <button
                    type="button"
                    onClick={handleProceed}
                    className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 rounded-xl text-sm font-bold text-white hover:bg-indigo-700 transition-colors shadow-sm"
                  >
                    Proceed to Publish
                    <Play className="w-4 h-4 fill-white" />
                  </button>
              </div>
            </>
          ) : (
            <main className="flex-1 p-8">
              <PublishSettingsArea onBack={() => setStep("build")} />
            </main>
          )}
        </form>
      </FormProvider>
    </TeacherLayout>
  );
}
