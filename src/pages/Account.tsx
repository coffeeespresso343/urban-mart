import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Camera,
  Check,
  Loader,
  Loader2,
  LogOut,
  Package,
  Pencil,
  ShieldCheck,
  User2,
  X,
} from "lucide-react";
import { useRef, useState, type FormEvent } from "react";
import { useUIStore } from "../hooks/uiStore";
import Badge from "../components/ui/Badge";
import ImageWithFallback from "../components/ui/ImageWithFallback";
import { uploadAvatar } from "../lib/storage";
import { updateOwnProfile } from "../lib/profile";
import { isValidEmail, required } from "../utils/validation";
import { supabase } from "../lib/supabase";
import Security from "../components/account/Security";
import DeleteAccount from "../components/account/DeleteAccount";

const Account = () => {
  const { user, profile, signOut, isAdmin, refreshProfile } = useAuth();

  const navigate = useNavigate();
  const showToast = useUIStore((s) => s.showToast);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const handleAvatarChange = async (file: File) => {
    if (!user) return;

    setIsUploadingAvatar(true);

    const { url, error: uploadError } = await uploadAvatar(file, user.id);

    if (uploadError || !url) {
      showToast(
        uploadError ?? "Avatar upload failed. Try again later",
        "error",
      );
      setIsUploadingAvatar(false);
      return;
    }

    const { error } = await updateOwnProfile(user.id, { avatarUrl: url });

    setIsUploadingAvatar(false);

    if (error) {
      showToast(error, "error");
      return;
    }

    showToast("Successfully updated avatar", "success");
    void refreshProfile();
  };

  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await signOut();
    setIsSigningOut(false);
    showToast("Successfully signed out! See you again.", "success");
    navigate("/");
  };

  // ---------- Edit profile (name / email) -----------
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    firstName: profile?.firstName ?? "",
    lastName: profile?.lastName ?? "",
    email: user?.email ?? "",
  });

  const [profileErrors, setProfileErrors] = useState<Record<string, string>>(
    {},
  );

  const openProfileEditor = () => {
    setProfileForm({
      firstName: profile?.firstName ?? "",
      lastName: profile?.lastName ?? "",
      email: user?.email ?? "",
    });

    setProfileErrors({});
    setIsEditingProfile(true);
  };

  const cancelProfileEdit = () => {
    setIsEditingProfile(false);
    setProfileErrors({});
  };

  const validateProfileForm = () => {
    const errors: Record<string, string> = {};

    if (!required(profileForm.firstName.trim()))
      errors.firstName = "First name is required";

    if (!profileForm.email.trim()) {
      errors.email = "Email is required";
    } else if (!isValidEmail(profileForm.email.trim())) {
      errors.email = "Please enter a valid email address";
    }

    setProfileErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSaveProfile = async (e: FormEvent) => {
    e.preventDefault();

    if (!user) return;
    if (!validateProfileForm()) return;

    const firstName = profileForm.firstName.trim();
    const lastName = profileForm.lastName.trim();
    const email = profileForm.email.trim();

    const currentFirstName = profile?.firstName?.trim() ?? "";
    const currentLastName = profile?.lastName?.trim() ?? "";
    const currentEmail = user?.email?.trim() ?? "";

    const nameChanged =
      firstName !== currentFirstName || lastName !== currentLastName;

    const emailChanged = email !== currentEmail;

    if (!nameChanged && !emailChanged) {
      showToast("No changes to save. Try different names or email.", "error");
      return;
    }

    setIsSavingProfile(true);

    try {
      if (nameChanged) {
        const { error } = await updateOwnProfile(user.id, {
          firstName,
          lastName,
        });

        if (error) {
          showToast(error, "error");
          return;
        }
      }

      if (emailChanged) {
        const { error: authError } = await supabase.auth.updateUser({
          email,
        });

        if (authError) {
          showToast(authError.message, "error");
          return;
        }
      }

      setIsEditingProfile(false);
      showToast(
        emailChanged
          ? "Profile updated. Check your new email inbox to confirm the change."
          : "Successfully updated profile.",
        "success",
      );
      void refreshProfile();
    } finally {
      setIsSavingProfile(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-line-light bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-orange transition-colors";
  const labelClass = "label-tag text-stone mb-1.5 block";
  const errorClass = "mt-1 text-xs text-error";

  return (
    <div className="container-edge py-10 sm:py-14">
      <h1 className="mt-4 flex items-center gap-2 font-display text-3xl font-black tracking-tight text-ink sm:text-4xl">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-line-light bg-paper-dim sm:h-11 sm:w-11">
          <User2 className="h-5 w-5 text-orange" />
        </span>
        Account
      </h1>
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="border border-line-light rounded-xl p-6 sm:col-span-2">
          <div className="flex items-start justify-between gap-4">
            <p className="label-tag text-stone">Profile</p>
            {!isEditingProfile && (
              <button
                onClick={openProfileEditor}
                className="flex items-center gap-1.5 rounded-full border border-ink/10 bg-paper-dim/50
              px-3 py-1.5 text-xs font-semibold transition-all duration-200 hover:bg-paper-dim hover:text-orange active:scale-95"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </button>
            )}
          </div>

          <div className="mt-4 flex items-center gap-4">
            <div className="relative">
              <div className="h-14 w-14 bg-admin-card ring-3 ring-orange/70 overflow-hidden rounded-full">
                {isUploadingAvatar ? (
                  <span className="flex h-full w-full items-center justify-center text-admin-gray-light">
                    <Loader className="h-4 w-4 animate-spin" />
                  </span>
                ) : profile?.avatarUrl ? (
                  <ImageWithFallback
                    src={profile.avatarUrl}
                    alt="Your avatar"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full text-2xl bg-admin-gray-light text-admin-gray font-bold items-center justify-center">
                    {profile?.firstName
                      ? profile.firstName[0].toUpperCase()
                      : "-"}
                  </div>
                )}
              </div>
              <button
                type="button"
                disabled={isUploadingAvatar}
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-stone/90
            hover:opacity-90 active:scale-[0.98] text-white disabled:opacity-50"
              >
                <Camera className="h-3 w-3" />
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void handleAvatarChange(file);
                  e.target.value = "";
                }}
                className="hidden"
              />
            </div>

            {!isEditingProfile ? (
              <div className="min-w-0">
                <p className="text-md font-medium flex items-center gap-1.5">
                  {profile?.firstName} {profile?.lastName}
                  {isAdmin ? (
                    <Badge tone="blue" className="">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Admin
                    </Badge>
                  ) : null}
                </p>
                <p className="text-stone text-sm">{user?.email}</p>
              </div>
            ) : (
              <p className="text-sm text-stone">Update your details below.</p>
            )}
          </div>

          {isEditingProfile && (
            <motion.form
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.35,
                delay: 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
              onSubmit={handleSaveProfile}
              className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2"
            >
              <div>
                <label htmlFor="profile-first-name" className={labelClass}>
                  First name
                </label>
                <input
                  id="profile-first-name"
                  type="text"
                  value={profileForm.firstName}
                  onChange={(e) =>
                    setProfileForm((f) => ({ ...f, firstName: e.target.value }))
                  }
                  className={inputClass}
                />
                {profileErrors.firstName && (
                  <p className={errorClass}>{profileErrors.firstName}</p>
                )}
              </div>
              <div>
                <label htmlFor="profile-first-name" className={labelClass}>
                  Last Name
                </label>
                <input
                  id="profile-last-name"
                  type="text"
                  value={profileForm.lastName}
                  onChange={(e) =>
                    setProfileForm((f) => ({ ...f, lastName: e.target.value }))
                  }
                  className={inputClass}
                />
                {profileErrors.lastName && (
                  <p className={errorClass}>{profileErrors.lastName}</p>
                )}
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="profile-email" className={labelClass}>
                  Email
                </label>
                <input
                  id="profile-email"
                  type="email"
                  value={profileForm.email}
                  onChange={(e) =>
                    setProfileForm((f) => ({ ...f, email: e.target.value }))
                  }
                  className={inputClass}
                />
                {profileErrors.email && (
                  <p className={errorClass}>{profileErrors.email}</p>
                )}
                <p className="mt-1 text-xs text-stone">
                  Changing your email will send a confirmation link to new
                  address.
                </p>
              </div>

              <div className="sm:col-span-2 w-full flex items-center gap-2">
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="flex items-center gap-1.5 rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-paper transition-all duration-200 hover:opacity-90 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSavingProfile ? (
                    <Loader2
                      className="h-3.5 w-3.5 animate-spin"
                      strokeWidth={2.5}
                    />
                  ) : (
                    <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                  )}
                  Save changes
                </button>

                <button
                  onClick={cancelProfileEdit}
                  className="flex items-center gap-1.5 rounded-lg border border-line-light px-4 py-2
                  text-sm font-semibold text-stone transition-all duration-200 hover:bg-paper-dim active:scale-95"
                >
                  <X className="h-3.5 w-3.5" />
                  Cancel
                </button>
              </div>
            </motion.form>
          )}

          <div className="mt-6 flex items-center justify-between gap-2 border-t border-line-light pt-6">
            <button
              disabled={isSigningOut}
              onClick={handleSignOut}
              className="rounded-2xl min-w-32 text-sm border border-error flex items-center justify-center gap-1 text-error px-3 py-1 hover:bg-error/10 transition-all duration-200 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSigningOut ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin" />
                  Signing Out
                </>
              ) : (
                <>
                  <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
                  Sign Out
                </>
              )}
            </button>
            {isAdmin && (
              <Link
                to="/admin"
                className="text-xs flex items-center gap-1.5 font-semibold border border-ink/10 rounded-full px-3 py-1.5
              transition-all duration-200 bg-paper-dim/50 hover:bg-paper-dim hover:text-orange active:scale-98"
              >
                Admin Dashboard
                <ArrowRight className="h-3.5 w-3.5 group-hover:text-orange" />
              </Link>
            )}
          </div>
        </div>

        {/*Password*/}
        <Security />

        <Link
          to="/account/orders"
          className="group flex flex-col justify-between border border-line-light rounded-xl p-6 hover:border-ink"
        >
          <div>
            <Package className="h-6 w-6 text-orange" strokeWidth={1.5} />
            <p className="mt-4 text-lg font-medium">Order History</p>
            <p className="mt-1 text-sm text-stone">
              View past orders and track deliveries.
            </p>
          </div>
          <span className="label-tag mt-6 flex items-center gap-1.5 font-semibold group-hover:text-orange">
            View Orders
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
        </Link>

        {/*Danger Zone */}
        <DeleteAccount />
      </div>
    </div>
  );
};

export default Account;
