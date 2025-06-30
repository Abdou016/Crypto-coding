<#
.SYNOPSIS
Text Encryption/Decryption Tool for PowerShell

.DESCRIPTION
Supports: Caesar, Vigenère, Rail Fence, RC4 ciphers and hashing
#>

function Show-Menu {
    Clear-Host
    Write-Host "================ TEST YOUR CRYPTO WITH ABDOU ================" -ForegroundColor Cyan
    Write-Host "1. Caesar Cipher"
    Write-Host "2. Vigenère Cipher"
    Write-Host "3. Rail Fence Cipher"
    Write-Host "4. RC4 Cipher"
    Write-Host "5. Hash Functions"
    Write-Host "Q. Quit"
    Write-Host "============================================" -ForegroundColor Cyan
}

function Invoke-CaesarCipher {
    param(
        [string]$Text,
        [int]$Shift,
        [switch]$Decrypt
    )
    
    if ($Decrypt) { $Shift = -$Shift }
    
    $result = foreach ($char in $Text.ToCharArray()) {
        if (-not [char]::IsLetter($char)) {
            $char
            continue
        }
        
        $base = if ([char]::IsUpper($char)) { 65 } else { 97 }
        $code = [int][char]$char
        $newCode = ($code - $base + $Shift) % 26
        if ($newCode -lt 0) { $newCode += 26 }
        [char]($newCode + $base)
    }
    
    -join $result
}

function Invoke-VigenereCipher {
    param(
        [string]$Text,
        [string]$Key,
        [switch]$Decrypt
    )
    
    $Key = $Key.ToUpper()
    $keyIndex = 0
    $result = foreach ($char in $Text.ToCharArray()) {
        if (-not [char]::IsLetter($char)) {
            $char
            continue
        }
        
        $base = if ([char]::IsUpper($char)) { 65 } else { 97 }
        $keyChar = $Key[$keyIndex % $Key.Length]
        $shift = [int][char]$keyChar - 65
        if ($Decrypt) { $shift = -$shift }
        
        $keyIndex++
        $code = [int][char]$char
        $newCode = ($code - $base + $shift) % 26
        if ($newCode -lt 0) { $newCode += 26 }
        [char]($newCode + $base)
    }
    
    -join $result
}

function Invoke-RailFenceCipher {
    param(
        [string]$Text,
        [int]$Rails,
        [switch]$Decrypt
    )
    
    if ($Decrypt) {
        # Simplified decryption (not fully implemented)
        Write-Warning "Rail Fence decryption is not fully implemented in this version"
        return $Text
    }
    
    $fence = @(1..$Rails | ForEach-Object { @() })
    $rail = 0
    $direction = 1
    
    foreach ($char in $Text.ToCharArray()) {
        $fence[$rail] += $char
        $rail += $direction
        if ($rail -eq $Rails - 1 -or $rail -eq 0) { $direction = -$direction }
    }
    
    -join ($fence | ForEach-Object { -join $_ })
}

function Invoke-RC4 {
    param(
        [string]$Text,
        [string]$Key,
        [switch]$Decrypt
    )
    
    # RC4 is symmetric - same for encrypt/decrypt
    [byte[]]$S = 0..255
    $j = 0
    
    # Key-scheduling algorithm
    for ($i = 0; $i -lt 256; $i++) {
        $j = ($j + $S[$i] + [byte][char]$Key[$i % $Key.Length]) % 256
        $S[$i], $S[$j] = $S[$j], $S[$i]
    }
    
    # Pseudo-random generation algorithm
    $i = $j = 0
    $result = foreach ($char in $Text.ToCharArray()) {
        $i = ($i + 1) % 256
        $j = ($j + $S[$i]) % 256
        $S[$i], $S[$j] = $S[$j], $S[$i]
        $K = $S[($S[$i] + $S[$j]) % 256]
        [char]([byte][char]$char -bxor $K)
    }
    
    -join $result
}

function Get-TextHash {
    param(
        [string]$Text,
        [ValidateSet("MD5","SHA1","SHA256")]
        [string]$Algorithm
    )
    
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($Text)
    $hash = switch ($Algorithm) {
        "MD5"    { [System.Security.Cryptography.MD5]::Create().ComputeHash($bytes) }
        "SHA1"   { [System.Security.Cryptography.SHA1]::Create().ComputeHash($bytes) }
        "SHA256" { [System.Security.Cryptography.SHA256]::Create().ComputeHash($bytes) }
    }
    
    -join ($hash | ForEach-Object { $_.ToString("x2") })
}

# Main program loop
do {
    Show-Menu
    $choice = Read-Host "Select operation (1-5 or Q)"
    
    switch ($choice) {
        '1' {
            $text = Read-Host "Enter text"
            $shift = Read-Host "Enter shift value"
            $action = Read-Host "Encrypt (E) or Decrypt (D)"
            
            $result = Invoke-CaesarCipher -Text $text -Shift $shift -Decrypt:($action -eq 'D')
            Write-Host "Result: $result" -ForegroundColor Green
            Pause
        }
        '2' {
            $text = Read-Host "Enter text"
            $key = Read-Host "Enter key"
            $action = Read-Host "Encrypt (E) or Decrypt (D)"
            
            $result = Invoke-VigenereCipher -Text $text -Key $key -Decrypt:($action -eq 'D')
            Write-Host "Result: $result" -ForegroundColor Green
            Pause
        }
        '3' {
            $text = Read-Host "Enter text"
            $rails = Read-Host "Enter number of rails"
            $action = Read-Host "Encrypt (E) or Decrypt (D)"
            
            $result = Invoke-RailFenceCipher -Text $text -Rails $rails -Decrypt:($action -eq 'D')
            Write-Host "Result: $result" -ForegroundColor Green
            Pause
        }
        '4' {
            $text = Read-Host "Enter text"
            $key = Read-Host "Enter key"
            $action = Read-Host "Encrypt (E) or Decrypt (D)"
            
            $result = Invoke-RC4 -Text $text -Key $key -Decrypt:($action -eq 'D')
            Write-Host "Result: $result" -ForegroundColor Green
            Pause
        }
        '5' {
            $text = Read-Host "Enter text"
            $algorithm = Read-Host "Select algorithm (MD5, SHA1, SHA256)"
            
            $result = Get-TextHash -Text $text -Algorithm $algorithm
            Write-Host "$algorithm Hash: $result" -ForegroundColor Green
            Pause
        }
        'Q' { exit }
        default { Write-Host "Invalid selection" -ForegroundColor Red }
    }
} while ($true)
