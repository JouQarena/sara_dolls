"use client";

import { useEffect, useState } from "react";

const DEFAULTS = {
  flat_shipping_fee: 50,
  free_shipping_threshold: 1000,
  instapay_number: "",
};

export function useSettings() {
  const [settings, setSettings] = useState(DEFAULTS);

  useEffect(() => {
    let active = true;
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => {
        if (active && d) setSettings({ ...DEFAULTS, ...d });
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  return settings;
}

export function computeShippingClient(subtotal, settings) {
  const threshold = Number(settings?.free_shipping_threshold ?? 0);
  if (threshold > 0 && subtotal >= threshold) return 0;
  return Number(settings?.flat_shipping_fee ?? 50);
}
