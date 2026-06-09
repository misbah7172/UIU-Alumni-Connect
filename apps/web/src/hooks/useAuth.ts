import { useMutation } from "@tanstack/react-query";
import { post } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

export function useLogin() {
  const { setUser, setToken, setLoading } = useAuthStore();

  return useMutation({
    mutationFn: async (email: string) => {
      const data = await post("/auth/login", { email });
      return data;
    },
    onSuccess: (data) => {
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem("token", data.token);
    },
    onError: () => {
      setLoading(false);
    }
  });
}

export function useRegister() {
  const { setUser, setToken, setLoading } = useAuthStore();

  return useMutation({
    mutationFn: async (data: any) => {
      const result = await post("/auth/register", data);
      return result;
    },
    onSuccess: (data) => {
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem("token", data.token);
    },
    onError: () => {
      setLoading(false);
    }
  });
}

export function useLogout() {
  const { logout } = useAuthStore();

  return () => {
    localStorage.removeItem("token");
    logout();
  };
}
