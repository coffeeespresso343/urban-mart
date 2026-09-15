import {
  Activity,
  CalendarClock,
  Camera,
  Clock,
  Eye,
  EyeOff,
  Loader,
  Lock,
  ShieldCheck,
  User2,
  UserShield,
} from "lucide-react";
import ImageWithFallback from "../../components/ui/ImageWithFallback";
import { useAuth } from "../../hooks/useAuth";
import { Card } from "./AdminOverview";
import { Button } from "../../components/ui/Button";
import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  fetchAdminGrantedAt,
  updateOwnPassword,
  updateOwnProfile,
} from "../../lib/profile";
import { useUIStore } from "../../hooks/uiStore";
import { uploadAvatar } from "../../lib/storage";

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

  const [firstName, setFirstName] = useState(profile?.firstName ?? "");
  const [lastName, setLastName] = useState(profile?.lastName ?? "");
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfrimPassword] = useState("");
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [adminSince, setAdminSince] = useState<string | null | undefined>(null);

  const handleAvatarChange = async (file: File) => {
    if (!user) return;

    setIsUploadingAvatar(true);

    const { url, error: uploadError } = await uploadAvatar(file, user.id);

    if (uploadError || !url) {
      showToast(uploadError ?? "Upload failed. Try again later", "error");
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

  const handleProfileSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!user) return;

    if (profile?.firstName === firstName && profile.lastName === lastName) {
      showToast("Try different names.", "error");
      return;
    }

    setIsSavingProfile(true);

    try {
      const { error } = await updateOwnProfile(user.id, {
        firstName,
        lastName,
      });

      if (error) return showToast(error, "error");
    } finally {
      setIsSavingProfile(false);
    }

    showToast("Profile name updated", "success");
    void refreshProfile();
  };

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!user) return;

    if (newPassword !== confirmPassword) {
      showToast("Passwords don't match", "error");
      return;
    }

    setIsSavingPassword(true);

    try {
      const { error } = await updateOwnPassword(newPassword);
      if (error) return showToast(error, "error");
    } finally {
      setIsSavingPassword(false);
      setNewPassword("");
      setConfrimPassword("");
    }

    showToast("Password updated", "success");
  };

  useEffect(() => {
    setFirstName(profile?.firstName ?? "");
    setLastName(profile?.lastName ?? "");
  }, [profile]);

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
        <h2 className="text-xl font-bold">My Profile</h2>
      </div>

      <Card>
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="h-20 w-20 overflow-hidden ring-3 ring-orange/70 rounded-full bg-admin-active">
              {profile?.avatarUrl ? (
                <ImageWithFallback
                  src={profile.avatarUrl}
                  alt="Your avatar"
                  className="h-full w-full object-cover"
                />
              ) : isUploadingAvatar ? (
                <span className="flex h-full w-full items-center justify-center text-admin-gray-light">
                  <Loader className="h-6 w-6 animate-spin" />
                </span>
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

          <div>
            <p className="text-sm font-semibold">
              {profile?.firstName
                ? `${profile.firstName} ${profile.lastName ?? ""}`
                : "Admin"}
            </p>
            <p className="text-sm text-admin-gray">{user?.email}</p>
          </div>
        </div>

        <form
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
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="rounded-lg border border-admin-border bg-admin-card px-3 py-2.5 text-sm
            outline-none focus:border-admin-blue"
            />
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
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="rounded-lg border border-admin-border bg-admin-card px-3 py-2.5 text-sm
            outline-none focus:border-admin-blue"
            />
          </div>
          <div className="sm:col-span-2">
            <Button
              type="submit"
              isLoading={isSavingProfile}
              className="w-full sm:w-auto bg-admin-blue! text-white! border-admin-border! hover:opacity-90!"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </Card>

      <Card>
        <div className="flex items-center gap-2.5">
          <Lock className="h-4 w-4 text-admin-gray" />
          <h3 className="text-sm font-semibold">Change Password</h3>
        </div>
        <form
          onSubmit={handlePasswordSubmit}
          className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2"
        >
          <div className="relative flex flex-col gap-1.5">
            <label
              htmlFor="profile-new-password"
              className="text-xs font-medium text-admin-gray"
            >
              New Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="At least 8 characters"
              className="rounded-lg border border-admin-border bg-admin-card pr-11 px-3 py-2.5 text-sm
            outline-none focus:border-admin-blue"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-4 top-1/2 translate-y-1/4 text-admin-gray-light/50"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="profile-confirm-password"
              className="text-xs font-medium text-admin-gray"
            >
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfrimPassword(e.target.value)}
              placeholder=""
              className="rounded-lg border border-admin-border bg-admin-card pr-11 px-3 py-2.5 text-sm
            outline-none focus:border-admin-blue"
            />
          </div>
          <div className="sm:col-span-2">
            <Button
              type="submit"
              isLoading={isSavingPassword}
              className="w-full sm:w-auto bg-admin-blue! text-white! border-admin-border! 
           hover:shadow-admin-blue hover:opacity-90!"
            >
              Update Password
            </Button>
          </div>
        </form>
      </Card>

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
