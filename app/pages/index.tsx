import { useSession } from "../components/AuthenticatedPage/SessionProvider";
import { supabase } from "../utils/supabaseClient";
import { TimerPage } from "../components/Timer/TimerPage";

function logout() {
  return supabase.auth.signOut();
}

export default function Index() {
  const session = useSession();

  return <TimerPage />;
}
