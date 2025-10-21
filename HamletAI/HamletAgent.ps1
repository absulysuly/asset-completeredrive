# ============================================
# HAMLET AI ASSISTANT v2.0
# Permanent Desktop Agent
# ============================================

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

# Create the main form
$form = New-Object System.Windows.Forms.Form
$form.Text = "Hamlet AI Assistant"
$form.Size = New-Object System.Drawing.Size(600, 500)
$form.StartPosition = "CenterScreen"
$form.BackColor = [System.Drawing.Color]::FromArgb(30, 30, 30)
$form.ForeColor = [System.Drawing.Color]::White

# Title Label
$titleLabel = New-Object System.Windows.Forms.Label
$titleLabel.Text = "🤖 HAMLET AI ASSISTANT"
$titleLabel.Font = New-Object System.Drawing.Font("Segoe UI", 16, [System.Drawing.FontStyle]::Bold)
$titleLabel.ForeColor = [System.Drawing.Color]::FromArgb(0, 200, 255)
$titleLabel.AutoSize = $true
$titleLabel.Location = New-Object System.Drawing.Point(150, 20)
$form.Controls.Add($titleLabel)

# Subtitle
$subtitleLabel = New-Object System.Windows.Forms.Label
$subtitleLabel.Text = "Your Technical Assistant - Always Ready"
$subtitleLabel.Font = New-Object System.Drawing.Font("Segoe UI", 9)
$subtitleLabel.ForeColor = [System.Drawing.Color]::LightGray
$subtitleLabel.AutoSize = $true
$subtitleLabel.Location = New-Object System.Drawing.Point(180, 55)
$form.Controls.Add($subtitleLabel)

# Output TextBox
$outputBox = New-Object System.Windows.Forms.TextBox
$outputBox.Multiline = $true
$outputBox.ScrollBars = "Vertical"
$outputBox.Location = New-Object System.Drawing.Point(20, 90)
$outputBox.Size = New-Object System.Drawing.Size(550, 250)
$outputBox.BackColor = [System.Drawing.Color]::FromArgb(20, 20, 20)
$outputBox.ForeColor = [System.Drawing.Color]::LimeGreen
$outputBox.Font = New-Object System.Drawing.Font("Consolas", 9)
$outputBox.ReadOnly = $true
$outputBox.Text = "✅ Agent initialized and ready!`r`n`r`n📊 DATABASE STATUS:`r`n  • Database: hamlet_election`r`n  • Candidates: 7,751 imported`r`n  • Password: hamlet2025`r`n`r`nSelect a task from the buttons below...`r`n"
$form.Controls.Add($outputBox)

# Function to append output
function Write-Output {
    param([string]$message)
    $outputBox.AppendText("$message`r`n")
    $outputBox.ScrollToCaret()
}

# Button styling function
function New-StyledButton {
    param(
        [string]$Text,
        [int]$X,
        [int]$Y,
        [scriptblock]$ClickAction
    )
    
    $button = New-Object System.Windows.Forms.Button
    $button.Text = $Text
    $button.Location = New-Object System.Drawing.Point($X, $Y)
    $button.Size = New-Object System.Drawing.Size(170, 40)
    $button.BackColor = [System.Drawing.Color]::FromArgb(0, 120, 215)
    $button.ForeColor = [System.Drawing.Color]::White
    $button.FlatStyle = "Flat"
    $button.Font = New-Object System.Drawing.Font("Segoe UI", 9, [System.Drawing.FontStyle]::Bold)
    $button.Add_Click($ClickAction)
    return $button
}

# Button: Re-Import Data
$btnReImport = New-StyledButton -Text "📥 Re-Import Data" -X 20 -Y 360 -ClickAction {
    Write-Output "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    Write-Output "📥 Re-importing candidates..."
    Write-Output "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    Set-Location "E:\HamletUnified\backend"
    $output = & node import_candidates.js 2>&1 | Out-String
    Write-Output $output
}
$form.Controls.Add($btnReImport)

