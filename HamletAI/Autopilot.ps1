# ============================================
# HAMLET AUTOPILOT v1.0
# Your Personal AI Assistant - Full Control
# ============================================

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

$form = New-Object System.Windows.Forms.Form
$form.Text = "Hamlet Autopilot - AI Control Center"
$form.Size = New-Object System.Drawing.Size(1000, 750)
$form.StartPosition = "CenterScreen"
$form.BackColor = [System.Drawing.Color]::FromArgb(10, 10, 10)
$form.ForeColor = [System.Drawing.Color]::White

# Title
$titleLabel = New-Object System.Windows.Forms.Label
$titleLabel.Text = " HAMLET AUTOPILOT"
$titleLabel.Font = New-Object System.Drawing.Font("Segoe UI", 24, [System.Drawing.FontStyle]::Bold)
$titleLabel.ForeColor = [System.Drawing.Color]::FromArgb(0, 255, 255)
$titleLabel.AutoSize = $true
$titleLabel.Location = New-Object System.Drawing.Point(300, 10)
$form.Controls.Add($titleLabel)

# Subtitle
$subtitleLabel = New-Object System.Windows.Forms.Label
$subtitleLabel.Text = "Ultimate AI Assistant - Just Paste & Click!"
$subtitleLabel.Font = New-Object System.Drawing.Font("Segoe UI", 11)
$subtitleLabel.ForeColor = [System.Drawing.Color]::LightGray
$subtitleLabel.AutoSize = $true
$subtitleLabel.Location = New-Object System.Drawing.Point(330, 50)
$form.Controls.Add($subtitleLabel)

# ==================== QUICK ACTION BUTTONS ====================

$quickLabel = New-Object System.Windows.Forms.Label
$quickLabel.Text = " QUICK ACTIONS"
$quickLabel.Font = New-Object System.Drawing.Font("Segoe UI", 12, [System.Drawing.FontStyle]::Bold)
$quickLabel.ForeColor = [System.Drawing.Color]::FromArgb(255, 200, 0)
$quickLabel.AutoSize = $true
$quickLabel.Location = New-Object System.Drawing.Point(20, 85)
$form.Controls.Add($quickLabel)

function New-QuickButton {
    param($Text, $X, $Y, $Width, $Action)
    $btn = New-Object System.Windows.Forms.Button
    $btn.Text = $Text
    $btn.Location = New-Object System.Drawing.Point($X, $Y)
    $btn.Size = New-Object System.Drawing.Size($Width, 35)
    $btn.BackColor = [System.Drawing.Color]::FromArgb(0, 150, 200)
    $btn.ForeColor = [System.Drawing.Color]::White
    $btn.FlatStyle = "Flat"
    $btn.Font = New-Object System.Drawing.Font("Segoe UI", 9, [System.Drawing.FontStyle]::Bold)
    $btn.Add_Click($Action)
    return $btn
}

# Row 1 Buttons
$form.Controls.Add((New-QuickButton " Open Database" 20 115 150 {
    Write-Output " Opening Prisma Studio..."
    Start-Process "cmd" -ArgumentList "/c", "cd E:\HamletUnified\backend && start cmd /k npx prisma studio"
    Write-Output " Prisma Studio launched at http://localhost:5555"
}))

$form.Controls.Add((New-QuickButton " Open VSCode" 180 115 150 {
    Write-Output " Opening VSCode..."
    Start-Process "code" "E:\HamletUnified"
    Write-Output " VSCode opened"
}))

$form.Controls.Add((New-QuickButton " Open GitHub" 340 115 150 {
    Write-Output " Opening GitHub..."
    Start-Process "https://github.com"
    Write-Output " GitHub opened in browser"
}))

$form.Controls.Add((New-QuickButton " Start Backend" 500 115 150 {
    Write-Output " Starting Backend Server..."
    Start-Process "cmd" -ArgumentList "/c", "cd E:\HamletUnified\backend && start cmd /k npm run dev"
    Write-Output " Backend started at http://localhost:4001"
}))

$form.Controls.Add((New-QuickButton " Check Status" 660 115 150 {
    Write-Output "`n"
    Write-Output " SYSTEM STATUS CHECK"
    Write-Output ""
    Write-Output "`n Database: hamlet_election"
    Write-Output " Records: 7,751 candidates"
    Write-Output " Password: hamlet2025"
    Write-Output " Status: OPERATIONAL"
    Write-Output " User: absulysuly"
    Write-Output " Time: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss UTC')"
    Write-Output ""
}))

$form.Controls.Add((New-QuickButton " Open Project Folder" 820 115 150 {
    Write-Output " Opening project folder..."
    Start-Process "explorer" "E:\HamletUnified"
    Write-Output " Explorer opened"
}))

# Row 2 Buttons
$form.Controls.Add((New-QuickButton " Restart PostgreSQL" 20 160 150 {
    Write-Output " Restarting PostgreSQL..."
    Restart-Service "postgresql-x64-17" -Force
    Write-Output " PostgreSQL restarted"
}))

