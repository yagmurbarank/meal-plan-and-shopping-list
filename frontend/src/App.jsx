import { useState, useEffect, useMemo, useCallback } from "react";
import { fetchRecipes } from "./services/recipeService";
import Logo from "./components/Logo"; // Eger Logo.jsx ise
import {
  isRecipeGlutenFree,
  isRecipeVegan,
  generateShoppingList,
  buildCopyText,
} from "./utils/recipeUtils";

export default function App() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDay, setCurrentDay] = useState(1);
  const [selectedRecipes, setSelectedRecipes] = useState([]);
  const [isFinished, setIsFinished] = useState(false);
  const [theme, setTheme] = useState("light");

  const [onlyGlutenFree, setOnlyGlutenFree] = useState(false);
  const [onlyVegan, setOnlyVegan] = useState(false);
  const [onlyWorldCuisine, setOnlyWorldCuisine] = useState(false); // 🌍 Dünya Mutfağı filtresi

  const [servings, setServings] = useState(2);
  const [tempDaySelection, setTempDaySelection] = useState({
    main: null,
    side: null,
    extra: null,
  });

  const [searchMain, setSearchMain] = useState("");
  const [searchSide, setSearchSide] = useState("");
  const [searchExtra, setSearchExtra] = useState("");

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchRecipes().then((data) => {
      setRecipes(data);
      setLoading(false);
    });
  }, []);

  const usedRecipeIds = useMemo(() => {
    return selectedRecipes
      .flatMap((day) => [day.main?.id, day.side?.id, day.extra?.id])
      .filter(Boolean);
  }, [selectedRecipes]);

  const availableRecipes = useMemo(() => {
    return recipes.filter((r) => !usedRecipeIds.includes(r.id));
  }, [recipes, usedRecipeIds]);

  const filterCategory = useCallback(
    (category, searchTerm) => {
      return availableRecipes
        .filter((r) => r.category === category)
        .filter((r) =>
          (r.title || "").toLowerCase().includes(searchTerm.toLowerCase()),
        )
        .filter((r) => !onlyGlutenFree || isRecipeGlutenFree(r))
        .filter((r) => !onlyVegan || isRecipeVegan(r))
        .filter((r) => !onlyWorldCuisine || r.cuisine === "world");
    },
    [availableRecipes, onlyGlutenFree, onlyVegan, onlyWorldCuisine],
  );

  const handleSelectRecipe = useCallback((category, recipe) => {
    setTempDaySelection((prev) => ({
      ...prev,
      [category]: prev[category]?.id === recipe.id ? null : recipe,
    }));
  }, []);

  const handleNextDay = () => {
    if (!tempDaySelection.main) {
      alert("Lütfen en az bir Ana Yemek seçin!");
      return;
    }

    setSelectedRecipes((prev) => [
      ...prev,
      { day: currentDay, servings, ...tempDaySelection },
    ]);

    setTempDaySelection({ main: null, side: null, extra: null });
    setServings(2);
    setSearchMain("");
    setSearchSide("");
    setSearchExtra("");
    setCurrentDay((prev) => prev + 1);
  };

  const handleFinishPlanning = () => {
    if (tempDaySelection.main) {
      setSelectedRecipes((prev) => [
        ...prev,
        { day: currentDay, servings, ...tempDaySelection },
      ]);
    } else if (selectedRecipes.length === 0) {
      alert("Lütfen en az 1 günlük menü seçin!");
      return;
    }

    setIsFinished(true);
  };

  const handleCopyList = () => {
    const text = buildCopyText(selectedRecipes);
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const toggleTheme = () =>
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  const isDark = theme === "dark";

  const shoppingList = useMemo(
    () => generateShoppingList(selectedRecipes),
    [selectedRecipes],
  );

  const calculateDayCalories = (dayItem) => {
    let total = 0;
    ["main", "side", "extra"].forEach((cat) => {
      if (dayItem[cat] && dayItem[cat].calories) {
        total += Number(dayItem[cat].calories);
      }
    });
    return total;
  };

  if (loading) {
    return (
      <div
        className={`h-screen flex items-center justify-center font-sans ${isDark ? "bg-slate-950 text-rose-300" : "bg-sky-50 text-sky-800"}`}
      >
        <p className="animate-pulse text-lg font-bold">
          Menüler Yükleniyor... 🍲
        </p>
      </div>
    );
  }

  return (
    <div
      className={`h-screen print:h-auto font-sans flex flex-col overflow-hidden print:overflow-visible relative transition-colors duration-300 ${
        isDark
          ? "bg-gradient-to-br from-slate-950 via-slate-900 to-rose-950 text-rose-50"
          : "bg-gradient-to-br from-sky-100 via-sky-50 to-emerald-50 text-slate-800"
      }`}
    >
      <div
        className={`absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none print:hidden transition-opacity duration-300 ${
          isDark ? "opacity-10 blur-[2px]" : "opacity-20 blur-[1px]"
        }`}
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1920&q=80')`,
        }}
      />

      <div
        className={`max-w-6xl w-full mx-auto rounded-2xl p-4 border flex flex-col h-full print:h-auto overflow-hidden print:overflow-visible relative z-10 transition-all duration-300 ${
          isDark
            ? "bg-slate-950/80 backdrop-blur-md border-rose-900/40 shadow-2xl print:bg-white print:border-none"
            : "bg-sky-50/90 backdrop-blur-md border-sky-200 shadow-2xl shadow-sky-200/50 print:bg-white print:border-none"
        }`}
      >
        <header
          className={`border-b pb-3 mb-3 text-center flex-shrink-0 flex justify-between items-center px-2 ${
            isDark ? "border-rose-900/40" : "border-sky-200"
          }`}
        >
          <div className="text-left flex items-center gap-2.5">
            <Logo className="w-9 h-9 sm:w-10 sm:h-10" isDark={isDark} />

            <div>
              <h1
                className={`text-lg font-bold flex items-center gap-2 ${isDark ? "text-rose-300" : "text-sky-900"}`}
              >
                Menü & Alışveriş Planlayıcı
              </h1>
              <p
                className={`text-xs mt-0.5 ${isDark ? "text-slate-400" : "text-slate-600"}`}
              >
                {!isFinished
                  ? `${currentDay}. Gün Menüsünü Oluşturuyorsun`
                  : `🎉 ${selectedRecipes.length} Günlük Menün ve Alışveriş Listen`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all print:hidden ${
                isDark
                  ? "bg-slate-900 border-rose-900/50 text-amber-300 hover:bg-slate-800"
                  : "bg-sky-100 border-sky-300 text-sky-900 hover:bg-sky-200"
              }`}
            >
              {isDark ? "☀️ Gündüz" : "🌙 Gece"}
            </button>

            {!isFinished && (
              <div
                className={`border px-3 py-1.5 rounded-xl flex items-center gap-3 print:hidden ${
                  isDark
                    ? "bg-slate-900/90 border-rose-900/40"
                    : "bg-sky-100/80 border-sky-200"
                }`}
              >
                <span
                  className={`text-xs font-medium hidden sm:inline ${isDark ? "text-slate-300" : "text-sky-900"}`}
                >
                  👥 Kişi Sayısı:
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setServings((prev) => Math.max(1, prev - 1))}
                    className={`w-6 h-6 rounded-md font-bold text-xs flex items-center justify-center transition-all ${
                      isDark
                        ? "bg-rose-900/50 hover:bg-rose-800 text-rose-200"
                        : "bg-sky-200 hover:bg-sky-300 text-sky-900"
                    }`}
                  >
                    -
                  </button>
                  <span
                    className={`text-sm font-bold min-w-[20px] text-center ${isDark ? "text-rose-200" : "text-sky-900"}`}
                  >
                    {servings}x
                  </span>
                  <button
                    onClick={() => setServings((prev) => prev + 1)}
                    className={`w-6 h-6 rounded-md font-bold text-xs flex items-center justify-center transition-all ${
                      isDark
                        ? "bg-rose-900/50 hover:bg-rose-800 text-rose-200"
                        : "bg-sky-200 hover:bg-sky-300 text-sky-900"
                    }`}
                  >
                    +
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        {!isFinished && (
          <div
            className={`flex flex-wrap items-center justify-start gap-4 mb-3 px-3 py-2 rounded-xl border print:hidden transition-colors ${
              isDark
                ? "bg-slate-900/70 border-rose-900/30"
                : "bg-white/80 border-sky-200/70 shadow-sm"
            }`}
          >
            <span
              className={`text-xs font-bold ${isDark ? "text-rose-300" : "text-sky-900"}`}
            >
              🔍 Filtreler:
            </span>
            <label className="flex items-center gap-1.5 text-xs cursor-pointer font-medium hover:opacity-80 select-none">
              <input
                type="checkbox"
                checked={onlyGlutenFree}
                onChange={(e) => setOnlyGlutenFree(e.target.checked)}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5 cursor-pointer"
              />
              <span>🌾 Glutensiz</span>
            </label>
            <label className="flex items-center gap-1.5 text-xs cursor-pointer font-medium hover:opacity-80 select-none">
              <input
                type="checkbox"
                checked={onlyVegan}
                onChange={(e) => setOnlyVegan(e.target.checked)}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5 cursor-pointer"
              />
              <span>🌱 Vegan</span>
            </label>
            <label className="flex items-center gap-1.5 text-xs cursor-pointer font-medium hover:opacity-80 select-none">
              <input
                type="checkbox"
                checked={onlyWorldCuisine}
                onChange={(e) => setOnlyWorldCuisine(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5 cursor-pointer"
              />
              <span>🌍 Dünya Mutfağı</span>
            </label>
          </div>
        )}

        {!isFinished ? (
          <div className="flex flex-col flex-grow overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 flex-grow overflow-hidden">
              {/* 🔴 1. ANA YEMEK */}
              <section
                className={`p-3 rounded-xl border flex flex-col overflow-hidden relative ${
                  isDark ? "border-rose-900/50" : "border-rose-200"
                }`}
              >
                <div
                  className={`absolute inset-0 bg-cover bg-center pointer-events-none ${isDark ? "opacity-20" : "opacity-15"}`}
                  style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80')`,
                  }}
                />
                <div
                  className={`absolute inset-0 pointer-events-none ${isDark ? "bg-slate-950/75" : "bg-rose-50/85"}`}
                />

                <div className="relative z-10 flex flex-col h-full overflow-hidden">
                  <h2 className="font-semibold text-xs mb-2">
                    <span
                      className={
                        isDark ? "text-rose-300" : "text-rose-800 font-bold"
                      }
                    >
                      🔴 1. Ana Yemek
                    </span>
                  </h2>
                  <input
                    type="text"
                    placeholder="Ara..."
                    value={searchMain}
                    onChange={(e) => setSearchMain(e.target.value)}
                    className={`w-full mb-2 px-2.5 py-1.5 text-xs rounded-lg border focus:outline-none transition-all ${
                      isDark
                        ? "bg-slate-900/90 border-rose-900/50 text-rose-100 focus:border-rose-500"
                        : "bg-white border-rose-200 text-slate-800 focus:border-rose-400 shadow-sm"
                    }`}
                  />
                  <div className="flex-grow overflow-y-auto pr-1 space-y-1.5">
                    {filterCategory("main", searchMain).map((recipe) => (
                      <button
                        key={recipe.id}
                        onClick={() => handleSelectRecipe("main", recipe)}
                        className={`w-full text-left p-2 rounded-lg border text-xs transition-all flex items-center justify-between gap-1 ${
                          tempDaySelection.main?.id === recipe.id
                            ? isDark
                              ? "border-rose-500 bg-rose-900/90 text-rose-100 font-semibold shadow-sm"
                              : "border-rose-600 bg-rose-600 text-white font-semibold shadow-sm"
                            : isDark
                              ? "border-rose-900/30 hover:border-rose-700 bg-slate-900/80 text-slate-200"
                              : "border-rose-200/60 hover:border-rose-300 bg-white/90 text-slate-800 shadow-sm"
                        }`}
                      >
                        <span className="truncate">{recipe.title}</span>
                        <div className="flex items-center gap-1.5 flex-shrink-0 text-xs">
                          {recipe.cuisine === "world" && (
                            <span title="Dünya Mutfağı">🌍</span>
                          )}
                          {isRecipeGlutenFree(recipe) && (
                            <span title="Glutensiz">🌾</span>
                          )}
                          {isRecipeVegan(recipe) && (
                            <span title="Vegan">🌱</span>
                          )}
                          {recipe.calories && (
                            <span
                              className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                                tempDaySelection.main?.id === recipe.id
                                  ? "bg-white/20 text-white"
                                  : isDark
                                    ? "bg-amber-950/80 text-amber-300 border border-amber-800/40"
                                    : "bg-amber-100 text-amber-900"
                              }`}
                            >
                              🔥 {recipe.calories} kcal
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </section>

              <section
                className={`p-3 rounded-xl border flex flex-col overflow-hidden relative ${
                  isDark ? "border-amber-900/50" : "border-amber-200"
                }`}
              >
                <div
                  className={`absolute inset-0 bg-cover bg-center pointer-events-none ${isDark ? "opacity-20" : "opacity-15"}`}
                  style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80')`,
                  }}
                />
                <div
                  className={`absolute inset-0 pointer-events-none ${isDark ? "bg-slate-950/75" : "bg-amber-50/85"}`}
                />

                <div className="relative z-10 flex flex-col h-full overflow-hidden">
                  <h2 className="font-semibold text-xs mb-2">
                    <span
                      className={
                        isDark ? "text-amber-300" : "text-amber-900 font-bold"
                      }
                    >
                      🟡 2. Eşlikçi
                    </span>
                  </h2>
                  <input
                    type="text"
                    placeholder="Ara..."
                    value={searchSide}
                    onChange={(e) => setSearchSide(e.target.value)}
                    className={`w-full mb-2 px-2.5 py-1.5 text-xs rounded-lg border focus:outline-none transition-all ${
                      isDark
                        ? "bg-slate-900/90 border-amber-900/50 text-amber-100 focus:border-amber-500"
                        : "bg-white border-amber-200 text-slate-800 focus:border-amber-400 shadow-sm"
                    }`}
                  />
                  <div className="flex-grow overflow-y-auto pr-1 space-y-1.5">
                    {filterCategory("side", searchSide).map((recipe) => (
                      <button
                        key={recipe.id}
                        onClick={() => handleSelectRecipe("side", recipe)}
                        className={`w-full text-left p-2 rounded-lg border text-xs transition-all flex items-center justify-between gap-1 ${
                          tempDaySelection.side?.id === recipe.id
                            ? isDark
                              ? "border-amber-500 bg-amber-900/90 text-amber-100 font-semibold shadow-sm"
                              : "border-amber-600 bg-amber-600 text-white font-semibold shadow-sm"
                            : isDark
                              ? "border-amber-900/30 hover:border-amber-700 bg-slate-900/80 text-slate-200"
                              : "border-amber-200/60 hover:border-amber-300 bg-white/90 text-slate-800 shadow-sm"
                        }`}
                      >
                        <span className="truncate">{recipe.title}</span>
                        <div className="flex items-center gap-1.5 flex-shrink-0 text-xs">
                          {recipe.cuisine === "world" && (
                            <span title="Dünya Mutfağı">🌍</span>
                          )}
                          {isRecipeGlutenFree(recipe) && (
                            <span title="Glutensiz">🌾</span>
                          )}
                          {isRecipeVegan(recipe) && (
                            <span title="Vegan">🌱</span>
                          )}
                          {recipe.calories && (
                            <span
                              className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                                tempDaySelection.side?.id === recipe.id
                                  ? "bg-white/20 text-white"
                                  : isDark
                                    ? "bg-amber-950/80 text-amber-300 border border-amber-800/40"
                                    : "bg-amber-100 text-amber-900"
                              }`}
                            >
                              🔥 {recipe.calories} kcal
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </section>

              <section
                className={`p-3 rounded-xl border flex flex-col overflow-hidden relative ${
                  isDark ? "border-emerald-900/50" : "border-emerald-200"
                }`}
              >
                <div
                  className={`absolute inset-0 bg-cover bg-center pointer-events-none ${isDark ? "opacity-20" : "opacity-15"}`}
                  style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=600&q=80')`,
                  }}
                />
                <div
                  className={`absolute inset-0 pointer-events-none ${isDark ? "bg-slate-950/75" : "bg-emerald-50/85"}`}
                />

                <div className="relative z-10 flex flex-col h-full overflow-hidden">
                  <h2 className="font-semibold text-xs mb-2">
                    <span
                      className={
                        isDark
                          ? "text-emerald-300"
                          : "text-emerald-900 font-bold"
                      }
                    >
                      🟢 3. Çorba / Meze
                    </span>
                  </h2>
                  <input
                    type="text"
                    placeholder="Ara..."
                    value={searchExtra}
                    onChange={(e) => setSearchExtra(e.target.value)}
                    className={`w-full mb-2 px-2.5 py-1.5 text-xs rounded-lg border focus:outline-none transition-all ${
                      isDark
                        ? "bg-slate-900/90 border-emerald-900/50 text-emerald-100 focus:border-emerald-500"
                        : "bg-white border-emerald-200 text-slate-800 focus:border-emerald-400 shadow-sm"
                    }`}
                  />
                  <div className="flex-grow overflow-y-auto pr-1 space-y-1.5">
                    {filterCategory("extra", searchExtra).map((recipe) => (
                      <button
                        key={recipe.id}
                        onClick={() => handleSelectRecipe("extra", recipe)}
                        className={`w-full text-left p-2 rounded-lg border text-xs transition-all flex items-center justify-between gap-1 ${
                          tempDaySelection.extra?.id === recipe.id
                            ? isDark
                              ? "border-emerald-500 bg-emerald-900/90 text-emerald-100 font-semibold shadow-sm"
                              : "border-emerald-600 bg-emerald-600 text-white font-semibold shadow-sm"
                            : isDark
                              ? "border-emerald-900/30 hover:border-emerald-700 bg-slate-900/80 text-slate-200"
                              : "border-emerald-200/60 hover:border-emerald-300 bg-white/90 text-slate-800 shadow-sm"
                        }`}
                      >
                        <span className="truncate">{recipe.title}</span>
                        <div className="flex items-center gap-1.5 flex-shrink-0 text-xs">
                          {recipe.cuisine === "world" && (
                            <span title="Dünya Mutfağı">🌍</span>
                          )}
                          {isRecipeGlutenFree(recipe) && (
                            <span title="Glutensiz">🌾</span>
                          )}
                          {isRecipeVegan(recipe) && (
                            <span title="Vegan">🌱</span>
                          )}
                          {recipe.calories && (
                            <span
                              className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                                tempDaySelection.extra?.id === recipe.id
                                  ? "bg-white/20 text-white"
                                  : isDark
                                    ? "bg-amber-950/80 text-amber-300 border border-amber-800/40"
                                    : "bg-amber-100 text-amber-900"
                              }`}
                            >
                              🔥 {recipe.calories} kcal
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </section>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3 flex-shrink-0">
              <button
                onClick={handleNextDay}
                className={`sm:col-span-2 font-bold py-2.5 px-4 rounded-xl transition-all shadow-md text-xs sm:text-sm ${
                  isDark
                    ? "bg-rose-900 hover:bg-rose-800 text-rose-100 border border-rose-700/60"
                    : "bg-sky-800 hover:bg-sky-900 text-white"
                }`}
              >
                {currentDay + 1}. Güne Geç ➔
              </button>
              <button
                onClick={handleFinishPlanning}
                className={`font-bold py-2.5 px-4 rounded-xl transition-all text-xs sm:text-sm border ${
                  isDark
                    ? "bg-slate-900 hover:bg-slate-800 text-rose-300 border-rose-900/50"
                    : "bg-sky-100 hover:bg-sky-200 text-sky-900 border-sky-300"
                }`}
              >
                🏁 Planlamayı Bitir
              </button>
            </div>
          </div>
        ) : (

          <div className="flex flex-col flex-grow overflow-hidden print:overflow-visible print:h-auto py-1">
            <div className="flex justify-between items-center mb-3 flex-shrink-0">
              <h2
                className={`text-base font-bold flex items-center gap-2 ${isDark ? "text-rose-300" : "text-sky-900"}`}
              >
                🎉 {selectedRecipes.length} Günlük Menün & Alışveriş Listen
                Hazır!
              </h2>
              <div className="flex gap-2 print:hidden">
                <button
                  onClick={handleCopyList}
                  className={`px-3 py-1.5 border text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                    isDark
                      ? "bg-slate-900 hover:bg-slate-800 text-rose-300 border-rose-900/50"
                      : "bg-sky-100 hover:bg-sky-200 text-sky-900 border-sky-300"
                  }`}
                >
                  {copied ? "✓ Kopyalandı!" : "📋 Kopyala"}
                </button>
                <button
                  onClick={() => window.print()}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shadow-sm ${
                    isDark
                      ? "bg-rose-900 hover:bg-rose-800 text-rose-100 border border-rose-700/60"
                      : "bg-sky-800 hover:bg-sky-900 text-white"
                  }`}
                >
                  🖨️ PDF / Yazdır
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow overflow-hidden print:overflow-visible print:h-auto print:grid-cols-2">
              {/* 📅 SOL SÜTUN */}
              <div
                className={`rounded-xl p-3 border flex flex-col overflow-hidden print:overflow-visible print:h-auto ${
                  isDark
                    ? "bg-slate-950/90 border-rose-900/30"
                    : "bg-sky-100/50 border-sky-200"
                }`}
              >
                <h3
                  className={`text-xs font-bold border-b pb-2 mb-2 ${
                    isDark
                      ? "text-rose-200 border-rose-900/30"
                      : "text-sky-900 border-sky-200"
                  }`}
                >
                  📅 Seçilen Menü ({selectedRecipes.length} Gün)
                </h3>
                <div className="flex-grow overflow-y-auto print:overflow-visible print:h-auto space-y-2 pr-1">
                  {selectedRecipes.map((item, idx) => (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-lg border text-xs space-y-1 ${
                        isDark
                          ? "bg-slate-900/80 border-rose-900/20 text-slate-300"
                          : "bg-white border-sky-200 text-slate-800 shadow-sm"
                      }`}
                    >
                      <div className="flex justify-between items-center font-bold mb-1">
                        <span
                          className={isDark ? "text-rose-300" : "text-sky-900"}
                        >
                          🗓️ {item.day}. Gün
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                              isDark
                                ? "bg-amber-950/80 text-amber-300 border border-amber-800/40"
                                : "bg-amber-100 text-amber-900"
                            }`}
                          >
                            🔥 Toplam: {calculateDayCalories(item)} kcal
                          </span>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded ${
                              isDark
                                ? "bg-slate-950 text-rose-300 border border-rose-900/30"
                                : "bg-sky-100 text-sky-900"
                            }`}
                          >
                            {item.servings} Kişilik
                          </span>
                        </div>
                      </div>

                      {item.main && (
                        <p className="truncate flex items-center gap-1">
                          <span
                            className={
                              isDark
                                ? "text-rose-400 font-semibold"
                                : "text-rose-700 font-semibold"
                            }
                          >
                            Ana:
                          </span>{" "}
                          {item.main.title}
                          {item.main.cuisine === "world" && (
                            <span title="Dünya Mutfağı">🌍</span>
                          )}
                          {isRecipeGlutenFree(item.main) && (
                            <span title="Glutensiz">🌾</span>
                          )}
                          {isRecipeVegan(item.main) && (
                            <span title="Vegan">🌱</span>
                          )}
                          {item.main.calories && (
                            <span
                              className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                                isDark
                                  ? "bg-amber-950/80 text-amber-300"
                                  : "bg-amber-100 text-amber-900"
                              }`}
                            >
                              🔥 {item.main.calories} kcal
                            </span>
                          )}
                        </p>
                      )}

                      {item.side && (
                        <p className="truncate flex items-center gap-1">
                          <span
                            className={
                              isDark
                                ? "text-amber-400 font-semibold"
                                : "text-amber-700 font-semibold"
                            }
                          >
                            Eşlikçi:
                          </span>{" "}
                          {item.side.title}
                          {item.side.cuisine === "world" && (
                            <span title="Dünya Mutfağı">🌍</span>
                          )}
                          {isRecipeGlutenFree(item.side) && (
                            <span title="Glutensiz">🌾</span>
                          )}
                          {isRecipeVegan(item.side) && (
                            <span title="Vegan">🌱</span>
                          )}
                          {item.side.calories && (
                            <span
                              className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                                isDark
                                  ? "bg-amber-950/80 text-amber-300"
                                  : "bg-amber-100 text-amber-900"
                              }`}
                            >
                              🔥 {item.side.calories} kcal
                            </span>
                          )}
                        </p>
                      )}

                      {item.extra && (
                        <p className="truncate flex items-center gap-1">
                          <span
                            className={
                              isDark
                                ? "text-emerald-400 font-semibold"
                                : "text-emerald-700 font-semibold"
                            }
                          >
                            Ekstra:
                          </span>{" "}
                          {item.extra.title}
                          {item.extra.cuisine === "world" && (
                            <span title="Dünya Mutfağı">🌍</span>
                          )}
                          {isRecipeGlutenFree(item.extra) && (
                            <span title="Glutensiz">🌾</span>
                          )}
                          {isRecipeVegan(item.extra) && (
                            <span title="Vegan">🌱</span>
                          )}
                          {item.extra.calories && (
                            <span
                              className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                                isDark
                                  ? "bg-amber-950/80 text-amber-300"
                                  : "bg-amber-100 text-amber-900"
                              }`}
                            >
                              🔥 {item.extra.calories} kcal
                            </span>
                          )}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div
                className={`rounded-xl p-3 border flex flex-col overflow-hidden print:overflow-visible print:h-auto ${
                  isDark
                    ? "bg-slate-950/90 border-rose-900/30"
                    : "bg-sky-100/50 border-sky-200"
                }`}
              >
                <h3
                  className={`text-xs font-bold border-b pb-2 mb-2 ${
                    isDark
                      ? "text-rose-200 border-rose-900/30"
                      : "text-sky-900 border-sky-200"
                  }`}
                >
                  🛒 Alışveriş Listesi
                </h3>
                <div className="flex-grow overflow-y-auto print:overflow-visible print:h-auto space-y-1.5 pr-1">
                  {shoppingList.map((item, index) => (
                    <div
                      key={index}
                      className={`flex justify-between items-center border-b pb-1 text-xs ${
                        isDark ? "border-slate-800/60" : "border-slate-200/60"
                      }`}
                    >
                      <span
                        className={
                          isDark
                            ? "text-slate-300"
                            : "text-slate-800 font-medium"
                        }
                      >
                        {item.name}
                      </span>
                      <span
                        className={`font-bold ${isDark ? "text-rose-300" : "text-sky-900"}`}
                      >
                        {item.amount} {item.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setCurrentDay(1);
                setSelectedRecipes([]);
                setServings(2);
                setIsFinished(false);
              }}
              className={`w-full mt-3 font-semibold py-2.5 px-4 rounded-xl transition-all flex-shrink-0 text-xs print:hidden border ${
                isDark
                  ? "bg-slate-900 hover:bg-slate-800 text-slate-300 border-rose-900/40"
                  : "bg-sky-100 hover:bg-sky-200 text-sky-900 border-sky-300"
              }`}
            >
              🔄 Sıfırla ve Yeni Planlama Yap
            </button>
          </div>
        )}
      </div>
    </div>
  );
}