# Button: Check Status
$btnCheckStatus = New-StyledButton -Text "📊 Check Status" -X 210 -Y 360 -ClickAction {
    Write-Output "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    Write-Output "📊 PROJECT STATUS CHECK"
    Write-Output "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    Write-Output "`n📁 Checking folders..."
    $folders = @(
        "E:\HamletUnified\backend",
        "E:\HamletUnified\scripts",
        "E:\HamletUnified\data"
    )
    foreach ($folder in $folders) {
        if (Test-Path $folder) {
            Write-Output "  ✅ $folder"
        } else {
            Write-Output "  ❌ $folder (missing)"
        }
    }
    
    Write-Output "`n📄 Checking files..."
    $files = @(
        "E:\HamletUnified\backend\.env",
        "E:\HamletUnified\backend\prisma\schema.prisma",
        "E:\HamletUnified\data\candidates_production_ready.json"
    )
    foreach ($file in $files) {
        if (Test-Path $file) {
            $size = (Get-Item $file).Length
            Write-Output "  ✅ $file ($size bytes)"
        } else {
            Write-Output "  ❌ $file (missing)"
        }
    }
    
    Write-Output "`n🗄️ Checking PostgreSQL..."
    $pgService = Get-Service -Name "postgresql-x64-17" -ErrorAction SilentlyContinue
    if ($pgService -and $pgService.Status -eq 'Running') {
        Write-Output "  ✅ PostgreSQL is running"
    } else {
        Write-Output "  ❌ PostgreSQL not running"
    }
    
    Write-Output "`n✅ Status check complete!"
}
$form.Controls.Add($btnCheckStatus)

# Button: Open Prisma Studio
$btnPrismaStudio = New-StyledButton -Text "🎨 Open Database" -X 400 -Y 360 -ClickAction {
    Write-Output "`n🎨 Opening Prisma Studio..."
    Write-Output "Browser will open at http://localhost:5555"
    Set-Location "E:\HamletUnified\backend"
    Start-Process "cmd" -ArgumentList "/c", "start", "cmd", "/k", "npx prisma studio"
}
$form.Controls.Add($btnPrismaStudio)

# Button: Start Backend
$btnStartBackend = New-StyledButton -Text "🚀 Start Backend" -X 20 -Y 410 -ClickAction {
    Write-Output "`n🚀 Starting backend server..."
    Write-Output "Server will run at http://localhost:4001"
    Set-Location "E:\HamletUnified\backend"
    Start-Process "cmd" -ArgumentList "/c", "start", "cmd", "/k", "npm run dev"
    Write-Output "✅ Backend started in new window"
}
$form.Controls.Add($btnStartBackend)

# Button: Fix Files
$btnFixFiles = New-StyledButton -Text "🔧 Fix Config" -X 210 -Y 410 -ClickAction {
    Write-Output "`n🔧 Fixing configuration files..."
    
    # Fix .env
    $envContent = @"
DATABASE_URL="postgresql://postgres:hamlet2025@localhost:5432/hamlet_election?schema=public"
JWT_SECRET=your-super-secret-jwt-key-change-in-production-f8d9a7b6c5e4d3a2
NEXTAUTH_SECRET=your-nextauth-secret-key-a1b2c3d4e5f6g7h8i9j0
NEXTAUTH_URL=http://localhost:3000
NODE_ENV=development
PORT=4001
"@
    Set-Content -Path "E:\HamletUnified\backend\.env" -Value $envContent -NoNewline
    Write-Output "✅ .env file updated"
    
    Write-Output "`n✅ All files fixed!"
}
$form.Controls.Add($btnFixFiles)

# Button: Clear Output
$btnClear = New-StyledButton -Text "🗑️ Clear Output" -X 400 -Y 410 -ClickAction {
    $outputBox.Clear()
    $outputBox.AppendText("✅ Output cleared. Ready for new tasks!`r`n")
}
$form.Controls.Add($btnClear)

# Show the form
[void]$form.ShowDialog()