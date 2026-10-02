import { FlaskConical, LockKeyhole, SlidersHorizontal } from "lucide-react";

export function ExperimentSkeleton() {
  return (
    <section id="experiment" className="border-y border-ink/10 bg-[#edf1ea] py-12 tablet:py-16">
      <div className="container">
        <div className="max-w-2xl">
          <span className="eyebrow">
            <FlaskConical aria-hidden="true" className="size-4" />
            02 · 动手实验
          </span>
          <h2 className="section-title mt-5">把猜想放上实验台</h2>
          <p className="body-copy mt-4">
            正式实验将采用“设置条件 → 作出猜想 → 运行实验 → 查看证据”的顺序。
          </p>
        </div>

        <div className="mt-8 grid gap-5 desktop:grid-cols-[minmax(0,1.55fr)_minmax(300px,0.75fr)]">
          <div className="paper-card min-h-[360px] p-5 tablet:p-7">
            <div className="flex items-center justify-between border-b border-ink/10 pb-4">
              <div>
                <p className="text-xs font-bold tracking-[0.18em] text-muted">
                  EXPERIMENT BOARD
                </p>
                <h3 className="mt-1 text-lg font-extrabold">杠杆实验台</h3>
              </div>
              <span className="rounded-full bg-ink/5 px-3 py-1 text-xs font-bold text-muted">
                等待搭建
              </span>
            </div>
            <div className="grid min-h-64 place-items-center">
              <div className="text-center">
                <FlaskConical
                  aria-hidden="true"
                  className="mx-auto size-12 text-science"
                  strokeWidth={1.6}
                />
                <p className="mt-4 text-sm font-bold text-ink">实验装置区域</p>
                <p className="mt-1 text-xs text-muted">将在任务 3 中启用交互</p>
              </div>
            </div>
          </div>

          <aside className="paper-card p-5 tablet:p-7">
            <div className="flex items-center gap-3">
              <SlidersHorizontal
                aria-hidden="true"
                className="size-5 text-action"
              />
              <h3 className="text-lg font-extrabold">控制与证据</h3>
            </div>
            <div className="mt-5 space-y-3" aria-hidden="true">
              {[72, 90, 64].map((width) => (
                <div key={width} className="rounded-lg border border-ink/10 p-4">
                  <div className="h-2 rounded-full bg-ink/10" style={{ width: `${width}%` }} />
                  <div className="mt-3 h-2 rounded-full bg-science/10" />
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-start gap-3 border-t border-dashed border-ink/20 pt-5 text-sm font-semibold text-muted">
              <LockKeyhole aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
              参数、猜想和证据将在任务 3 中实现
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