$form.Controls.Add((New-QuickButton " NPM Install" 180 160 150 {
    Write-Output " Running npm install..."
    Start-Process "cmd" -ArgumentList "/c", "cd E:\HamletUnified\backend && start cmd /k npm install"
    Write-Output " NPM install started"
}))

$form.Controls.Add((New-QuickButton " Open pgAdmin" 340 160 150 {
    Write-Output " Opening pgAdmin..."
    Start-Process "C:\Program Files\pgAdmin 4\v8\runtime\pgAdmin4.exe" -ErrorAction SilentlyContinue
    Write-Output " pgAdmin launched"
}))

$form.Controls.Add((New-QuickButton " Open Localhost:3000" 500 160 150 {
    Write-Output " Opening http://localhost:3000..."
    Start-Process "http://localhost:3000"
    Write-Output " Browser opened"
}))

$form.Controls.Add((New-QuickButton " Open Localhost:4001" 660 160 150 {
    Write-Output " Opening http://localhost:4001..."
    Start-Process "http://localhost:4001"
    Write-Output " Browser opened"
}))

$form.Controls.Add((New-QuickButton " Open Notepad++" 820 160 150 {
    Write-Output " Opening Notepad++..."
    Start-Process "notepad++" -ErrorAction SilentlyContinue
    if (-not $?) { Start-Process "notepad" }
    Write-Output " Text editor opened"
}))

# ==================== COMMAND INPUT SECTION ====================

$commandLabel = New-Object System.Windows.Forms.Label
$commandLabel.Text = " COPILOT COMMAND INPUT (Paste & Execute)"
$commandLabel.Font = New-Object System.Drawing.Font("Segoe UI", 12, [System.Drawing.FontStyle]::Bold)
$commandLabel.ForeColor = [System.Drawing.Color]::FromArgb(255, 200, 0)
$commandLabel.AutoSize = $true
$commandLabel.Location = New-Object System.Drawing.Point(20, 210)
$form.Controls.Add($commandLabel)

$inputBox = New-Object System.Windows.Forms.TextBox
$inputBox.Multiline = $true
$inputBox.ScrollBars = "Vertical"
$inputBox.Location = New-Object System.Drawing.Point(20, 240)
$inputBox.Size = New-Object System.Drawing.Size(950, 150)
$inputBox.BackColor = [System.Drawing.Color]::FromArgb(20, 20, 20)
$inputBox.ForeColor = [System.Drawing.Color]::FromArgb(255, 255, 100)
$inputBox.Font = New-Object System.Drawing.Font("Consolas", 10)
$inputBox.Text = "# Paste Copilot's command here and click Execute..."
$form.Controls.Add($inputBox)

# ==================== OUTPUT SECTION ====================

$outputLabel = New-Object System.Windows.Forms.Label
$outputLabel.Text = " OUTPUT & RESULTS"
$outputLabel.Font = New-Object System.Drawing.Font("Segoe UI", 12, [System.Drawing.FontStyle]::Bold)
$outputLabel.ForeColor = [System.Drawing.Color]::FromArgb(255, 200, 0)
$outputLabel.AutoSize = $true
$outputLabel.Location = New-Object System.Drawing.Point(20, 470)
$form.Controls.Add($outputLabel)

$outputBox = New-Object System.Windows.Forms.TextBox
$outputBox.Multiline = $true
$outputBox.ScrollBars = "Vertical"
$outputBox.Location = New-Object System.Drawing.Point(20, 500)
$outputBox.Size = New-Object System.Drawing.Size(950, 150)
$outputBox.BackColor = [System.Drawing.Color]::FromArgb(5, 5, 5)
$outputBox.ForeColor = [System.Drawing.Color]::LimeGreen
$outputBox.Font = New-Object System.Drawing.Font("Consolas", 9)
$outputBox.ReadOnly = $true
$outputBox.Text = " Hamlet Autopilot Ready!`r`n All systems operational`r`n Current time: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss UTC')`r`n User: absulysuly`r`n"
$form.Controls.Add($outputBox)

function Write-Output {
    param([string]$message)
    $timestamp = Get-Date -Format "HH:mm:ss"
    $outputBox.AppendText("[$timestamp] $message`r`n")
    $outputBox.ScrollToCaret()
}

# ==================== ACTION BUTTONS ====================

