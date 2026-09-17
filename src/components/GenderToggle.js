"use client";

import { useGender } from "./GenderProvider";

// 👩/👨 toggle — lets any visitor (guest or logged-in) choose how the
// site addresses them. Saved in a cookie (+ profile for logged-in users).
export default function GenderToggle({ showLabel = true }) {
  const { gender, setGender } = useGender();

  return (
    <div
      className="flex items-center gap-1.5"
      title="طريقة مخاطبة الموقع لك"
    >
      {showLabel && (
        <span className="text-[0.7rem] font-black text-warm-mocha/50 whitespace-nowrap">
          خاطبني:
        </span>
      )}
      <div className="flex items-center rounded-full bg-cream border border-pastel-pink/60 p-1 gap-1">
        <ToggleBtn active={gender === "female"} onClick={() => setGender("female")} label="مؤنث 👩" />
        <ToggleBtn active={gender === "male"} onClick={() => setGender("male")} label="مذكر 👨" />
      </div>
    </div>
  );
}

function ToggleBtn({ active, onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`px-2.5 py-1 rounded-full text-[0.7rem] font-black transition whitespace-nowrap ${
        active
          ? "bg-soft-rose text-white shadow-soft-sm"
          : "text-warm-mocha/60 hover:text-warm-mocha"
      }`}
    >
      {label}
    </button>
  );
}
