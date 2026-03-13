import { useMemo } from "react";
import { useFamily } from "../contexts/FamilyContext";
import { useAuth } from "../contexts/AuthContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format, subDays, isAfter, startOfWeek, startOfMonth } from "date-fns";
import { Trophy, Star, Target, Crown } from "lucide-react";

export default function Dashboard() {
  const { records } = useFamily();
  const { user } = useAuth();

  const stats = useMemo(() => {
    const now = new Date();
    const startOfThisWeek = startOfWeek(now, { weekStartsOn: 1 });
    const startOfThisMonth = startOfMonth(now);

    const userStats: Record<
      string,
      {
        name: string;
        weekPoints: number;
        monthPoints: number;
        totalPoints: number;
      }
    > = {};

    records.forEach((record) => {
      if (!userStats[record.userName]) {
        userStats[record.userName] = {
          name: record.userName,
          weekPoints: 0,
          monthPoints: 0,
          totalPoints: 0,
        };
      }

      const recordDate = new Date(record.timestamp);

      userStats[record.userName].totalPoints += record.points;

      if (isAfter(recordDate, startOfThisWeek)) {
        userStats[record.userName].weekPoints += record.points;
      }

      if (isAfter(recordDate, startOfThisMonth)) {
        userStats[record.userName].monthPoints += record.points;
      }
    });

    return Object.values(userStats).sort((a, b) => b.weekPoints - a.weekPoints);
  }, [records]);

  const chartData = useMemo(() => {
    // Last 7 days data
    const data = [];
    const now = new Date();
    const userNames: string[] = Array.from(
      new Set(records.map((r) => r.userName)),
    );

    for (let i = 6; i >= 0; i--) {
      const date = subDays(now, i);
      const dateStr = format(date, "MM/dd");
      const dayData: any = { name: dateStr };

      userNames.forEach((name) => {
        dayData[name] = 0;
      });

      records.forEach((record) => {
        const recordDate = new Date(record.timestamp);
        if (format(recordDate, "MM/dd") === dateStr) {
          dayData[record.userName] += record.points;
        }
      });

      data.push(dayData);
    }
    return { data, userNames };
  }, [records]);

  const matchStats = useMemo(() => {
    const periods = {
      daily: {} as Record<string, Record<string, number>>,
      weekly: {} as Record<string, Record<string, number>>,
      monthly: {} as Record<string, Record<string, number>>,
      yearly: {} as Record<string, Record<string, number>>,
      total: { all: {} } as Record<string, Record<string, number>>,
    };

    const allUsers = Array.from(
      new Set(["dd", "qq", ...records.map((r) => r.userName)]),
    );

    records.forEach((record) => {
      const d = new Date(record.timestamp);
      const dayKey = format(d, "yyyy-MM-dd");
      const weekKey = format(startOfWeek(d, { weekStartsOn: 1 }), "yyyy-MM-dd");
      const monthKey = format(d, "yyyy-MM");
      const yearKey = format(d, "yyyy");

      const addPoint = (
        period: Record<string, Record<string, number>>,
        key: string,
      ) => {
        if (!period[key]) period[key] = {};
        if (!period[key][record.userName]) period[key][record.userName] = 0;
        period[key][record.userName] += record.points;
      };

      addPoint(periods.daily, dayKey);
      addPoint(periods.weekly, weekKey);
      addPoint(periods.monthly, monthKey);
      addPoint(periods.yearly, yearKey);
      addPoint(periods.total, "all");
    });

    const userWinStats: Record<string, any> = {};
    allUsers.forEach((u) => {
      userWinStats[u] = {
        daily: 0,
        weekly: 0,
        monthly: 0,
        yearly: 0,
        total: 0,
      };
    });

    const totals = { daily: 0, weekly: 0, monthly: 0, yearly: 0, total: 0 };

    Object.keys(periods).forEach((periodKey) => {
      const periodObj = periods[periodKey as keyof typeof periods];
      const keys = Object.keys(periodObj);
      totals[periodKey as keyof typeof totals] = keys.length;

      keys.forEach((k) => {
        const scores = periodObj[k];
        let maxScore = -1;
        let winners: string[] = [];
        Object.entries(scores).forEach(([u, score]) => {
          if (score > maxScore) {
            maxScore = score;
            winners = [u];
          } else if (score === maxScore) {
            winners.push(u);
          }
        });

        if (winners.length === 1) {
          winners.forEach((w) => {
            if (userWinStats[w]) {
              userWinStats[w][periodKey]++;
            }
          });
        }
      });
    });

    return { allUsers, userWinStats, totals };
  }, [records]);

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-stone-100">
        <div className="flex items-center gap-2">
          <Trophy className="h-6 w-6 text-amber-500" />
          <h2 className="text-xl font-black text-stone-800">家务排行榜</h2>
        </div>
        <p className="mt-1 text-sm font-medium text-stone-500">
          看看谁是本周的家务小能手！
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {stats.map((stat, index) => (
            <div
              key={stat.name}
              className={`flex flex-col justify-between rounded-3xl border-4 p-5 transition-transform hover:-translate-y-1 ${stat.name === user?.displayName ? "border-stone-800 bg-stone-50" : "border-stone-50 bg-white"}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="text-2xl">
                    {stat.name === "dd"
                      ? "👦🏻"
                      : stat.name === "qq"
                        ? "👧🏻"
                        : "🧑🏻"}
                  </div>
                  <h3 className="font-extrabold text-stone-800 text-lg">
                    {stat.name}{" "}
                    {stat.name === user?.displayName && (
                      <span className="text-sm font-bold text-stone-500">
                        (我)
                      </span>
                    )}
                  </h3>
                </div>
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${index === 0 ? "bg-amber-100 text-amber-700" : "bg-stone-100 text-stone-600"}`}
                >
                  {index === 0 ? "👑 领先" : "💪 加油"}
                </span>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                <div className="rounded-2xl bg-white p-3 shadow-sm border border-stone-100">
                  <Star className="h-4 w-4 text-stone-800 mx-auto mb-1" />
                  <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                    本周
                  </p>
                  <p className="text-xl font-black text-stone-800">
                    {stat.weekPoints}
                  </p>
                </div>
                <div className="rounded-2xl bg-white p-3 shadow-sm border border-stone-100">
                  <Target className="h-4 w-4 text-stone-500 mx-auto mb-1" />
                  <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                    本月
                  </p>
                  <p className="text-xl font-black text-stone-600">
                    {stat.monthPoints}
                  </p>
                </div>
                <div className="rounded-2xl bg-white p-3 shadow-sm border border-stone-100">
                  <Trophy className="h-4 w-4 text-stone-400 mx-auto mb-1" />
                  <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                    总计
                  </p>
                  <p className="text-xl font-black text-stone-500">
                    {stat.totalPoints}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[2rem] bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-stone-100">
        <h2 className="text-xl font-black text-stone-800">📈 近7天趋势</h2>
        <div className="mt-6 h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData.data}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f5f5f4"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#a8a29e", fontSize: 12, fontWeight: 600 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#a8a29e", fontSize: 12, fontWeight: 600 }}
                dx={-10}
              />
              <Tooltip
                cursor={{ fill: "#fafaf9" }}
                contentStyle={{
                  borderRadius: "16px",
                  border: "none",
                  boxShadow: "0 10px 25px -5px rgb(0 0 0 / 0.1)",
                  fontWeight: "bold",
                  color: "#44403c",
                }}
              />
              <Legend
                wrapperStyle={{
                  paddingTop: "20px",
                  fontWeight: "bold",
                  fontSize: "12px",
                }}
              />
              {chartData.userNames.map((name, index) => {
                const colors = [
                  "#292524",
                  "#d97757",
                  "#57534e",
                  "#a8a29e",
                  "#78716c",
                ];
                return (
                  <Bar
                    key={name}
                    dataKey={name}
                    fill={colors[index % colors.length]}
                    radius={[8, 8, 0, 0]}
                    maxBarSize={40}
                  />
                );
              })}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-[2rem] bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-stone-100">
        <div className="flex items-center gap-2">
          <Crown className="h-6 w-6 text-stone-800" />
          <h2 className="text-xl font-black text-stone-800">比赛总览</h2>
        </div>
        <p className="mt-1 text-sm font-medium text-stone-500">
          各个维度的获胜次数统计 (获胜/总计)
        </p>

        <div className="mt-6 overflow-hidden rounded-3xl border-2 border-stone-50">
          <table className="w-full text-center text-sm">
            <thead className="bg-stone-50/50 text-stone-500 font-bold">
              <tr>
                <th className="py-4 px-4 text-left">成员</th>
                <th className="py-4 px-2">日</th>
                <th className="py-4 px-2">周</th>
                <th className="py-4 px-2">月</th>
                <th className="py-4 px-2">年</th>
                <th className="py-4 px-2">总</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-stone-50">
              {matchStats.allUsers.map((userName) => (
                <tr
                  key={userName}
                  className="bg-white hover:bg-stone-50 transition-colors"
                >
                  <td className="py-4 px-4 text-left">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">
                        {userName === "dd"
                          ? "👦🏻"
                          : userName === "qq"
                            ? "👧🏻"
                            : "🧑🏻"}
                      </span>
                      <span className="font-extrabold text-stone-800">
                        {userName}
                      </span>
                      {userName === user?.displayName && (
                        <span className="text-stone-500 text-xs font-bold">
                          (我)
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-2 font-black text-stone-600">
                    <span className="text-stone-800">
                      {matchStats.userWinStats[userName].daily}
                    </span>
                    <span className="text-stone-300 mx-0.5">/</span>
                    <span className="text-stone-400">
                      {matchStats.totals.daily}
                    </span>
                  </td>
                  <td className="py-4 px-2 font-black text-stone-600">
                    <span className="text-stone-800">
                      {matchStats.userWinStats[userName].weekly}
                    </span>
                    <span className="text-stone-300 mx-0.5">/</span>
                    <span className="text-stone-400">
                      {matchStats.totals.weekly}
                    </span>
                  </td>
                  <td className="py-4 px-2 font-black text-stone-600">
                    <span className="text-stone-800">
                      {matchStats.userWinStats[userName].monthly}
                    </span>
                    <span className="text-stone-300 mx-0.5">/</span>
                    <span className="text-stone-400">
                      {matchStats.totals.monthly}
                    </span>
                  </td>
                  <td className="py-4 px-2 font-black text-stone-600">
                    <span className="text-stone-800">
                      {matchStats.userWinStats[userName].yearly}
                    </span>
                    <span className="text-stone-300 mx-0.5">/</span>
                    <span className="text-stone-400">
                      {matchStats.totals.yearly}
                    </span>
                  </td>
                  <td className="py-4 px-2 font-black text-stone-600">
                    <span className="text-stone-800">
                      {matchStats.userWinStats[userName].total}
                    </span>
                    <span className="text-stone-300 mx-0.5">/</span>
                    <span className="text-stone-400">
                      {matchStats.totals.total}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
