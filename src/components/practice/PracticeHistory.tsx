import { History, Trash2 } from "lucide-react";

import { knowledgePoints } from "@/data/practiceQuestions";
import { usePracticeStore } from "@/store/usePracticeStore";

export function PracticeHistory() {
  const history = usePracticeStore((state) => state.history);
  const clearHistory = usePracticeStore((state) => state.clearHistory);

  if (history.length === 0) return null;

  return (
    <section className="mt-8 border-t-2 border-ink/10 pt-7" aria-labelledby="practice-history-title">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3
          id="practice-history-title"
          className="flex items-center gap-2 text-xl font-extrabold"
        >
          <History aria-hidden="true" className="size-5 text-science" />
          最近练习
        </h3>
        <button
          type="button"
          onClick={() => {
            if (window.confirm("确定清空全部练习历史吗？当前练习不会被清除。")) {
              clearHistory();
            }
          }}
          className="inline-flex min-h-11 items-center gap-2 rounded-lg border-2 border-effort/25 bg-white px-3 py-2 text-sm font-bold text-effort"
        >
          <Trash2 aria-hidden="true" className="size-4" />
          清空历史
        </button>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[620px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-y-2 border-ink/10 text-xs text-muted">
              <th className="px-3 py-3 font-bold">完成时间</th>
              <th className="px-3 py-3 font-bold">诊断分数</th>
              <th className="px-3 py-3 font-bold">最需巩固</th>
              <th className="px-3 py-3 font-bold">巩固结果</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            {history.map((record) => (
              <tr key={record.id}>
                <td className="px-3 py-3 font-semibold">
                  {formatDate(record.completedAt)}
                </td>
                <td className="px-3 py-3 font-extrabold">
                  {record.diagnosticScore} 分
                </td>
                <td className="px-3 py-3">
                  {knowledgePoints[record.weakestKnowledgePoint].name}
                </td>
                <td className="px-3 py-3">
                  {record.reinforcementCompleted
                    ? `${record.reinforcementScore} 分`
                    : "未完成"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "时间未知";

  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
