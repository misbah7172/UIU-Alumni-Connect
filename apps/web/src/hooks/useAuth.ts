import { useMutation } from "@tanstack/react-query";
import { post } from "@/lib/api";
import { firebaseAuth, googleProvider } from "@/lib/firebase";
import { useAuthStore } from "@/store/authStore";
import { signInWithPopup, signOut } from "firebase/auth";

const allowedDomain = "uiu.ac.bd";

function isAllowedEmail(email: string | null) {
  return Boolean(email?.toLowerCase().endsWith(`@${allowedDomain}`));
}

export function useGoogleLogin() {
  const { setUser, setToken, setLoading } = useAuthStore();

  return useMutation({
    mutationFn: async () => {
      setLoading(true);
      const credential = await signInWithPopup(firebaseAuth, googleProvider);
      const email = credential.user.email;

      if (!isAllowedEmail(email)) {
        await signOut(firebaseAuth);
        throw new Error(`Only ${allowedDomain} Google accounts are allowed.`);
      }

      const idToken = await credential.user.getIdToken();
      const data = await post("/auth/firebase/google", { idToken });
      return data;
    },
    onSuccess: (data) => {
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
