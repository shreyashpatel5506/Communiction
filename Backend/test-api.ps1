# PowerShell script to test all API endpoints
# Make sure your server is running on http://localhost:5000

$baseUrl = "http://localhost:5000"
$headers = @{"Content-Type" = "application/json"}

Write-Host "🚀 Starting API Tests..." -ForegroundColor Green
Write-Host "Base URL: $baseUrl" -ForegroundColor Yellow

# Test 1: Middleware Test
Write-Host "`n📋 Test 1: Testing Middleware..." -ForegroundColor Cyan
$testBody = @{
    test = "data"
    email = "test@example.com"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/auth/test" -Method POST -Headers $headers -Body $testBody
    Write-Host "✅ Middleware Test: SUCCESS" -ForegroundColor Green
    Write-Host "Response: $($response | ConvertTo-Json)" -ForegroundColor White
} catch {
    Write-Host "❌ Middleware Test: FAILED" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Send OTP
Write-Host "`n📧 Test 2: Send OTP..." -ForegroundColor Cyan
$otpBody = @{
    email = "test@example.com"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/auth/send-Otp" -Method POST -Headers $headers -Body $otpBody
    Write-Host "✅ Send OTP: SUCCESS" -ForegroundColor Green
    Write-Host "Response: $($response | ConvertTo-Json)" -ForegroundColor White
    Write-Host "⚠️  Check your console for the OTP code!" -ForegroundColor Yellow
} catch {
    Write-Host "❌ Send OTP: FAILED" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Verify OTP (You'll need to replace with actual OTP)
Write-Host "`n🔐 Test 3: Verify OTP..." -ForegroundColor Cyan
$otp = Read-Host "Enter the OTP from console"
$verifyBody = @{
    email = "test@example.com"
    otp = $otp
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/auth/verify-Otp" -Method POST -Headers $headers -Body $verifyBody
    Write-Host "✅ Verify OTP: SUCCESS" -ForegroundColor Green
    Write-Host "Response: $($response | ConvertTo-Json)" -ForegroundColor White
} catch {
    Write-Host "❌ Verify OTP: FAILED" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Signup
Write-Host "`n👤 Test 4: Signup..." -ForegroundColor Cyan
$signupBody = @{
    email = "test@example.com"
    password = "password123"
    name = "Test User"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/api/auth/signup" -Method POST -Headers $headers -Body $signupBody
    Write-Host "✅ Signup: SUCCESS" -ForegroundColor Green
    Write-Host "Response: $($response | ConvertTo-Json)" -ForegroundColor White
} catch {
    Write-Host "❌ Signup: FAILED" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 5: Login
Write-Host "`n🔑 Test 5: Login..." -ForegroundColor Cyan
$loginBody = @{
    email = "test@example.com"
    password = "password123"
} | ConvertTo-Json

try {
    $session = New-Object Microsoft.PowerShell.Commands.WebRequestSession
    $response = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method POST -Headers $headers -Body $loginBody -WebSession $session
    Write-Host "✅ Login: SUCCESS" -ForegroundColor Green
    Write-Host "Response: $($response | ConvertTo-Json)" -ForegroundColor White
    
    # Test 6: Check Auth (using session from login)
    Write-Host "`n🔍 Test 6: Check Auth..." -ForegroundColor Cyan
    try {
        $authResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/check" -Method GET -Headers $headers -WebSession $session
        Write-Host "✅ Check Auth: SUCCESS" -ForegroundColor Green
        Write-Host "Response: $($authResponse | ConvertTo-Json)" -ForegroundColor White
    } catch {
        Write-Host "❌ Check Auth: FAILED" -ForegroundColor Red
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    }
    
} catch {
    Write-Host "❌ Login: FAILED" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🏁 API Testing Complete!" -ForegroundColor Green
Write-Host "Note: Some tests may fail if dependencies aren't met (like OTP verification)" -ForegroundColor Yellow
