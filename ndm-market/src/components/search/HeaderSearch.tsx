"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import type { Locale } from "@/lib/i18n";

interface HeaderSearchProps {
  locale: Locale;
  placeholder: string;
}

export default function HeaderSearch({ locale, placeholder }: HeaderSearchProps) {
  const router = useRouter();
  const [value, setValue] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmed = value.trim();
    const searchParams = new URLSearchParams();

    if (trimmed.length) {
      searchParams.set("q", trimmed);
    }

    router.push(`/${locale}/catalog${searchParams.toString() ? `?${searchParams.toString()}` : ""}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="hidden w-full max-w-sm items-center rounded-full bg-subtle/60 px-4 py-2 transition-shadow focus-within:bg-subtle focus-within:shadow-md lg:flex"
    >
      <span className="me-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-4 w-4"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
      </span>
      <input
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        className="w-full border-none bg-transparent text-sm font-medium text-ink outline-none placeholder:text-muted"
        aria-label={placeholder}
      />
    </form>
  );
}
