import Logo from './Logo'

<div className="text-left flex items-center gap-2.5">
  <Logo className="w-9 h-9 flex-shrink-0" isDark={isDark} />
  <div>
    <h1 className={`text-xl font-black tracking-tight ${isDark ? 'text-rose-300' : 'text-sky-900'}`}>
      Afiyet<span className={isDark ? 'text-rose-500' : 'text-sky-600'}>List</span>
    </h1>
    <p className={`text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
      {!isFinished ? `${currentDay}. Gün Menünü Oluşturuyorsun` : `🎉 ${selectedRecipes.length} Günlük Menün Hazır`}
    </p>
  </div>
</div>