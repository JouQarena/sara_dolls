"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function FaqAccordion({ groups }) {
  const [open, setOpen] = useState(`0-0`);

  return (
    <div className="space-y-10">
      {groups.map((group, gi) => (
        <div key={gi}>
          <h2 className="flex items-center gap-2 text-xl font-black text-warm-mocha mb-4">
            <span>{group.emoji}</span>
            {group.title}
          </h2>
          <div className="space-y-3">
            {group.items.map((item, ii) => {
              const id = `${gi}-${ii}`;
              const isOpen = open === id;
              return (
                <div
                  key={id}
                  className="bg-white rounded-3xl border border-pastel-pink/40 shadow-soft-sm overflow-hidden"
                >
                  <button
                    onClick={() => setOpen(isOpen ? null : id)}
                    className="w-full flex items-center justify-between gap-4 px-5 py-4 text-right"
                  >
                    <span className="font-black text-warm-mocha">
                      {item.q}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-soft-rose shrink-0 transition ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-warm-mocha/75 font-semibold leading-loose animate-fade-in">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
