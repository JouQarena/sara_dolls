// 🌸 Gender-aware Arabic speech (مؤنث / مذكر).
// The store addresses each visitor according to their gender:
//   - logged-in user → profiles.gender (chosen at signup, editable in profile)
//   - guest → the `sara_gender` cookie set by the 👩/👨 toggle
//   - fallback → 'female' (brand default)
//
// Only SECOND-PERSON speech ("you") changes. Descriptions of products
// (e.g. "دمية مصنوعة بحب") stay feminine because the nouns are feminine.

export const GENDER_COOKIE = "sara_gender";

export const GENDERS = {
  FEMALE: "female",
  MALE: "male",
};

export function normalizeGender(value) {
  return value === "male" ? "male" : "female";
}

export function isMaleGender(gender) {
  return normalizeGender(gender) === "male";
}

// Server-safe picker: gx(gender, feminineText, masculineText).
// Usage in Server Components: const gender = await getUserGender();
export function gx(gender, feminine, masculine) {
  return isMaleGender(gender) ? masculine : feminine;
}
