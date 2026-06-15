import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Lock, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";

const passwordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type PasswordFormValues = z.infer<typeof passwordSchema>;

interface ResetPasswordFormProps {
  onSubmit: (password: string) => void;
  loading: boolean;
}

export default function ResetPasswordForm({ onSubmit, loading }: ResetPasswordFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
  });

  const handleFormSubmit = (data: PasswordFormValues) => {
    onSubmit(data.password);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
      <div className="text-center space-y-2">
        <div className="mx-auto flex items-center justify-center size-12 rounded-full bg-[#f1e8ff] dark:bg-indigo-950/40 text-[#6b38d4] dark:text-indigo-400">
          <Lock className="size-6" />
        </div>
        <h2 className="text-[28px] font-bold text-[#191c1e] dark:text-white tracking-tight">
          Create New Password
        </h2>
        <p className="text-sm text-[#5f6470] dark:text-zinc-400 max-w-[340px] mx-auto leading-relaxed">
          Your new password must be different from previous passwords.
        </p>
      </div>

      {/* New Password */}
      <div className="space-y-1.5">
        <label htmlFor="password" className="block text-xs font-semibold text-[#191c1e] dark:text-white">
          New Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your new password"
            className={`w-full px-4 py-2.5 bg-[#f1e8ff]/20 dark:bg-zinc-900/40 border ${
              errors.password ? "border-red-500 ring-1 ring-red-500" : "border-[#c7ccd4] dark:border-white/10"
            } rounded-lg text-sm text-[#191c1e] dark:text-white placeholder-[#5f6470]/70 dark:placeholder-zinc-500 focus:outline-none focus:border-[#6b38d4] dark:focus:border-[#6b38d4] focus:ring-2 focus:ring-[#6b38d4]/20 transition-all`}
            disabled={loading}
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#5f6470] dark:text-zinc-400 hover:text-[#6b38d4] dark:hover:text-indigo-400 cursor-pointer"
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
        {errors.password ? (
          <p className="text-xs text-red-500 font-medium">{errors.password.message}</p>
        ) : (
          <p className="text-[11px] text-[#5f6470]/80 dark:text-zinc-500">Enter at least 6 characters</p>
        )}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="confirmPassword" className="block text-xs font-semibold text-[#191c1e] dark:text-white">
          Confirm Password
        </label>
        <div className="relative">
          <input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your new password"
            className={`w-full px-4 py-2.5 bg-[#f1e8ff]/20 dark:bg-zinc-900/40 border ${
              errors.confirmPassword ? "border-red-500 ring-1 ring-red-500" : "border-[#c7ccd4] dark:border-white/10"
            } rounded-lg text-sm text-[#191c1e] dark:text-white placeholder-[#5f6470]/70 dark:placeholder-zinc-500 focus:outline-none focus:border-[#6b38d4] dark:focus:border-[#6b38d4] focus:ring-2 focus:ring-[#6b38d4]/20 transition-all`}
            disabled={loading}
            {...register("confirmPassword")}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#5f6470] dark:text-zinc-400 hover:text-[#6b38d4] dark:hover:text-indigo-400 cursor-pointer"
          >
            {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-xs text-red-500 font-medium">{errors.confirmPassword.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#6b38d4] hover:bg-[#5225af] active:bg-[#441a98] text-white font-semibold text-sm rounded-lg shadow-sm hover:shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
      >
        {loading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <>
            Reset Password
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </>
        )}
      </button>
    </form>
  );
}
