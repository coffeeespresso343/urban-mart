import { motion } from "framer-motion";
import { useState, type FormEvent } from "react";
import { useUIStore } from "../../hooks/uiStore";
import { isValidPassword } from "../../utils/validation";
import { useAuth } from "../../hooks/useAuth";
import { supabase } from "../../lib/supabase";
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  X,
} from "lucide-react";

const inputClass =
  "w-full rounded-lg border border-line-light bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-orange transition-colors";
const labelClass = "label-tag text-stone mb-1.5 block";
const errorClass = "mt-1 text-xs text-error";

const Security = () => {
  const { user } = useAuth();
  const showToast = useUIStore((s) => s.showToast);

  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>(
    {},
  );

  const openPasswordEditor = () => {
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setPasswordErrors({});
    setIsChangingPassword(true);
  };

  const cancelPasswordEdit = () => {
    setIsChangingPassword(false);
    setPasswordErrors({});
  };

  const validatePasswordForm = () => {
    const errors: Record<string, string> = {};

    if (!passwordForm.currentPassword) {
      errors.currentPassword = "Enter your current password";
    }

    if (!passwordForm.newPassword) {
      errors.newPassword = "Enter a new password";
    } else if (!isValidPassword(passwordForm.newPassword)) {
      errors.newPassword = "Must be at least 8 characters";
    }

    if (passwordForm.confirmPassword !== passwordForm.newPassword) {
      errors.confirmPassword = "Password do not match";
    }

    setPasswordErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault();

    if (!user?.email) return;
    if (!validatePasswordForm()) return;

    setIsSavingPassword(true);

    const { error: signError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: passwordForm.currentPassword,
    });

    if (signError) {
      setIsSavingPassword(false);
      setPasswordErrors({ currentPassword: "Current password is incorrect" });
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: passwordForm.newPassword,
    });

    setIsSavingPassword(false);

    if (updateError) {
      showToast(updateError.message, "error");
      return;
    }

    setIsChangingPassword(false);
    showToast("Password updated successfully", "success");
  };

  return (
    <div className="border border-line-light rounded-xl p-6">
      <div className="flex flex-col gap-2">
        <div>
          <p className="label-tag text-stone">Security</p>
          <p className="flex items-center gap-2 mt-4 text-lg font-medium">
            <KeyRound className="h-5 w-5 text-orange" strokeWidth={1.5} />
            Password
          </p>
        </div>
        <p className="text-sm mt-1 text-stone">
          Change the password used to sign in.
        </p>
      </div>

      {!isChangingPassword ? (
        <button
          onClick={openPasswordEditor}
          className="label-tag mt-6 flex items-center gap-1.5 font-semibold hover:text-orange"
        >
          Change Password
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      ) : (
        <motion.form
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.35,
            delay: 0.15,
            ease: [0.22, 1, 0.36, 1],
          }}
          onSubmit={handleChangePassword}
          className="mt-5 space-y-5"
        >
          <div>
            <label htmlFor="current-password" className={labelClass}>
              Current Password
            </label>
            <div className="relative">
              <input
                type={showPassword.current ? "text" : "password"}
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm((f) => ({
                    ...f,
                    currentPassword: e.target.value,
                  }))
                }
                className={inputClass}
              />
              <button
                type="button"
                onClick={() =>
                  setShowPassword((prev) => ({
                    ...prev,
                    current: !prev.current,
                  }))
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone/30 hover:text-ink"
              >
                {showPassword.current ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {passwordErrors.currentPassword && (
              <p className={errorClass}>{passwordErrors.currentPassword}</p>
            )}
          </div>

          <div>
            <label htmlFor="current-password" className={labelClass}>
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword.new ? "text" : "password"}
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm((f) => ({
                    ...f,
                    newPassword: e.target.value,
                  }))
                }
                className={inputClass}
              />
              <button
                type="button"
                onClick={() =>
                  setShowPassword((prev) => ({
                    ...prev,
                    new: !prev.new,
                  }))
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone/30 hover:text-ink"
              >
                {showPassword.new ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {passwordErrors.newPassword && (
              <p className={errorClass}>{passwordErrors.newPassword}</p>
            )}
          </div>
          <div>
            <label htmlFor="current-password" className={labelClass}>
              Confirm Password
            </label>

            <div className="relative">
              <input
                type={showPassword.confirm ? "text" : "password"}
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm((f) => ({
                    ...f,
                    confirmPassword: e.target.value,
                  }))
                }
                className={inputClass}
              />
              <button
                type="button"
                onClick={() =>
                  setShowPassword((prev) => ({
                    ...prev,
                    confirm: !prev.confirm,
                  }))
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone/30 hover:text-ink"
              >
                {showPassword.confirm ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {passwordErrors.confirmPassword && (
              <p className={errorClass}>{passwordErrors.confirmPassword}</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={isSavingPassword}
              className="flex items-center gap-1.5 rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-paper transition-all duration-200 hover:opacity-90 active:scale-95 disabled:opacity-60"
            >
              {isSavingPassword ? (
                <Loader2
                  className="h-3.5 w-3.5 animate-spin"
                  strokeWidth={2.5}
                />
              ) : (
                <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
              )}
              Update Password
            </button>
            <button
              type="button"
              disabled={isSavingPassword}
              onClick={cancelPasswordEdit}
              className="flex items-center gap-1.5 rounded-lg border border-line-light px-4 py-2 text-sm font-semibold text-stone transition-all duration-200 hover:bg-paper-dim active:scale-95"
            >
              <X className="h-3.5 w-3.5" />
              Cancel
            </button>
          </div>
        </motion.form>
      )}
    </div>
  );
};

export default Security;
