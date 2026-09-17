"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { GENDER_COOKIE, normalizeGender, gx } from "@/lib/genderedText";
import { updateGenderAction } from "@/app/(auth)/actions";

const GenderContext = createContext({
  gender: "female",
  isMale: false,
  setGender: () => {},
  // t(feminine, masculine) — client-side picker for Client Components.
  t: (feminine) => feminine,
});

export function GenderProvider({ initialGender, isLoggedIn, children }) {
  const router = useRouter();
  const [gender, setGenderState] = useState(normalizeGender(initialGender));

  const setGender = useCallback(
    (next) => {
      const g = normalizeGender(next);
      setGenderState(g);
      // Persist for guests (and as fallback) in a cookie the server can read.
      try {
        document.cookie = `${GENDER_COOKIE}=${g}; path=/; max-age=31536000; SameSite=Lax`;
      } catch {}
      // Persist for logged-in users in their profile (fire & forget).
      if (isLoggedIn) {
        try {
          updateGenderAction(g).catch(() => {});
        } catch {}
      }
      // Re-render Server Components with the new gender.
      router.refresh();
    },
    [isLoggedIn, router]
  );

  const t = useCallback(
    (feminine, masculine) => gx(gender, feminine, masculine),
    [gender]
  );

  return (
    <GenderContext.Provider
      value={{ gender, isMale: gender === "male", setGender, t }}
    >
      {children}
    </GenderContext.Provider>
  );
}

export function useGender() {
  return useContext(GenderContext);
}
