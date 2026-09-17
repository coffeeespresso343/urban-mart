import { ArrowRight, Eye, EyeOff, Lock, X } from "lucide-react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { useUIStore } from "../../hooks/uiStore";
import { useState, type FormEvent } from "react";
import { useAuth } from "../../hooks/useAuth";
import { updateOwnPassword } from "../../lib/profile";
import { supabase } from "../../lib/supabase";
import { isValidPassword } from "../../utils/validation";
import { AnimatePresence, motion } from "framer-motion";

const inputClass =
  "rounded-lg w-full border border-admin-border bg-admin-card pr-11 px-3 py-2.5 text-sm outline-none focus:border-admin-blue";
const errorClass = "mt-1 text-xs text-admin-pink";

const AdminPassword = () => {
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

  const handlePasswordSubmit = async (e: FormEvent) => {
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

    const { error: updateError } = await updateOwnPassword(
      passwordForm.confirmPassword,
    );

    setIsSavingPassword(false);

    if (updateError) {
      showToast(updateError, "error");
      return;
    }

    setIsChangingPassword(false);
    showToast("Password updated successfully", "success");
  };

  const openPasswordEditor = () => {
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setPasswordErrors({});
    setIsChangingPassword(true);
  };

  const closePasswordEditor = () => {
    setIsChangingPassword(false);
    setPasswordErrors({});
  };

  return (
    <Card>
      <div className="flex flex-col gap-2">
        <div>
          <p className="text-admin-gray">Security</p>
          <p className="flex items-center gap-2 mt-4 text-lg font-medium">
            <Lock className="h-5 w-5 text-admin-gray" strokeWidth={1.5} />
            Password
          </p>
        </div>
        <p className="text-sm mt-1 text-stone">
          Change the password used to sign in.
        </p>
      </div>
      <AnimatePresence>
        {!isChangingPassword ? (
          <button
            onClick={openPasswordEditor}
            className="label-tag mt-6 flex items-center gap-1.5 font-semibold text-admin-gray hover:text-admin-gray-light"
          >
            Change Password
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: -14, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -14, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            onSubmit={handlePasswordSubmit}
            className="mt-4 space-y-5"
          >
            <div className="relative flex flex-col gap-1.5">
              <label
                htmlFor="profile-current-password"
                className="text-xs font-medium text-admin-gray"
              >
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
                  placeholder="Enter current password"
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
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-admin-gray-light/50"
                >
                  {showPassword ? (
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
            <div className="relative flex flex-col gap-1.5">
              <label
                htmlFor="profile-new-password"
                className="text-xs font-medium text-admin-gray"
              >
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
                  placeholder="Enter new password"
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
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-admin-gray-light/50"
                >
                  {showPassword ? (
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
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="profile-confirm-password"
                className="text-xs font-medium text-admin-gray"
              >
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
                  placeholder="Enter confirm password"
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
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-admin-gray-light/50"
                >
                  {showPassword ? (
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
            <div className="sm:col-span-2 mt-2  flex items-center gap-2">
              <Button
                type="submit"
                isLoading={isSavingPassword}
                className="w-full bg-admin-blue! text-white! border-admin-border! 
            hover:shadow-admin-blue hover:opacity-90!"
              >
                Update Password
              </Button>

              <Button
                type="submit"
                onClick={closePasswordEditor}
                className="bg-admin-gray-light! text-admin-ink! border-admin-border! hover:opacity-90!"
              >
                <X className="h-3.5 w-3.5" />
                Cancel
              </Button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default AdminPassword;
