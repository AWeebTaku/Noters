import axios from "axios";

export function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// Pulls the API's { message, errors? } out of a failed request.
export function getErrorMessage(error: unknown, fallback: string) {
  if (!axios.isAxiosError(error)) return fallback;
  const data = error.response?.data as
    | { message?: string; errors?: { message: string }[] }
    | undefined;
  if (data?.errors?.length) return data.errors.map((e) => e.message).join(". ");
  return data?.message ?? fallback;
}

export const isRateLimited = (error: unknown) =>
  axios.isAxiosError(error) && error.response?.status === 429;
