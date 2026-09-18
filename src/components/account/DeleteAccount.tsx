import { Loader2, ShieldAlert, Trash2 } from "lucide-react";
import Modal from "../ui/Modal";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useUIStore } from "../../hooks/uiStore";
import { useNavigate } from "react-router-dom";

const inputClass =
  "w-full rounded-lg border border-line-light bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-orange transition-colors";

const DeleteAccount = () => {
  const { user } = useAuth();
  const showToast = useUIStore((s) => s.showToast);
  const navigate = useNavigate();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    if (!user || deleteConfirmText !== "DELETE") return;

    setIsDeleting(true);
    showToast("Your account have been deleted.", "success");

    setIsDeleting(false);
    navigate("/");
  };

  return (
    <>
      <div className="bg-admin-pink/5 border border-admin-pink/30 rounded-xl p-6">
        <p className="label-tag text-admin-pink flex items-center gap-2">
          <ShieldAlert className="h-4 w-4" />
          Danger Zone
        </p>
        <p className="mt-3 text-sm text-stone max-w-lg">
          Deleting your account is permanent. Your profile, order history, and
          saved data will be removed and cannot be undone.
        </p>
        <button
          type="button"
          onClick={() => setIsDeleteModalOpen(true)}
          className="mt-4 flex items-center gap-2 rounded-full border border-admin-pink px-3 py-1.5 text-sm
      font-semibold text-admin-pink transition-all duration-200 hover:bg-admin-pink/10 active:scale-95"
        >
          <Trash2 className="h-4 w-4" /> Delete Account
        </button>
      </div>

      {isDeleteModalOpen && (
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Delete your account?"
        >
          <p className="mt-2 text-xs text-stone">
            This can't be undone. Type{" "}
            <span className="font-semibold">'DELETE'</span>
          </p>
          <input
            type="text"
            value={deleteConfirmText}
            onChange={(e) => setDeleteConfirmText(e.target.value)}
            className={`mt-4 ${inputClass}`}
          />
          <div className="mt-5 flex items-center gap-2">
            <button
              disabled={isDeleting || deleteConfirmText !== "DELETE"}
              onClick={handleDeleteAccount}
              className="flex items-center gap-2 rounded-full bg-admin-pink px-4 py-2 text-sm font-semibold
            text-white transition-all duration-200 hover:opacity-90 active:scale-95 disabled:opacity-50"
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.5} />
              ) : (
                <Trash2 className="h-4 w-4" strokeWidth={2.5} />
              )}
              Delete Permantly
            </button>
            <button
              type="button"
              disabled={isDeleting}
              onClick={() => {
                setIsDeleteModalOpen(false);
                setDeleteConfirmText("");
              }}
              className="rounded-full border border-line-light px-4 py-2 text-sm font-semibold text-stone transition-all duration-200 hover:bg-paper-dim active:scale-95"
            >
              Cancel
            </button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default DeleteAccount;
