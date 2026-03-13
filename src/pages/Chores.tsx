import { useState } from "react";
import { useFamily } from "../contexts/FamilyContext";
import { useAuth } from "../contexts/AuthContext";
import * as Icons from "lucide-react";
import { cn } from "../lib/utils";
import { Chore } from "../types";

export default function Chores() {
  const { chores, recordChore, family } = useFamily();
  const { user } = useAuth();
  const [recordingId, setRecordingId] = useState<string | null>(null);

  const handleRecord = async (chore: Chore) => {
    setRecordingId(chore.id);
    try {
      await recordChore(chore);
      // Optional: show a success toast
    } catch (error) {
      console.error("Failed to record chore", error);
    } finally {
      setTimeout(() => setRecordingId(null), 500); // Keep loading state briefly for feedback
    }
  };

  const getIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName] || Icons.CheckCircle;
    return <IconComponent className="h-8 w-8" />;
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-stone-800 to-stone-700 p-8 text-white shadow-lg">
        <div className="absolute -right-4 -top-4 opacity-10">
          <Icons.Sparkles className="h-32 w-32" />
        </div>
        <div className="relative z-10">
          <h2 className="text-2xl font-black tracking-tight">
            {family?.name || "我们的家"}
          </h2>
          <p className="mt-2 text-stone-300 font-medium">
            家庭 ID:{" "}
            <span className="font-mono bg-white/10 px-2 py-1 rounded-lg text-sm text-stone-200">
              {family?.id}
            </span>
          </p>
          <p className="mt-6 text-sm text-stone-800 font-bold bg-white/90 inline-block px-4 py-2 rounded-full shadow-sm">
            ✨ 点击下方的家务图标，记录你刚刚完成的家务！
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {chores.map((chore) => (
          <button
            key={chore.id}
            onClick={() => handleRecord(chore)}
            disabled={recordingId === chore.id}
            className={cn(
              "group relative flex flex-col items-center justify-center space-y-3 rounded-3xl border-4 border-transparent bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-stone-200 hover:shadow-xl hover:shadow-stone-200/50 active:scale-95",
              recordingId === chore.id && "opacity-70 scale-95",
            )}
          >
            <div
              className={cn(
                "rounded-2xl p-4 transition-all duration-300",
                recordingId === chore.id
                  ? "bg-emerald-100 text-emerald-600 scale-110 rotate-12"
                  : "bg-stone-100 text-stone-500 group-hover:bg-stone-200 group-hover:text-stone-800 group-hover:scale-110 group-hover:-rotate-6",
              )}
            >
              {recordingId === chore.id ? (
                <Icons.Check className="h-8 w-8" />
              ) : (
                getIcon(chore.icon)
              )}
            </div>
            <div className="text-center">
              <h3 className="font-extrabold text-stone-800">{chore.name}</h3>
              <p className="mt-1 inline-block rounded-full bg-stone-100 px-2 py-0.5 text-xs font-bold text-stone-500">
                +{chore.points} 分
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
