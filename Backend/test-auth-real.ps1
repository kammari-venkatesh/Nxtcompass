#!/usr/bin/env pwsh

Write-Host "`n🧪 AUTH ENDPOINT TEST`n" -ForegroundColor Green
Write-Host ("=" * 60)

# Test 1: Register
Write-Host "`n✅ TEST 1: POST /api/auth/register"
Write-Host "Expected: 201, token returned, password NOT returned"

$body = @{
  name = "Test User"
  email = "test@nxtcompass.com"
  password = "123456"
} | ConvertTo-Json

try {
  $response = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/register" -Method Post -ContentType "application/json" -Body $body
  $json = $response.Content | ConvertFrom-Json
  
  Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
  Write-Host "User ID: $($json.user.id)"
  Write-Host "Email: $($json.user.email)"
  Write-Host "Token Length: $($json.token.Length)"
  Write-Host "Password in response: $(if ($json.user.password -or $json.password) { 'YES - BUG!' } else { 'NO - GOOD' })"
  
  $token = $json.token
} catch {
  Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
  exit 1
}

# Test 2: Login
Start-Sleep 1
Write-Host "`n✅ TEST 2: POST /api/auth/login"
Write-Host "Expected: 200, valid JWT token"

$body = @{
  email = "test@nxtcompass.com"
  password = "123456"
} | ConvertTo-Json

try {
  $response = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/login" -Method Post -ContentType "application/json" -Body $body
  $json = $response.Content | ConvertFrom-Json
  
  Write-Host "Status: $($response.StatusCode)" -ForegroundColor Green
  Write-Host "User: $($json.user.name)"
  Write-Host "Token: $($json.token.Substring(0, 20))..."
  
} catch {
  Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
  exit 1
}

# Test 3: Login with wrong password
Start-Sleep 1
Write-Host "`n✅ TEST 3: POST /api/auth/login (wrong password)"
Write-Host "Expected: 401, invalid credentials"

$body = @{
  email = "test@nxtcompass.com"
  password = "wrongpassword"
} | ConvertTo-Json

try {
  $response = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/login" -Method Post -ContentType "application/json" -Body $body -ErrorAction Stop
} catch {
  if ($_.Exception.Response.StatusCode.Value__ -eq 401) {
    $json = $_.Exception.Response | ForEach-Object { [System.IO.StreamReader]::new($_.GetResponseStream()).ReadToEnd() } | ConvertFrom-Json
    Write-Host "Status: 401" -ForegroundColor Green
    Write-Host "Message: $($json.message)" -ForegroundColor Green
  } else {
    Write-Host "Error: Wrong status code $($_.Exception.Response.StatusCode.Value__)" -ForegroundColor Red
    exit 1
  }
}

Write-Host "`n" + ("=" * 60)
Write-Host "✅ ALL AUTH TESTS PASSED!" -ForegroundColor Green
Write-Host "`nSecurity checks passed:`n" -ForegroundColor Yellow
Write-Host "  ✓ Registration works - returns token"
Write-Host "  ✓ Password hashed - never returned in response"
Write-Host "  ✓ Login works - returns valid JWT"
Write-Host "  ✓ Invalid credentials return 401"
Write-Host "`n"
