import {useEffect, useState} from "react";
import {Session, supabase} from "../utils/supabaseClient";
import Auth from "../components/Auth";
import Account from "../components/Account";

export default function Home() {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    setSession(supabase.auth.session())

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  return (
        !session ? <Auth /> : <Account key={session?.user?.id} session={session} />
  )
}

