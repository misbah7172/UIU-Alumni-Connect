import { useMutation } from "@tanstack/react-query";
import { post } from "@/lib/api";
import { firebaseAuth, googleProvider } from "@/lib/firebase";
import { useAuthStore } from "@/store/authStore";
import { getRedirectResult, signInWithRedirect, signOut } from "firebase/auth";

const allowedDomain = "uiu.ac.bd";

function isAllowedEmail(email: string | null) {
  return Boolean(email?.toLowerCase().endsWith(`.${allowedDomain}`));
}

export function useGoogleLogin() {
  const { setUser, setToken, setLoading } = useAuthStore();

  return useMutation({
    mutationFn: async () => {
      setLoading(true);
      await signInWithRedirect(firebaseAuth, googleProvider);
    },
    onError: () => {
      setLoading(false);
    }
  });
}

export function useGoogleRedirectResult() {
  const { setUser, setToken, setLoading } = useAuthStore();

  return useMutation({
    mutationFn: async () => {
      setLoading(true);
      const credential = await getRedirectResult(firebaseAuth);
      if (!credential) return null;

      const email = credential.user.email;
      if (!isAllowedEmail(email)) {
        await signOut(firebaseAuth);
        throw new Error(`Only Google accounts ending with .${allowedDomain} are allowed.`);
      }

      return post("/auth/firebase/google", {
        idToken: await credential.user.getIdToken()
      });
    },
    onSuccess: (data) => {
      if (!data) {
        setLoading(false);
        return;
      }

      setUser(data.user);
      setToken(data.token);
      localStorage.setItem("token", data.token);
      setLoading(false);
    },
    onError: () => {
      setLoading(false);
    }
  });
}

export function useLogout() {
  const { logout } = useAuthStore();

  return async () => {
    localStorage.removeItem("token");
    await signOut(firebaseAuth);
    logout();
  };
}
