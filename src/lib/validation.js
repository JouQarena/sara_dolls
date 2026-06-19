// 🌸 Sara Dolls — shared form validation helpers (Arabic messages)

// Egyptian mobile numbers: 010/011/012/015 + 8 digits = 11 digits total.
// Accepts optional +20 / 0020 / 20 country prefix and spaces/dashes.
export function normalizeEgyptPhone(input) {
  if (!input) return "";
  let s = String(input).trim().replace(/[\s\-()]/g, "");
  s = s.replace(/^\+?0*20/, "0"); // +20 / 0020 / 20 -> leading 0
  if (s.startsWith("20") && s.length === 12) s = "0" + s.slice(2);
  return s;
}

export function isValidEgyptPhone(input) {
  const s = normalizeEgyptPhone(input);
  return /^01[0125]\d{8}$/.test(s);
}

export function isValidEmail(input) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(input || "").trim());
}

export function passwordIssues(pw) {
  const issues = [];
  if (!pw || pw.length < 8) issues.push("يجب أن تكون كلمة المرور 8 أحرف على الأقل");
  return issues;
}

// Map common Supabase auth errors to friendly Arabic.
export function translateAuthError(message) {
  if (!message) return "حدث خطأ غير متوقع، حاولي مرة أخرى.";
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials"))
    return "البريد الإلكتروني أو كلمة المرور غير صحيحة.";
  if (m.includes("email not confirmed"))
    return "لم يتم تأكيد البريد الإلكتروني بعد. تحققي من بريدك.";
  if (m.includes("user already registered") || m.includes("already registered"))
    return "هذا البريد الإلكتروني مسجّل بالفعل. سجّلي الدخول بدلاً من ذلك.";
  if (m.includes("password should be at least"))
    return "يجب أن تكون كلمة المرور 8 أحرف على الأقل.";
  if (m.includes("unable to validate email") || m.includes("invalid email"))
    return "البريد الإلكتروني غير صالح.";
  if (m.includes("rate limit") || m.includes("too many"))
    return "محاولات كثيرة جدًا. انتظري قليلاً ثم حاولي مرة أخرى.";
  if (m.includes("for security purposes"))
    return "لأسباب أمنية، انتظري قليلاً قبل المحاولة مرة أخرى.";
  return message;
}
