import { useState } from "react";
import { useFamily } from "../contexts/FamilyContext";
import * as Icons from "lucide-react";
import { cn } from "../lib/utils";
import { Chore } from "../types";

export default function ManageChores() {
  const { chores, addChore, editChore, deleteChore } = useFamily();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    points: 5,
    icon: "CheckCircle",
  });

  const availableIcons = [
    "CheckCircle",
    "Trash2",
    "Utensils",
    "Droplets",
    "Shirt",
    "Cat",
    "ChefHat",
    "ShoppingBag",
    "Book",
    "Car",
    "Coffee",
    "Heart",
    "Home",
    "Star",
    "Sparkles",
    "Gift",
    "Smile",
  ];

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleEdit = (chore: Chore) => {
    setEditingId(chore.id);
    setFormData({
      name: chore.name,
      points: chore.points,
      icon: chore.icon,
    });
    setIsAdding(false);
  };

  const handleAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    setFormData({
      name: "",
      points: 5,
      icon: "CheckCircle",
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsAdding(false);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) return;

    let finalPoints = Number(formData.points) || 0;
    if (finalPoints < 0) finalPoints = 0;
    if (finalPoints > 1000) finalPoints = 1000;

    try {
      if (isAdding) {
        await addChore({
          name: formData.name.trim(),
          points: finalPoints,
          icon: formData.icon,
        });
        alert("添加成功！");
      } else if (editingId) {
        await editChore(editingId, {
          name: formData.name.trim(),
          points: finalPoints,
          icon: formData.icon,
        });
        alert("修改成功！");
      }
      handleCancel();
    } catch (error) {
      console.error("Failed to save chore", error);
      alert("保存失败: " + (error as Error).message);
    }
  };

  const confirmDelete = async (id: string) => {
    try {
      await deleteChore(id);
      setDeletingId(null);
    } catch (error) {
      console.error("Failed to delete chore", error);
    }
  };

  const getIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName] || Icons.CheckCircle;
    return <IconComponent className="h-6 w-6" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white p-4 rounded-[2rem] shadow-sm border border-stone-100">
        <div className="flex items-center gap-2 px-2">
          <Icons.Settings className="h-6 w-6 text-stone-800" />
          <h2 className="text-xl font-black text-stone-800">管理打卡项目</h2>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center space-x-2 rounded-2xl bg-stone-800 px-5 py-2.5 text-sm font-bold text-white hover:bg-stone-700 shadow-md hover:shadow-lg transition-all active:scale-95"
        >
          <Icons.Plus size={18} />
          <span>新增项目</span>
        </button>
      </div>

      {(isAdding || editingId) && (
        <div className="rounded-[2rem] border-4 border-stone-100 bg-white p-6 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-stone-50 rounded-full -mr-16 -mt-16 opacity-50"></div>

          <h3 className="mb-6 text-xl font-black text-stone-800 flex items-center gap-2">
            {isAdding ? (
              <>
                <Icons.Sparkles className="text-stone-800" /> 新增打卡项目
              </>
            ) : (
              <>
                <Icons.Edit3 className="text-stone-800" /> 编辑打卡项目
              </>
            )}
          </h3>

          <div className="space-y-5 relative z-10">
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-1.5">
                项目名称
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="block w-full rounded-xl border-2 border-stone-200 shadow-sm focus:border-stone-800 focus:ring-stone-800 sm:text-sm p-3 transition-colors font-medium text-stone-800"
                placeholder="例如：洗碗 🍽️"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-stone-700 mb-1.5">
                分值
              </label>
              <input
                type="number"
                value={formData.points}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    points: parseInt(e.target.value) || 0,
                  })
                }
                className="block w-full rounded-xl border-2 border-stone-200 shadow-sm focus:border-stone-800 focus:ring-stone-800 sm:text-sm p-3 transition-colors font-bold text-stone-800"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">
                选择一个可爱的图标
              </label>
              <div className="grid grid-cols-5 sm:grid-cols-7 gap-3">
                {availableIcons.map((iconName) => (
                  <button
                    key={iconName}
                    onClick={() => setFormData({ ...formData, icon: iconName })}
                    className={cn(
                      "flex items-center justify-center p-3 rounded-2xl border-2 transition-all duration-200",
                      formData.icon === iconName
                        ? "border-stone-800 bg-stone-100 text-stone-800 scale-110 shadow-sm"
                        : "border-stone-100 text-stone-400 hover:bg-stone-50 hover:text-stone-600 hover:scale-105",
                    )}
                  >
                    {getIcon(iconName)}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6 mt-6 border-t border-stone-100">
              <button
                onClick={handleCancel}
                className="rounded-xl border-2 border-stone-200 bg-white px-6 py-2.5 text-sm font-bold text-stone-600 hover:bg-stone-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSave}
                disabled={!formData.name.trim()}
                className="rounded-xl bg-stone-800 px-6 py-2.5 text-sm font-bold text-white hover:bg-stone-700 shadow-md disabled:opacity-50 disabled:bg-stone-300 transition-all active:scale-95"
              >
                保存 ✨
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {chores.map((chore) => (
          <div
            key={chore.id}
            className="flex items-center justify-between rounded-[2rem] border-4 border-transparent bg-white p-5 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group"
          >
            <div className="flex items-center space-x-4">
              <div className="rounded-2xl bg-stone-50 p-3.5 text-stone-600 group-hover:scale-110 transition-transform duration-300">
                {getIcon(chore.icon)}
              </div>
              <div>
                <h3 className="font-extrabold text-stone-800 text-lg">
                  {chore.name}
                </h3>
                <p className="text-sm font-bold text-stone-400 mt-0.5">
                  {chore.points} 分
                </p>
              </div>
            </div>
            <div className="flex space-x-1">
              {deletingId === chore.id ? (
                <div className="flex flex-col items-end space-y-2">
                  <span className="text-xs font-bold text-stone-600 bg-stone-50 px-2 py-1 rounded-lg border border-stone-200">
                    确定删除?
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => confirmDelete(chore.id)}
                      className="rounded-xl bg-stone-800 px-3 py-1.5 text-xs font-bold text-white hover:bg-stone-700 shadow-sm active:scale-95 transition-all"
                    >
                      是
                    </button>
                    <button
                      onClick={() => setDeletingId(null)}
                      className="rounded-xl bg-stone-200 px-3 py-1.5 text-xs font-bold text-stone-600 hover:bg-stone-300 shadow-sm active:scale-95 transition-all"
                    >
                      否
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => handleEdit(chore)}
                    className="rounded-xl p-2.5 text-stone-400 hover:bg-stone-100 hover:text-stone-800 transition-colors"
                  >
                    <Icons.Edit2 size={20} />
                  </button>
                  <button
                    onClick={() => setDeletingId(chore.id)}
                    className="rounded-xl p-2.5 text-stone-400 hover:bg-stone-100 hover:text-stone-800 transition-colors"
                  >
                    <Icons.Trash2 size={20} />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
