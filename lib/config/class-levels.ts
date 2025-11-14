// Ghana Education System - Class Levels Configuration
// From Creche to JHS 3

export const CLASS_LEVELS = [
  // Early Childhood Education
  { value: "Creche", label: "Creche", category: "Early Childhood", ageRange: "0-3 years" },
  { value: "KG 1", label: "KG 1 (Kindergarten 1)", category: "Early Childhood", ageRange: "4 years" },
  { value: "KG 2", label: "KG 2 (Kindergarten 2)", category: "Early Childhood", ageRange: "5 years" },
  
  // Basic Education (Primary)
  { value: "Basic 1", label: "Basic 1", category: "Primary", ageRange: "6 years" },
  { value: "Basic 2", label: "Basic 2", category: "Primary", ageRange: "7 years" },
  { value: "Basic 3", label: "Basic 3", category: "Primary", ageRange: "8 years" },
  { value: "Basic 4", label: "Basic 4", category: "Primary", ageRange: "9 years" },
  { value: "Basic 5", label: "Basic 5", category: "Primary", ageRange: "10 years" },
  { value: "Basic 6", label: "Basic 6", category: "Primary", ageRange: "11 years" },
  
  // Junior High School
  { value: "JHS 1", label: "JHS 1 (Junior High School 1)", category: "JHS", ageRange: "12 years" },
  { value: "JHS 2", label: "JHS 2 (Junior High School 2)", category: "JHS", ageRange: "13 years" },
  { value: "JHS 3", label: "JHS 3 (Junior High School 3)", category: "JHS", ageRange: "14 years" },
]

export const CLASS_CATEGORIES = [
  { value: "Early Childhood", label: "Early Childhood (Creche - KG 2)" },
  { value: "Primary", label: "Primary (Basic 1 - Basic 6)" },
  { value: "JHS", label: "Junior High School (JHS 1 - JHS 3)" },
]

// Get classes by category
export function getClassesByCategory(category: string) {
  return CLASS_LEVELS.filter(level => level.category === category)
}

// Get all class values for dropdowns
export function getAllClassValues() {
  return CLASS_LEVELS.map(level => level.value)
}

// Get all class labels
export function getAllClassLabels() {
  return CLASS_LEVELS.map(level => level.label)
}

// Get class info by value
export function getClassInfo(value: string) {
  return CLASS_LEVELS.find(level => level.value === value)
}

// Check if class is in a specific category
export function isInCategory(classValue: string, category: string) {
  const classInfo = getClassInfo(classValue)
  return classInfo?.category === category
}

// Get next class level
export function getNextClassLevel(currentClass: string) {
  const currentIndex = CLASS_LEVELS.findIndex(level => level.value === currentClass)
  if (currentIndex === -1 || currentIndex === CLASS_LEVELS.length - 1) {
    return null // No next level or not found
  }
  return CLASS_LEVELS[currentIndex + 1]
}

// Get previous class level
export function getPreviousClassLevel(currentClass: string) {
  const currentIndex = CLASS_LEVELS.findIndex(level => level.value === currentClass)
  if (currentIndex <= 0) {
    return null // No previous level or not found
  }
  return CLASS_LEVELS[currentIndex - 1]
}
