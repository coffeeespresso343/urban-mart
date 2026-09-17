import {
  Activity,
  CalendarClock,
  Camera,
  Clock,
  Loader,
  Pencil,
  ShieldCheck,
  User2,
  UserShield,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import ImageWithFallback from "../../components/ui/ImageWithFallback";
import { useAuth } from "../../hooks/useAuth";
import { Card } from "./AdminOverview";
import { Button } from "../../components/ui/Button";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { fetchAdminGrantedAt, updateOwnProfile } from "../../lib/profile";
import { useUIStore } from "../../hooks/uiStore";
import { uploadAvatar } from "../../lib/storage";
import { isValidEmail, required } from "../../utils/validation";
import { supabase } from "../../lib/supabase";
import AdminPassword from "../../components/admin/AdminPassword";

const formatDate = (iso: string | null | undefined): string => {
  if (!iso) return "-";

  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const AdminProfile = () => {
  const { user, profile, refreshProfile } = useAuth();
  const showToast = useUIStore((s) => s.showToast);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // ---------- Handle profile change (name / email) ------------
  const [openProfileEditor, setOpenProfileEditor] = useState(false);
  const [profileForm, setProfileForm] = useState({
    firstName: profile?.firstName ?? "",
    lastName: profile?.lastName ?? "",
    email: user?.email ?? "",
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const [profileErrors, setProfileErrors] = useState<Record<string, string>>(
    {},
  );

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

  const handleProfileSubmit = async (e: FormEvent) => {
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
          setIsSavingProfile(false);
          showToast(error, "error");
          return;
        }
      }

      if (emailChanged) {
        const { error: authError } = await supabase.auth.updateUser({
          email,
        });

        if (authError) {
          setIsSavingProfile(false);
          showToast(authError.message, "error");
          return;
        }
      }

      showToast(
        emailChanged
          ? "Profile updated. Check your new email inbox to confirm the change."
          : "Successfully updated profile.",
        "success",
      );
      void refreshProfile();
    } finally {
      setIsSavingProfile(false);
      setOpenProfileEditor(false);
    }
  };
  const [adminSince, setAdminSince] = useState<string | null | undefined>(null);

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
      return showToast(error, "error");
    }
    showToast("Successfully updated avatar.", "success");
    void refreshProfile();
  };

  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    fetchAdminGrantedAt(user.id).then((date) => {
      if (!cancelled) setAdminSince(date);
    });

    return () => {
      cancelled = true;
    };
  }, [user]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-2.5">
        <span className="h-10 w-10 flex items-center justify-center bg-admin-active rounded-xl">
          <UserShield className="h-6 w-6 text-admin-gray" />
        </span>
        <h2 className="text-xl font-bold">Admin Profile</h2>
      </div>

      <Card className="relative">
        {openProfileEditor ? (
          <button
            onClick={() => {
              setOpenProfileEditor(false);
              setProfileErrors({});
            }}
            className="absolute right-4 bg-admin-active text-admin-gray-light px-2 py-1 rounded-full text-xs
            font-semibold flex items-center gap-1 transition-all duration-200 hover:text-admin-gray active:scale-95"
          >
            <X className="h-3 w-3" strokeWidth={2.5} />
            Cancel
          </button>
        ) : (
          <button
            onClick={() => setOpenProfileEditor(true)}
            className="absolute right-4 bg-admin-active text-admin-gray-light px-2 py-1 rounded-full text-xs
            font-semibold flex items-center gap-1 transition-all duration-200 hover:text-admin-gray active:scale-95"
          >
            <Pencil className="h-3 w-3" strokeWidth={2.5} />
            Edit
          </button>
        )}
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="h-16 w-16 overflow-hidden ring-3 ring-orange/70 rounded-full bg-admin-active">
              {isUploadingAvatar ? (
                <span className="flex h-full w-full items-center justify-center text-admin-gray-light">
                  <Loader className="h-6 w-6 animate-spin" />
                </span>
              ) : profile?.avatarUrl ? (
                <ImageWithFallback
                  src={profile.avatarUrl}
                  alt="Your avatar"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <User2 className="h-8 w-8 text-admin-gray-light" />
                </div>
              )}
            </div>
            <button
              type="button"
              disabled={isUploadingAvatar}
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-stone/90
              hover:opacity-90 active:scale-[0.98] text-white disabled:opacity-50"
            >
              <Camera className="h-3.5 w-3.5" />
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

          {!openProfileEditor ? (
            <div>
              <p className="flex items-center gap-1 text-sm font-semibold">
                {profile?.firstName
                  ? `${profile.firstName} ${profile.lastName ?? ""}`
                  : "Admin"}
                <ShieldCheck className="h-3 w-3 text-admin-green" />
              </p>
              <p className="text-sm text-admin-gray">{user?.email}</p>
            </div>
          ) : (
            <p className="text-sm text-admin-gray">Edit your details below.</p>
          )}
        </div>

        <AnimatePresence>
          {openProfileEditor ? (
            <motion.form
              initial={{ opacity: 0, y: -14, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -14, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              onSubmit={handleProfileSubmit}
              className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2"
            >
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="profile-first-name"
                  className="text-xs font-medium text-admin-gray"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="profile-first-name"
                  value={profileForm.firstName}
                  onChange={(e) =>
                    setProfileForm((f) => ({
                      ...f,
                      firstName: e.target.value,
                    }))
                  }
                  className="rounded-lg border border-admin-border bg-admin-card px-3 py-2.5 text-sm
            outline-none focus:border-admin-blue"
                />
                {profileErrors.firstName && (
                  <p className="mt-1 text-xs text-admin-pink">
                    {profileErrors.firstName}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="profile-last-name"
                  className="text-xs font-medium text-admin-gray"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="profile-last-name"
                  value={profileForm.lastName}
                  onChange={(e) =>
                    setProfileForm((f) => ({
                      ...f,
                      lastName: e.target.value,
                    }))
                  }
                  className="rounded-lg border border-admin-border bg-admin-card px-3 py-2.5 text-sm
            outline-none focus:border-admin-blue"
                />
                {profileErrors.lastName && (
                  <p className="mt-1 text-xs text-admin-pink">
                    {profileErrors.lastName}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="profile-last-name"
                  className="text-xs font-medium text-admin-gray"
                >
                  Email
                </label>
                <input
                  type="text"
                  id="profile-email"
                  value={profileForm.email}
                  onChange={(e) =>
                    setProfileForm((f) => ({
                      ...f,
                      email: e.target.value,
                    }))
                  }
                  className="rounded-lg border border-admin-border bg-admin-card px-3 py-2.5 text-sm
            outline-none focus:border-admin-blue"
                />
                {profileErrors.email && (
                  <p className="mt-1 text-xs text-admin-pink">
                    {profileErrors.email}
                  </p>
                )}
              </div>
              <div className="mt-2 sm:col-span-2">
                <Button
                  type="submit"
                  isLoading={isSavingProfile}
                  className="w-full bg-admin-blue! text-white! border-admin-border! hover:opacity-90!"
                >
                  Save Changes
                </Button>
              </div>
            </motion.form>
          ) : null}
        </AnimatePresence>
      </Card>

      <AdminPassword />

      <Card>
        <div className="flex items-center gap-2.5">
          <Activity className="h-4 w-4 text-admin-gray" />
          <h3 className="text-sm font-semibold">Account Activity</h3>
        </div>
        <div className="mt-4 flex flex-col gap-3 text-sm">
          <div className="flex items-center gap-2.5 text-admin-gray">
            <ShieldCheck className="h-4 w-4 shrink-0" />
            Admin since{" "}
            <span className="font-medium text-admin-ink">
              {adminSince === undefined ? "..." : formatDate(adminSince)}
            </span>
          </div>
          <div className="flex items-center gap-2.5 text-admin-gray">
            <Clock className="h-4 w-4 shrink-0" />
            Last signed in{" "}
            <span className="font-medium text-admin-ink">
              {formatDate(user?.last_sign_in_at)}
            </span>
          </div>
          <div className="flex items-center gap-2.5 text-admin-gray">
            <CalendarClock className="h-4 w-4 shrink-0" />
            Account created{" "}
            <span className="font-medium text-admin-ink">
              {formatDate(user?.created_at)}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdminProfile;
