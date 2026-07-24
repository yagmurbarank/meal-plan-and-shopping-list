export const isRecipeGlutenFree = (r) => r?.isGlutenFree === true || r?.isGlutenFree === 'true'
export const isRecipeVegan = (r) => r?.isVegan === true || r?.isVegan === 'true'

export const generateShoppingList = (selectedRecipes) => {
  const list = {}

  selectedRecipes.forEach(day => {
    const portionMultiplier = day.servings || 2

    ;['main', 'side', 'extra'].forEach(cat => {
      const recipe = day[cat]
      if (recipe && recipe.ingredients) {
        recipe.ingredients.forEach(ing => {
          const key = `${ing.name.toLowerCase()}_${ing.unit.toLowerCase()}`
          const calculatedAmount = ing.amount * portionMultiplier

          if (list[key]) {
            list[key].amount += calculatedAmount
          } else {
            list[key] = {
              name: ing.name,
              amount: calculatedAmount,
              unit: ing.unit
            }
          }
        })
      }
    })
  })

  return Object.values(list)
}

export const buildCopyText = (selectedRecipes) => {
  let text = `📅 ${selectedRecipes.length} GÜNLÜK MENÜ PLANIM\n----------------------------\n`
  selectedRecipes.forEach(item => {
    text += `${item.day}. Gün (${item.servings} Kişilik):\n`
    if (item.main) text += `  • Ana Yemek: ${item.main.title}\n`
    if (item.side) text += `  • Eşlikçi: ${item.side.title}\n`
    if (item.extra) text += `  • Çorba/Meze: ${item.extra.title}\n`
    text += "\n"
  })

  text += "🛒 ALIŞVERİŞ LİSTEM\n----------------------------\n"
  generateShoppingList(selectedRecipes).forEach(item => {
    text += `• ${item.name}: ${item.amount} ${item.unit}\n`
  })

  return text
}