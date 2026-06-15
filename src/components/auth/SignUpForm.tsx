import { FormProvider } from "react-hook-form";
import StudentSignUpForm from "./StudentSignUpForm";
import TeacherSignUpForm from "./TeacherSignUpForm";
import { Link } from "react-router-dom";
import OtpVerificationForm from "./OtpVerificationForm";
import { useSignUp } from "../../hooks/useSignUp";

export default function SignUpForm() {
  const {
    methods,
    currentRole,
    isOtpStep,
    emailForOtp,
    loading,
    otpError,
    cooldown,
    onSubmit,
    handleOtpVerifySubmit,
    handleResendOtp,
    handleChangeEmail,
    handleRoleChange,
    handleSubmit
  } = useSignUp();

  if (isOtpStep) {
    return (
      <OtpVerificationForm
        email={emailForOtp}
        onSubmit={handleOtpVerifySubmit}
        loading={loading}
        error={otpError}
        cooldown={cooldown}
        onResend={handleResendOtp}
        onChangeEmail={handleChangeEmail}
      />
    );
  }

  return (
    <div className="flex flex-col w-full">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-[#1b1b24] dark:text-white mb-1">
          {currentRole === "Student" ? "Join as a Student" : "Join as a Teacher"}
        </h1>
        <p className="text-sm text-[#464555] dark:text-zinc-400">
          {currentRole === "Student"
            ? "Start your journey towards academic excellence today."
            : "Empower your classroom with AI-driven academic excellence."}
        </p>
      </header>

      <div className="flex p-1 bg-[#f0ecf9] dark:bg-zinc-800 rounded-lg mb-6">
        <button
          onClick={() => handleRoleChange("Student")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-all duration-200 cursor-pointer ${currentRole === "Student"
            ? "bg-white dark:bg-zinc-700 text-[#3525cd] dark:text-white shadow-sm ring-1 ring-black/5"
            : "text-[#464555] dark:text-zinc-400 hover:bg-[#eae6f4] dark:hover:bg-zinc-750"
            }`}
        >
          Student
        </button>
        <button
          onClick={() => handleRoleChange("Teacher")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-all duration-200 cursor-pointer ${currentRole === "Teacher"
            ? "bg-white dark:bg-zinc-700 text-[#3525cd] dark:text-white shadow-sm ring-1 ring-black/5"
            : "text-[#464555] dark:text-zinc-400 hover:bg-[#eae6f4] dark:hover:bg-zinc-750"
            }`}
        >
          Teacher
        </button>
      </div>

      <div className="min-h-[360px]">
        <FormProvider {...methods}>
          <form onSubmit={(e) => { void handleSubmit(onSubmit)(e); }} className="flex flex-col gap-6 w-full animate-in fade-in duration-300">
            {methods.formState.errors.root && (
              <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-lg">
                {methods.formState.errors.root.message}
              </div>
            )}
            {currentRole === "Student" ? <StudentSignUpForm /> : <TeacherSignUpForm />}
          </form>
        </FormProvider>
      </div>

      {/* Footer Links */}
      <footer className="mt-8 pt-6 border-t border-[#c7c4d8] dark:border-white/5 flex flex-col items-center gap-4">
        <p className="text-sm text-[#464555] dark:text-zinc-400 text-center">
          Already have an account?{" "}
          <Link className="text-[#3525cd] dark:text-indigo-400 font-semibold hover:underline" to="/login">Back to Login</Link>
        </p>
        <div className="flex items-center gap-4">
          <span className="h-[1px] w-12 bg-[#c7c4d8] dark:bg-zinc-800"></span>
          <span className="text-xs text-[#464555] dark:text-zinc-500 uppercase tracking-wider">Secure Access</span>
          <span className="h-[1px] w-12 bg-[#c7c4d8] dark:bg-zinc-800"></span>
        </div>
      </footer>

    </div>
  );
}
