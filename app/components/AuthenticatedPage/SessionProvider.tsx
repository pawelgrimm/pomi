import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import type { Session } from "../../utils/supabaseClient";
import { supabase } from "../../utils/supabaseClient";
import Auth from "../Auth";

const defaultSession: Session = {
  access_token: "",
  token_type: "empty",
  user: null,
};

const SessionContext = createContext<Session>(defaultSession);

type SessionProviderProps = PropsWithChildren<{}>;

export function useSession() {
  return useContext(SessionContext);
}

let defaultSessions = supabase.auth.session();

export function SessionProvider({ children }: SessionProviderProps) {
  const [session, setSession] = useState<Session | null>(defaultSession);

  useEffect(() => {
    setSession(supabase.auth.session());
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  if (session == null) {
    return <Auth />;
  }

  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
}
