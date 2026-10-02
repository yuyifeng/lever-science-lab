import { ArrowDown, MoveHorizontal } from "lucide-react";

export function LeverPreview() {
  return (
    <div
      className="relative min-h-[300px] overflow-hidden rounded-lg border-2 border-ink/20 bg-[#e9f1ec] p-5 tablet:min-h-[360px] tablet:p-8"
      aria-label="杠杆实验装置预览"
    >
      <div className="absolute inset-x-0 bottom-0 h-20 bg-[linear-gradient(90deg,rgba(23,50,77,0.08)_1px,transparent_1px)] bg-[length:24px_24px]" />
      <div className="flex items-center justify-between">
        <span className="eyebrow bg-white/70">实验装置预览</span>
        <span className="flex items-center gap-1 text-xs font-bold text-muted">
          <MoveHorizontal aria-hidden="true" className="size-4" />
          观察两侧
        </span>
      </div>

      <div className="absolute inset-x-5 bottom-20 top-20 tablet:inset-x-10">
        <div className="absolute left-[20%] top-[28%] flex -translate-x-1/2 flex-col items-center text-effort">
          <span className="mb-1 rounded-full bg-white px-3 py-1 text-xs font-bold shadow-card">
            用力
          </span>
          <ArrowDown aria-hidden="true" className="size-7" strokeWidth={3} />
          <span className="mt-1 size-5 rounded bg-effort ring-4 ring-white" />
        </div>

        <div className="absolute right-[16%] top-[28%] flex translate-x-1/2 flex-col items-center text-resistance">
          <span className="mb-1 rounded-full bg-white px-3 py-1 text-xs font-bold shadow-card">
            阻力
          </span>
          <ArrowDown aria-hidden="true" className="size-7" strokeWidth={3} />
          <span className="mt-1 size-5 rounded bg-resistance ring-4 ring-white" />
        </div>

        <div className="absolute left-0 right-0 top-1/2 h-5 -translate-y-1/2 rounded border-2 border-ink bg-[#d9a85d] shadow-[0_7px_0_rgba(23,50,77,0.14)]">
          <div className="flex h-full justify-around px-4">
            {Array.from({ length: 13 }, (_, index) => (
              <span
                key={index}
                className="h-2 w-px bg-ink/45 odd:h-3"
              />
            ))}
          </div>
        </div>

        <div className="absolute left-1/2 top-[calc(50%+10px)] -translate-x-1/2">
          <div className="mx-auto h-0 w-0 border-x-[30px] border-b-[58px] border-x-transparent border-b-science" />
          <span className="mt-2 block rounded-full bg-white px-3 py-1 text-center text-xs font-bold text-science-dark shadow-card">
            支点
          </span>
        </div>
      </div>

      <p className="absolute bottom-5 left-5 right-5 text-center text-xs font-semibold text-muted">
        向下探索五要素，再亲手调节这套实验装置
      </p>
    </div>
  );
}
