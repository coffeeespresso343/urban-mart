import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  ArrowRight,
  Loader2,
  LogOut,
  Mail,
  Package,
  User2,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { useState } from "react";

const Account = () => {
  const { user, profile, signOut } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignOut = async () => {
    setIsLoading(true);
    await signOut();
    setIsLoading(false);
    navigate("/");
  };

  return (
    <div className="container-edge py-10 sm:py-14">
      <h1 className="mt-4 flex items-center gap-2 font-display text-3xl font-black tracking-tight text-ink sm:text-4xl">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-line-light bg-paper-dim sm:h-11 sm:w-11">
          <User2 className="h-5 w-5 text-orange" />
        </span>
        Account
      </h1>
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="border border-line-light rounded-xl p-6">
          <p className="label-tag text-stone">Signed in as</p>
          <p className="mt-2 text-lg font-medium">
            {profile?.firstName
              ? `${profile.firstName} ${profile.lastName}`
              : "Urban-Mart Customer"}
          </p>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-stone">
            <Mail className="h-3.5 w-3.5" aria-hidden="true" />
            {user?.email}
          </p>

          <Button
            size="sm"
            variant="outline"
            disabled={isLoading}
            onClick={handleSignOut}
            className="mt-6"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin" />{" "}
                SigningOut...
              </>
            ) : (
              <>
                <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
                Sign Out
              </>
            )}
          </Button>
        </div>

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
      </div>
    </div>
  );
};

export default Account;
