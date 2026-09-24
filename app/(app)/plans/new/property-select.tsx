"use client";

import { useState } from "react";

type Option<T extends string> = {
  value: T;
  label: string;
  className: string;
};

export function PropertySelect<T extends string>({
  name,
  defaultValue,
  options,
}: {
  name: string;
  defaultValue: T;
  options: readonly Option<T>[];
}) {
  const [value, setValue] = useState<T>(defaultValue);
  const active = options.find((option) => option.value === value) ?? options[0];

  return (
    <select
      name={name}
      value={value}
      onChange={(event) => setValue(event.target.value as T)}
      className={`cursor-pointer rounded px-2 py-1 text-xs font-medium outline-none ${active.className}`}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
