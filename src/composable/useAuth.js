import Api from "@/composable/useApi";
import { get, set } from "./useStorage";

export const tokenKey = "auth:token";
export const userKey = "auth:user";

export const useLogin = async function (username, password) {
  try {
    const response = await Api.post(
      `${import.meta.env.VITE_API_BASE_URL}/jwt-auth/v1/token`,
      {
        username,
        password,
      }
    );

    set(tokenKey, response.data.token, "text");
    const { data } = await me();
    set(userKey, data);

    return [true, response.data];
  } catch ({ response }) {
    return [false, response.data.message];
  }
};

export const hasToken = function () {
  const token = get(tokenKey, false, "text");
  return token !== false;
};

export const getToken = function () {
  return get(tokenKey, "", "text");
};

/**
 * Get auth user
 *
 * @returns {string|JSON}
 */
export const user = function () {
  return get(userKey, {});
};

export const me = async function () {
  return Api.get(`${import.meta.env.VITE_API_BASE_URL}/wp/v2/users/me`);
};
