"use client";

import { useState } from "react";

export default function ProfileCard({ profile }) {
  const [imageError, setImageError] = useState(false);
  const initials = profile.name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <aside className="flex min-h-[390px] w-full max-w-[360px] flex-col rounded-xl bg-[#3b82f6] px-8 py-9 text-white shadow-sm shadow-blue-200">
      <div className="flex flex-1 flex-col items-center text-center">
        <div className="relative h-28 w-28 overflow-hidden rounded-2xl border-4 border-white bg-gradient-to-br from-blue-200 via-white to-slate-200 shadow-sm">
          {profile.avatar && !imageError ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatar}
              alt={profile.name}
              className="h-full w-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="grid h-full w-full place-items-center text-3xl font-bold text-blue-600">
              {initials}
            </div>
          )}
        </div>

        <h2 className="mt-6 text-2xl font-bold leading-tight">{profile.name}</h2>
        <p className="mt-2 text-sm font-medium text-blue-100">{profile.email}</p>
      </div>

      <div className="mt-8 border-t border-white/30 pt-6">
        <div className="grid grid-cols-2 gap-6 text-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-100">
              Role
            </p>
            <p className="mt-2 text-sm font-bold">{profile.role}</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-100">
              Bergabung
            </p>
            <p className="mt-2 text-sm font-bold">{profile.joinedAt}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
