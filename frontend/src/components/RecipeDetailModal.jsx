import React from "react";

export default function RecipeDetailModal({ recipe, onClose, isDark }) {
  if (!recipe) return null;

  const prepTime = recipe.prep_time || recipe.prepTime;
  const cookTime = recipe.cook_time || recipe.cookTime;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div
        className={`w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border transition-all ${
          isDark
            ? "bg-slate-900 border-rose-900/40 text-slate-100"
            : "bg-white border-sky-100 text-slate-800"
        }`}
      >

        <div
          className={`px-5 py-3.5 flex items-center justify-between border-b ${
            isDark
              ? "border-rose-900/30 bg-slate-800/60"
              : "border-sky-100 bg-sky-50/80"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-xl">👨‍🍳</span>
            <h3 className="font-bold text-base truncate">{recipe.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-all text-sm"
          >
            ✕
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto text-xs sm:text-sm">
          
          <div className="flex flex-wrap items-center gap-2 font-semibold">
            {recipe.calories && (
              <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-300 border border-amber-500/20">
                🔥 {recipe.calories} kcal
              </span>
            )}

            {prepTime && (
              <span className="px-2.5 py-1 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-300 border border-sky-500/20">
                ⏱️ Hazırlık: {prepTime} dk
              </span>
            )}

            {cookTime && (
              <span className="px-2.5 py-1 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-300 border border-orange-500/20">
                🍳 Pişirme: {cookTime} dk
              </span>
            )}

            {recipe.is_gluten_free && (
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                🌾 Glutensiz
              </span>
            )}
            {recipe.is_vegan && (
              <span className="px-2.5 py-1 rounded-lg bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20">
                🌱 Vegan
              </span>
            )}
            {recipe.cuisine === "world" && (
              <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border border-indigo-500/20">
                🌍 Dünya Mutfağı
              </span>
            )}
          </div>

          <div>
            <h4 className="text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-2">
              🛒 Malzemeler
            </h4>
            {recipe.ingredients && recipe.ingredients.length > 0 ? (
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {recipe.ingredients.map((ing, idx) => (
                  <li
                    key={ing.id || idx}
                    className={`p-2 rounded-lg flex items-center justify-between border ${
                      isDark
                        ? "bg-slate-800/50 border-slate-700/50 text-slate-200"
                        : "bg-slate-50 border-slate-100 text-slate-700"
                    }`}
                  >
                    <span className="font-medium">{ing.name}</span>
                    <span className="font-bold opacity-75 text-xs">
                      {ing.amount} {ing.unit}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-400 italic">
                Malzeme bilgisi eklenmemiş.
              </p>
            )}
          </div>

          <div>
            <h4 className="text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-1.5">
              📝 Tarif / Hazırlanışı
            </h4>
            <div
              className={`p-3 rounded-xl border leading-relaxed whitespace-pre-line text-xs ${
                isDark
                  ? "bg-slate-800/30 border-slate-800 text-slate-300"
                  : "bg-slate-50 border-slate-100 text-slate-600"
              }`}
            >
              {recipe.instructions ||
                "Bu tarif için henüz detaylı hazırlanış adımı girilmemiş."}
            </div>
          </div>
        </div>

        <div
          className={`px-5 py-3 border-t text-right ${
            isDark
              ? "border-rose-900/30 bg-slate-900"
              : "border-sky-100 bg-slate-50"
          }`}
        >
          <button
            onClick={onClose}
            className={`px-4 py-1.5 text-xs font-semibold rounded-xl transition-all border ${
              isDark
                ? "bg-slate-800 hover:bg-slate-700 text-rose-300 border-rose-900/40"
                : "bg-white hover:bg-slate-100 text-sky-900 border-sky-200 shadow-sm"
            }`}
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
}