// Ghana Education System Configuration
// Aligned with Ghana Education Service (GES) and National Council for Curriculum and Assessment (NaCCA)

interface CurriculumLevel {
  subjects: string[]
  duration: string
  ageRange: string
}

interface GradingSystem {
  scale: string
  grades: { grade: string; range: string; interpretation: string }[]
}

interface FeeStructure {
  tuition: number
  textbooks: number
  uniform: number
  pta: number
  currency: string
}

interface GhanaEducationConfig {
  curriculum: {
    primary: CurriculumLevel
    jhs: CurriculumLevel
    shs: CurriculumLevel
  }
  grading: {
    primary: GradingSystem
    jhs: GradingSystem
    shs: GradingSystem
  }
  fees: {
    primary: FeeStructure
    jhs: FeeStructure
    shs: FeeStructure
  }
}

const ghanaEducationConfig: GhanaEducationConfig = {
  curriculum: {
    primary: {
      subjects: [
        "English Language",
        "Mathematics",
        "Science",
        "Social Studies",
        "Ghanaian Language",
        "Religious and Moral Education",
        "Creative Arts",
        "Physical Education"
      ],
      duration: "6 years",
      ageRange: "6-11 years"
    },
    jhs: {
      subjects: [
        "English Language",
        "Mathematics",
        "Integrated Science",
        "Social Studies",
        "Ghanaian Language",
        "Religious and Moral Education",
        "ICT",
        "French",
        "Basic Design and Technology"
      ],
      duration: "3 years",
      ageRange: "12-14 years"
    },
    shs: {
      subjects: [
        "Core Mathematics",
        "English Language",
        "Integrated Science",
        "Social Studies",
        "Elective Subjects (varies by program)"
      ],
      duration: "3 years",
      ageRange: "15-17 years"
    }
  },
  grading: {
    primary: {
      scale: "A1 to F9",
      grades: [
        { grade: "A1", range: "80-100", interpretation: "Excellent" },
        { grade: "B2", range: "70-79", interpretation: "Very Good" },
        { grade: "B3", range: "65-69", interpretation: "Good" },
        { grade: "C4", range: "60-64", interpretation: "Credit" },
        { grade: "C5", range: "55-59", interpretation: "Credit" },
        { grade: "C6", range: "50-54", interpretation: "Credit" },
        { grade: "D7", range: "45-49", interpretation: "Pass" },
        { grade: "E8", range: "40-44", interpretation: "Pass" },
        { grade: "F9", range: "0-39", interpretation: "Fail" }
      ]
    },
    jhs: {
      scale: "A1 to F9",
      grades: [
        { grade: "A1", range: "80-100", interpretation: "Excellent" },
        { grade: "B2", range: "70-79", interpretation: "Very Good" },
        { grade: "B3", range: "65-69", interpretation: "Good" },
        { grade: "C4", range: "60-64", interpretation: "Credit" },
        { grade: "C5", range: "55-59", interpretation: "Credit" },
        { grade: "C6", range: "50-54", interpretation: "Credit" },
        { grade: "D7", range: "45-49", interpretation: "Pass" },
        { grade: "E8", range: "40-44", interpretation: "Pass" },
        { grade: "F9", range: "0-39", interpretation: "Fail" }
      ]
    },
    shs: {
      scale: "A1 to F9",
      grades: [
        { grade: "A1", range: "80-100", interpretation: "Excellent" },
        { grade: "B2", range: "70-79", interpretation: "Very Good" },
        { grade: "B3", range: "65-69", interpretation: "Good" },
        { grade: "C4", range: "60-64", interpretation: "Credit" },
        { grade: "C5", range: "55-59", interpretation: "Credit" },
        { grade: "C6", range: "50-54", interpretation: "Credit" },
        { grade: "D7", range: "45-49", interpretation: "Pass" },
        { grade: "E8", range: "40-44", interpretation: "Pass" },
        { grade: "F9", range: "0-39", interpretation: "Fail" }
      ]
    }
  },
  fees: {
    primary: {
      tuition: 0, // Free Compulsory Universal Basic Education (FCUBE)
      textbooks: 50,
      uniform: 100,
      pta: 20,
      currency: "GH₵"
    },
    jhs: {
      tuition: 0, // Free Compulsory Universal Basic Education (FCUBE)
      textbooks: 100,
      uniform: 150,
      pta: 30,
      currency: "GH₵"
    },
    shs: {
      tuition: 0, // Free SHS Policy
      textbooks: 200,
      uniform: 200,
      pta: 50,
      currency: "GH₵"
    }
  }
}

export default ghanaEducationConfig

// Subjects organized by education level
export const SUBJECTS_BY_LEVEL = {
  'early-childhood': [
    'Language and Literacy',
    'Mathematics (Numeracy)',
    'Environmental Studies',
    'Creative Arts',
    'Physical Education',
    'Moral Education'
  ],
  'basic-school': [
    'English Language',
    'Mathematics',
    'Science',
    'Social Studies',
    'Ghanaian Language',
    'Religious and Moral Education',
    'Creative Arts',
    'Physical Education',
    'Information and Communication Technology (ICT)'
  ],
  'junior-high': [
    'English Language',
    'Mathematics',
    'Integrated Science',
    'Social Studies',
    'Ghanaian Language',
    'Religious and Moral Education',
    'Creative Arts',
    'Physical Education',
    'Information and Communication Technology (ICT)',
    'Pre-Technical Skills',
    'French (Optional)'
  ]
} as const

// Ghana Education Levels
export const GHANA_EDUCATION_LEVELS = [
  {
    level: 'early-childhood',
    name: 'Early Childhood Education',
    duration: '2-3 years',
    ageRange: '2-5 years',
    classes: ['Creche', 'KG (Kindergarten)'],
    description: 'Foundation stage focusing on play-based learning and basic skills development'
  },
  {
    level: 'basic-school',
    name: 'Basic School (Primary Level)',
    duration: '6 years',
    ageRange: '6-11 years',
    classes: ['Basic 1', 'Basic 2', 'Basic 3', 'Basic 4', 'Basic 5', 'Basic 6'],
    description: 'Basic literacy, numeracy, and foundational knowledge across subjects'
  },
  {
    level: 'junior-high',
    name: 'Junior High School',
    duration: '3 years',
    ageRange: '12-14 years',
    classes: ['JHS 1', 'JHS 2', 'JHS 3'],
    description: 'Continuation of basic education with introduction to technical and vocational skills'
  }
]

// Assessment System
export const ASSESSMENT_SYSTEM = {
  'early-childhood': {
    type: 'Continuous Assessment',
    description: 'Observation-based assessment focusing on developmental milestones',
    grading: 'Descriptive (Excellent, Very Good, Good, Satisfactory, Needs Improvement)'
  },
  'basic-school': {
    type: 'School-Based Assessment (SBA)',
    description: 'Continuous assessment throughout the year with termly examinations',
    grading: 'Percentage and Grade (A: 80-100%, B: 70-79%, C: 60-69%, D: 50-59%, E: 40-49%, F: Below 40%)',
    nationalExam: 'None (Preparation for BECE at JHS level)'
  },
  'junior-high': {
    type: 'School-Based Assessment (SBA) + Basic Education Certificate Examination (BECE)',
    description: 'Continuous assessment with national examination at the end of JHS 3',
    grading: 'Grade System (1: Excellent, 2: Very Good, 3: Good, 4: Credit, 5: Pass, 6: Fail)',
    nationalExam: 'Basic Education Certificate Examination (BECE) - End of JHS 3'
  }
}
