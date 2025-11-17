// Test script to check class API
const fetch = require('node-fetch')

async function testClassAPI() {
  try {
    console.log('Testing Class API...\n')
    
    // Test 1: Get all classes
    console.log('1. Fetching all classes...')
    const response = await fetch('http://localhost:3000/api/classes')
    const data = await response.json()
    
    if (data.success && data.data) {
      console.log(`✅ Found ${data.data.length} classes:`)
      data.data.forEach((cls, i) => {
        console.log(`   ${i + 1}. ${cls.name} (ID: ${cls.id})`)
      })
      
      // Test 2: Try to get first class details
      if (data.data.length > 0) {
        const firstClass = data.data[0]
        console.log(`\n2. Fetching details for "${firstClass.name}" (ID: ${firstClass.id})...`)
        
        const detailResponse = await fetch(`http://localhost:3000/api/classes/${firstClass.id}`)
        const detailData = await detailResponse.json()
        
        if (detailData.success) {
          console.log('✅ Class details retrieved successfully:')
          console.log(JSON.stringify(detailData.data, null, 2))
        } else {
          console.log('❌ Failed to get class details:', detailData.error)
        }
      }
    } else {
      console.log('❌ Failed to fetch classes:', data.error)
    }
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

testClassAPI()
