import { User2 } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { Link } from "react-router-dom";

const AccountMenuMobile = () => {
  const { user, profile, isConfigured } = useAuth();

  if (user) {
    return (
      <Link
        to="/login"
        className="h-8 w-8 flex items-center justify-center bg-ink rounded-full text-orange transition-colors hover:text-orange"
      >
        <User2 className="h-5 w-5" aria-hidden="true" />
      </Link>
    );
  }
  return <div>hi</div>;
};

export default AccountMenuMobile;