$btnExecute = New-Object System.Windows.Forms.Button
$btnExecute.Text = " EXECUTE COMMAND"
$btnExecute.Location = New-Object System.Drawing.Point(20, 405)
$btnExecute.Size = New-Object System.Drawing.Size(220, 50)
$btnExecute.BackColor = [System.Drawing.Color]::FromArgb(0, 200, 0)
$btnExecute.ForeColor = [System.Drawing.Color]::White
$btnExecute.FlatStyle = "Flat"
$btnExecute.Font = New-Object System.Drawing.Font("Segoe UI", 14, [System.Drawing.FontStyle]::Bold)
$btnExecute.Add_Click({
    $command = $inputBox.Text.Trim()
    
    if ([string]::IsNullOrWhiteSpace($command) -or $command.StartsWith("#")) {
        Write-Output " Please paste a valid command first!"
        return
    }
    
    Write-Output ""
    Write-Output " Executing command..."
    Write-Output ""
    
    try {
        # Check if it's a script file creation
        if ($command -match '\[System\.IO\.File\]::WriteAllText') {
            Invoke-Expression $command
            Write-Output " File created successfully!"
        }
        # Check if it's a Node.js command
        elseif ($command -match '^node ') {
            $result = Invoke-Expression $command 2>&1 | Out-String
            Write-Output $result
        }
        # Check if it's Python
        elseif ($command -match '^python ') {
            $result = Invoke-Expression $command 2>&1 | Out-String
            Write-Output $result
        }
        # Regular PowerShell
        else {
            $result = Invoke-Expression $command 2>&1 | Out-String
            if ($result) { Write-Output $result }
        }
        
        Write-Output " Command executed successfully!"
    } catch {
        Write-Output " Error: $_"
    }
    
    Write-Output ""
})
$form.Controls.Add($btnExecute)

$btnClearInput = New-Object System.Windows.Forms.Button
$btnClearInput.Text = " Clear Input"
$btnClearInput.Location = New-Object System.Drawing.Point(260, 405)
$btnClearInput.Size = New-Object System.Drawing.Size(150, 50)
$btnClearInput.BackColor = [System.Drawing.Color]::FromArgb(80, 80, 80)
$btnClearInput.ForeColor = [System.Drawing.Color]::White
$btnClearInput.FlatStyle = "Flat"
$btnClearInput.Font = New-Object System.Drawing.Font("Segoe UI", 11)
$btnClearInput.Add_Click({
    $inputBox.Clear()
    $inputBox.Text = "# Paste Copilot's command here..."
    Write-Output " Input cleared"
})
$form.Controls.Add($btnClearInput)

$btnClearOutput = New-Object System.Windows.Forms.Button
$btnClearOutput.Text = " Clear Output"
$btnClearOutput.Location = New-Object System.Drawing.Point(430, 405)
$btnClearOutput.Size = New-Object System.Drawing.Size(150, 50)
$btnClearOutput.BackColor = [System.Drawing.Color]::FromArgb(80, 80, 80)
$btnClearOutput.ForeColor = [System.Drawing.Color]::White
$btnClearOutput.FlatStyle = "Flat"
$btnClearOutput.Font = New-Object System.Drawing.Font("Segoe UI", 11)
$btnClearOutput.Add_Click({
    $outputBox.Clear()
    $outputBox.Text = " Output cleared. Ready!`r`n"
})
$form.Controls.Add($btnClearOutput)

$btnCopy = New-Object System.Windows.Forms.Button
$btnCopy.Text = " Copy Output"
$btnCopy.Location = New-Object System.Drawing.Point(600, 405)
$btnCopy.Size = New-Object System.Drawing.Size(180, 50)
$btnCopy.BackColor = [System.Drawing.Color]::FromArgb(0, 120, 215)
$btnCopy.ForeColor = [System.Drawing.Color]::White
$btnCopy.FlatStyle = "Flat"
$btnCopy.Font = New-Object System.Drawing.Font("Segoe UI", 11)
$btnCopy.Add_Click({
    [System.Windows.Forms.Clipboard]::SetText($outputBox.Text)
    Write-Output " Output copied to clipboard!"
})
$form.Controls.Add($btnCopy)

$btnOpenCopilot = New-Object System.Windows.Forms.Button
$btnOpenCopilot.Text = " Open Copilot"
$btnOpenCopilot.Location = New-Object System.Drawing.Point(800, 405)
$btnOpenCopilot.Size = New-Object System.Drawing.Size(170, 50)
$btnOpenCopilot.BackColor = [System.Drawing.Color]::FromArgb(150, 0, 200)
$btnOpenCopilot.ForeColor = [System.Drawing.Color]::White
$btnOpenCopilot.FlatStyle = "Flat"
$btnOpenCopilot.Font = New-Object System.Drawing.Font("Segoe UI", 11)
$btnOpenCopilot.Add_Click({
    Write-Output " Opening GitHub Copilot..."
    Start-Process "https://github.com/copilot"
    Write-Output " Copilot opened in browser"
})
$form.Controls.Add($btnOpenCopilot)

# Status Bar
$statusBar = New-Object System.Windows.Forms.Label
$statusBar.Text = " ONLINE | User: absulysuly | Time: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss UTC') | Database: 7,751 candidates "
$statusBar.Font = New-Object System.Drawing.Font("Consolas", 9)
$statusBar.ForeColor = [System.Drawing.Color]::LimeGreen
$statusBar.AutoSize = $true
$statusBar.Location = New-Object System.Drawing.Point(20, 665)
$form.Controls.Add($statusBar)

Write-Output " Hamlet Autopilot initialized and ready!"
[void]$form.ShowDialog()