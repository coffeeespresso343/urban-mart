import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { ArrowRight, LogOut, Mail, Package } from "lucide-react";
import { Button } from "../components/ui/Button";

const Account = () => {
  const { user, profile, signOut } = useAuth();

  const navigate = useNavigate();

  return (
    <div className="container-edge py-10 sm:py-14">
      <h1 className="font-display text-4xl font-semibold tracking-wide sm:text-5xl">
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
            onClick={async () => {
              await signOut();
              navigate("/");
            }}
            className="mt-6"
          >
            <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
            Sign Out
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
