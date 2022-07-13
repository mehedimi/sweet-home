import { hasToken } from "@/composable/useAuth";

export default function () {
  if (!hasToken()) {
    return {
      name: "auth.login",
    };
  }
}
