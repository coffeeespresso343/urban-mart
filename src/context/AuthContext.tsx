import type { Session, User } from "@supabase/supabase-js";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

interface Profile {
  id: string;
  firstName: string | null;
  lastName: string | null;
}

interface AuthResult {
  error: string | null;
}

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  isConfigured: boolean;
  signUpWithPassword: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ) => Promise<AuthResult>;

  signInWithPassword: (email: string, password: string) => Promise<AuthResult>;
  signInWithMagicLink: (email: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  //   Load the existing session on mount, then keep it in sync with Supabase's auth events
  useEffect(() => {
    if (!isSupabaseConfigured) {
      setIsLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setIsLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
      },
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  //   Fetch the profile row whenever the sigined-in user changes.

  useEffect(() => {
    if (!user || !isSupabaseConfigured) {
      setProfile(null);
      return;
    }

    let cancelled = false;

    supabase
      .from("profiles")
      .select("id, first_name, last_name")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        if (!cancelled && data) {
          setProfile({
            id: data.id as string,
            firstName: data.first_name as string | null,
            lastName: data.last_name as string | null,
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [user]);

  const signUpWithPassword: AuthContextValue["signUpWithPassword"] = async (
    email,
    password,
    firstName,
    lastName,
  ) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { first_name: firstName, last_name: lastName } },
    });

    return { error: error?.message ?? null };
  };

  const signInWithPassword: AuthContextValue["signInWithPassword"] = async (
    email,
    password,
  ) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { error: error?.message ?? null };
  };

  const signInWithMagicLink: AuthContextValue["signInWithMagicLink"] = async (
    email,
  ) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/account` },
    });

    return { error: error?.message ?? null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value: AuthContextValue = {
    user,
    session,
    profile,
    isLoading,
    isConfigured: isSupabaseConfigured,
    signUpWithPassword,
    signInWithPassword,
    signInWithMagicLink,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used within AuthProvider");

  return ctx;
}
