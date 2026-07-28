import React, { useState } from "react";
import { recipeService } from "../services/recipeService"; 

const AddRecipeModal = ({ isOpen, onClose, onRecipeAdded }) => {
  const [formData, setFormData] = useState({
    title: "",
    cuisine: "Türk",
    category: "Ana Yemek",
    prepTime: 15,
    cookTime: 30,
    servings: 1,
    isVegan: false,
    isGlutenFree: false,
    instructions: "",
    ingredients: [{ name: "", amount: "1", unit: "Adet" }],
  });

  const categories = ["Ana Yemek", "Eşlikçi", "Meze/Çorba", "Tatlı", "Kahvaltılık"];
  const amounts = ["1/4", "1/2", "3/4", "1", "1.5", "2", "3", "4", "5", "İsteğe Göre"];
  const units = ["Adet", "Su Bardağı", "Yemek Kaşığı", "Çay Kaşığı", "Tatlı Kaşığı", "Demet", "Gram", "Litre", "Mililitre", "Tutam", "Diş", "Paket"];

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index][field] = value;
    setFormData({ ...formData, ingredients: newIngredients });
  };

  const addIngredientRow = () => {
    setFormData({
      ...formData,
      ingredients: [...formData.ingredients, { name: "", amount: "1", unit: "Adet" }],
    });
  };

  const removeIngredientRow = (index) => {
    const newIngredients = formData.ingredients.filter((_, i) => i !== index);
    setFormData({ ...formData, ingredients: newIngredients });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (recipeService && recipeService.addRecipe) {
        await recipeService.addRecipe(formData);
      }
      if (onRecipeAdded) onRecipeAdded(formData);
      onClose();
    } catch (err) {
      console.error("Tarif eklenirken hata oluştu:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl p-6 relative overflow-hidden">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl font-bold transition-colors"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-2">
          📝 Yeni Tarif Ekle
        </h2>

        <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs px-3.5 py-2 rounded-lg mb-3 flex items-center gap-2 font-medium">
          💡 <span><strong>Not:</strong> Girilen tarifler <strong>1 kişilik</strong> porsiyon baz alınarak hesaplanmaktadır. Lütfen malzemeleri 1 kişiye göre giriniz.</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
              Tarif Adı
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Örn: Merdiven Mantısı"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                Mutfak
              </label>
              <select
                name="cuisine"
                value={formData.cuisine}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="Türk">Türk</option>
                <option value="Dünya">Dünya</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                Kategori
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-6 items-center bg-gray-50 border border-gray-200 px-3.5 py-2 rounded-lg">
            <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer select-none">
              <input
                type="checkbox"
                name="isVegan"
                checked={formData.isVegan}
                onChange={handleChange}
                className="w-4 h-4 text-emerald-600 rounded accent-emerald-600 cursor-pointer"
              /> 🌱 Vegan
            </label>

            <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer select-none">
              <input
                type="checkbox"
                name="isGlutenFree"
                checked={formData.isGlutenFree}
                onChange={handleChange}
                className="w-4 h-4 text-emerald-600 rounded accent-emerald-600 cursor-pointer"
              /> 🌾 Glutensiz
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                Hazırlık (dk)
              </label>
              <input
                type="number"
                name="prepTime"
                value={formData.prepTime}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm outline-none"
                min="0"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                Pişirme (dk)
              </label>
              <input
                type="number"
                name="cookTime"
                value={formData.cookTime}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm outline-none"
                min="0"
              />
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 p-2.5 rounded-lg space-y-2">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
              Malzemeler
            </label>
            {formData.ingredients.map((ing, index) => (
              <div key={index} className="flex gap-2 items-center">
                <input
                  type="text"
                  placeholder="Malzeme Adı"
                  value={ing.name}
                  onChange={(e) => handleIngredientChange(index, "name", e.target.value)}
                  className="flex-1 border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs outline-none bg-white"
                  required
                />
                
                <select
                  value={ing.amount}
                  onChange={(e) => handleIngredientChange(index, "amount", e.target.value)}
                  className="w-24 border border-gray-300 rounded-lg px-2 py-1.5 text-xs bg-white outline-none"
                >
                  {amounts.map((amt) => (
                    <option key={amt} value={amt}>
                      {amt}
                    </option>
                  ))}
                </select>

                <select
                  value={ing.unit}
                  onChange={(e) => handleIngredientChange(index, "unit", e.target.value)}
                  className="w-32 border border-gray-300 rounded-lg px-2 py-1.5 text-xs bg-white outline-none"
                >
                  {units.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>

                {formData.ingredients.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeIngredientRow(index)}
                    className="text-red-500 hover:text-red-700 font-bold px-1.5"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addIngredientRow}
              className="text-xs text-emerald-700 hover:text-emerald-800 font-bold py-1 px-2.5 rounded-md bg-emerald-50 border border-emerald-200 transition-colors"
            >
              + Malzeme Ekle
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
              Hazırlanışı
            </label>
            <textarea
              name="instructions"
              value={formData.instructions}
              onChange={handleChange}
              rows="2"
              placeholder="Tarif adımlarını girin..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs outline-none resize-y min-h-[70px] focus:ring-2 focus:ring-emerald-500"
            ></textarea>
          </div>

          <div className="flex justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-xs text-gray-600 hover:bg-gray-100 font-medium transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 text-white text-xs rounded-lg hover:bg-emerald-700 font-semibold shadow-sm transition-colors"
            >
              Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRecipeModal;