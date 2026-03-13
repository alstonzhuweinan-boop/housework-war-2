import { useState } from "react";
import { useFamily } from "../contexts/FamilyContext";
import { useAuth } from "../contexts/AuthContext";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import * as Icons from "lucide-react";

export default function History() {
  const { records, chores, deleteRecord } = useFamily();
  const { user } = useAuth();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const getIcon = (choreId: string) => {
    const chore = chores.find((c) => c.id === choreId);
    const iconName = chore?.icon || "CheckCircle";
    const IconComponent = (Icons as any)[iconName] || Icons.CheckCircle;
    return <IconComponent className="h-5 w-5" />;
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteRecord(id);
      setDeletingId(null);
    } catch (error) {
      console.error("Failed to delete record", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-stone-100">
        <div className="flex items-center gap-2">
          <Icons.Clock className="h-6 w-6 text-stone-800" />
          <h2 className="text-xl font-black text-stone-800">家务历史记录</h2>
        </div>
        <p className="mt-1 text-sm font-medium text-stone-500">
          最近完成的100条家务记录
        </p>

        <div className="mt-8 flow-root">
          <ul role="list" className="-mb-8">
            {records.map((record, recordIdx) => (
              <li key={record.id}>
                <div className="relative pb-8">
                  {recordIdx !== records.length - 1 ? (
                    <span
                      className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-stone-100"
                      aria-hidden="true"
                    />
                  ) : null}
                  <div className="relative flex items-start space-x-4">
                    <div className="relative">
                      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-stone-50 ring-8 ring-white shadow-sm">
                        <div className="text-stone-600">
                          {getIcon(record.choreId)}
                        </div>
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 py-1.5 flex justify-between items-center">
                      <div>
                        <div className="text-sm text-stone-500">
                          <span className="font-extrabold text-stone-800">
                            {record.userName}
                          </span>
                          {" 完成了 "}
                          <span className="font-extrabold text-stone-800">
                            {record.choreName}
                          </span>{" "}
                          <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700 ml-1">
                            +{record.points} 分
                          </span>
                        </div>
                        <div className="mt-1 text-xs font-bold text-stone-400">
                          {format(new Date(record.timestamp), "PPpp", {
                            locale: zhCN,
                          })}
                        </div>
                      </div>
                      {user?.uid === record.userId && (
                        <div className="ml-2 flex-shrink-0">
                          {deletingId === record.id ? (
                            <div className="flex items-center space-x-2 bg-stone-50 px-2 py-1 rounded-xl border border-stone-200">
                              <span className="text-xs font-bold text-stone-600">
                                撤销?
                              </span>
                              <button
                                onClick={() => handleDelete(record.id)}
                                className="text-xs font-bold text-white bg-stone-800 px-2 py-1 rounded-lg hover:bg-stone-700 active:scale-95 transition-all"
                              >
                                是
                              </button>
                              <button
                                onClick={() => setDeletingId(null)}
                                className="text-xs font-bold text-stone-500 bg-stone-200 px-2 py-1 rounded-lg hover:bg-stone-300 active:scale-95 transition-all"
                              >
                                否
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeletingId(record.id)}
                              className="p-2 text-stone-300 hover:text-stone-800 hover:bg-stone-100 rounded-xl transition-colors"
                              title="撤销此记录"
                            >
                              <Icons.Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
            {records.length === 0 && (
              <li className="py-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-stone-50 mb-4">
                  <Icons.Ghost className="h-8 w-8 text-stone-300" />
                </div>
                <p className="text-stone-500 font-bold">
                  暂无记录，快去打卡吧！
                </p>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
