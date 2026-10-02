import { ImageOff } from "lucide-react";
import { useState } from "react";

import type { LeverExample } from "@/data/leverTypes";

interface LeverTypeExamplesProps {
  examples: LeverExample[];
}

function EqualArmIllustration({
  type,
  alt,
}: {
  type: NonNullable<LeverExample["illustration"]>;
  alt: string;
}) {
  return (
    <svg
      viewBox="0 0 640 480"
      role="img"
      aria-label={alt}
      className="aspect-[4/3] w-full bg-[#e8f1ed]"
    >
      {type === "balance" ? (
        <>
          <rect width="640" height="480" fill="#e8f1ed" />
          <circle cx="94" cy="86" r="38" fill="#ee8a3a" opacity="0.18" />
          <path d="M220 416H420L390 378H250Z" fill="#17324d" />
          <rect x="305" y="142" width="30" height="250" rx="8" fill="#1f7196" />
          <circle cx="320" cy="164" r="30" fill="#fffdf7" stroke="#17324d" strokeWidth="10" />
          <path d="M112 164H528" stroke="#17324d" strokeWidth="18" strokeLinecap="round" />
          <path d="M120 164V280M520 164V280" stroke="#607184" strokeWidth="7" />
          <path d="M70 280H170L150 326H90Z" fill="#d9a85d" stroke="#17324d" strokeWidth="8" strokeLinejoin="round" />
          <path d="M470 280H570L550 326H490Z" fill="#d9a85d" stroke="#17324d" strokeWidth="8" strokeLinejoin="round" />
          <circle cx="320" cy="164" r="10" fill="#ee8a3a" />
          <path d="M112 350H528" stroke="#287a68" strokeWidth="5" strokeDasharray="10 12" opacity="0.6" />
        </>
      ) : (
        <>
          <rect width="640" height="480" fill="#dcecf1" />
          <circle cx="92" cy="82" r="40" fill="#ee8a3a" opacity="0.75" />
          <path d="M0 350Q110 315 220 350T440 350T660 350V480H0Z" fill="#9bc9ad" />
          <path d="M110 238H530" stroke="#d9a85d" strokeWidth="34" strokeLinecap="round" />
          <path d="M286 378L320 236L354 378Z" fill="#1f7196" stroke="#17324d" strokeWidth="8" strokeLinejoin="round" />
          <circle cx="320" cy="238" r="16" fill="#ee8a3a" stroke="#17324d" strokeWidth="7" />
          <path d="M104 222V276H164V238M536 222V276H476V238" fill="none" stroke="#17324d" strokeWidth="12" strokeLinejoin="round" strokeLinecap="round" />
          <path d="M102 396H538" stroke="#287a68" strokeWidth="5" strokeDasharray="10 12" opacity="0.6" />
        </>
      )}
    </svg>
  );
}

function ExampleImage({ example }: { example: LeverExample }) {
  const [failed, setFailed] = useState(false);
  const [refreshAttempt, setRefreshAttempt] = useState(0);

  if (example.illustration) {
    return (
      <EqualArmIllustration
        type={example.illustration}
        alt={example.imageAlt}
      />
    );
  }

  if (failed) {
    return (
      <div className="grid aspect-[4/3] place-items-center bg-ink/5 text-muted">
        <div className="text-center">
          <ImageOff aria-hidden="true" className="mx-auto size-7" />
          <p className="mt-2 text-xs font-bold">图片暂时无法加载</p>
        </div>
      </div>
    );
  }

  const src =
    refreshAttempt === 0
      ? example.imageUrl
      : `${example.imageUrl}&refresh=${refreshAttempt}`;

  return (
    <img
      src={src}
      alt={example.imageAlt}
      className="aspect-[4/3] w-full object-cover"
      loading="lazy"
      onError={() => {
        if (refreshAttempt < 2) {
          setRefreshAttempt((current) => current + 1);
          return;
        }
        setFailed(true);
      }}
    />
  );
}

export function LeverTypeExamples({ examples }: LeverTypeExamplesProps) {
  return (
    <div className="grid gap-4 tablet:grid-cols-2">
      {examples.map((example) => (
        <article
          key={example.name}
          className="overflow-hidden rounded-lg border-2 border-ink/10 bg-white"
        >
          <ExampleImage example={example} />
          <div className="p-4">
            <h4 className="text-base font-extrabold text-ink">
              {example.name}
            </h4>
            <p className="mt-2 text-sm leading-6 text-muted">
              {example.description}
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}
