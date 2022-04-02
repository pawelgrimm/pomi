import { useSession } from "../components/AuthenticatedPage/SessionProvider";
import { supabase } from "../utils/supabaseClient";

function logout() {
  return supabase.auth.signOut();
}

export default function Home() {
  const session = useSession();

  return (
    <section>
      <h1>Session Info</h1>
      <p>User ID: {session.user?.id}</p>
      <p>Email: {session.user?.email}</p>
      <button onClick={logout}>Log out</button>
    </section>
  );
}
