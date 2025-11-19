# Test homework creation
$body = @{
    title = "Test Assignment"
    description = "This is a test"
    subject = "Mathematics"
    classId = "cmhyq2cc2005vu9v8yjvk1jcr"
    teacherId = "cmhyq2cc2005tu9v8yjvk1jcq"
    dueDate = "2025-12-31"
} | ConvertTo-Json

Write-Host "Testing homework creation..."
Write-Host "Request body: $body"

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/homework" -Method POST -Body $body -ContentType "application/json"
    Write-Host "`nSuccess!" -ForegroundColor Green
    Write-Host "Response:" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 5
} catch {
    Write-Host "`nError!" -ForegroundColor Red
    Write-Host $_.Exception.Message
    Write-Host $_.ErrorDetails.Message
}
