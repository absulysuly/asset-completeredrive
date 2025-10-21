# ============================================
# HAMLET COMMAND EXECUTOR v1.0
# Smart Agent for Automated Command Execution
# ============================================

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

# Create the main form
$form = New-Object System.Windows.Forms.Form
$form.Text = "Hamlet Command Executor"
$form.Size = New-Object System.Drawing.Size(800, 600)
$form.StartPosition = "CenterScreen"
$form.BackColor = [System.Drawing.Color]::FromArgb(20, 20, 20)
$form.ForeColor = [System.Drawing.Color]::White

# Title Label
$titleLabel = New-Object System.Windows.Forms.Label
$titleLabel.Text = " HAMLET COMMAND EXECUTOR"
$titleLabel.Font = New-Object System.Drawing.Font("Segoe UI", 18, [System.Drawing.FontStyle]::Bold)
$titleLabel.ForeColor = [System.Drawing.Color]::FromArgb(0, 255, 100)
$titleLabel.AutoSize = $true
$titleLabel.Location = New-Object System.Drawing.Point(200, 15)
$form.Controls.Add($titleLabel)

# Subtitle
$subtitleLabel = New-Object System.Windows.Forms.Label
$subtitleLabel.Text = "Paste Copilot's commands below and click Execute!"
$subtitleLabel.Font = New-Object System.Drawing.Font("Segoe UI", 10)
$subtitleLabel.ForeColor = [System.Drawing.Color]::LightGray
$subtitleLabel.AutoSize = $true
$subtitleLabel.Location = New-Object System.Drawing.Point(220, 50)
$form.Controls.Add($subtitleLabel)

# Input Label
$inputLabel = New-Object System.Windows.Forms.Label
$inputLabel.Text = " PASTE COMMAND HERE:"
$inputLabel.Font = New-Object System.Drawing.Font("Segoe UI", 11, [System.Drawing.FontStyle]::Bold)
$inputLabel.ForeColor = [System.Drawing.Color]::Cyan
$inputLabel.AutoSize = $true
$inputLabel.Location = New-Object System.Drawing.Point(20, 85)
$form.Controls.Add($inputLabel)

# Input TextBox (for commands)
$inputBox = New-Object System.Windows.Forms.TextBox
$inputBox.Multiline = $true
$inputBox.ScrollBars = "Vertical"
$inputBox.Location = New-Object System.Drawing.Point(20, 110)
$inputBox.Size = New-Object System.Drawing.Size(750, 150)
$inputBox.BackColor = [System.Drawing.Color]::FromArgb(30, 30, 30)
$inputBox.ForeColor = [System.Drawing.Color]::Yellow
$inputBox.Font = New-Object System.Drawing.Font("Consolas", 10)
$inputBox.Text = "# Paste Copilot's PowerShell command here...`r`n# Example: Write-Host 'Hello World' -ForegroundColor Green"
$form.Controls.Add($inputBox)

# Output Label
$outputLabel = New-Object System.Windows.Forms.Label
$outputLabel.Text = " OUTPUT:"
$outputLabel.Font = New-Object System.Drawing.Font("Segoe UI", 11, [System.Drawing.FontStyle]::Bold)
$outputLabel.ForeColor = [System.Drawing.Color]::Cyan
$outputLabel.AutoSize = $true
$outputLabel.Location = New-Object System.Drawing.Point(20, 330)
$form.Controls.Add($outputLabel)

# Output TextBox (for results)
$outputBox = New-Object System.Windows.Forms.TextBox
$outputBox.Multiline = $true
$outputBox.ScrollBars = "Vertical"
$outputBox.Location = New-Object System.Drawing.Point(20, 355)
$outputBox.Size = New-Object System.Drawing.Size(750, 150)
$outputBox.BackColor = [System.Drawing.Color]::FromArgb(10, 10, 10)
$outputBox.ForeColor = [System.Drawing.Color]::LimeGreen
$outputBox.Font = New-Object System.Drawing.Font("Consolas", 9)
$outputBox.ReadOnly = $true
$outputBox.Text = " Executor ready! Waiting for commands...`r`n"
$form.Controls.Add($outputBox)

# Function to write output
function Write-Output {
    param([string]$message, [string]$color = "White")
    $timestamp = Get-Date -Format "HH:mm:ss"
    $outputBox.AppendText("[$timestamp] $message`r`n")
    $outputBox.ScrollToCaret()
}

# Execute Button
$btnExecute = New-Object System.Windows.Forms.Button
$btnExecute.Text = " EXECUTE COMMAND"
$btnExecute.Location = New-Object System.Drawing.Point(20, 275)
$btnExecute.Size = New-Object System.Drawing.Size(200, 45)
$btnExecute.BackColor = [System.Drawing.Color]::FromArgb(0, 200, 0)
$btnExecute.ForeColor = [System.Drawing.Color]::White
$btnExecute.FlatStyle = "Flat"
$btnExecute.Font = New-Object System.Drawing.Font("Segoe UI", 12, [System.Drawing.FontStyle]::Bold)
$btnExecute.Add_Click({
    $command = $inputBox.Text.Trim()
    
    if ([string]::IsNullOrWhiteSpace($command) -or $command.StartsWith("#")) {
        Write-Output " Please paste a valid command first!" "Yellow"
        return
    }
    
    Write-Output "" "Cyan"
    Write-Output " Executing command..." "Cyan"
    Write-Output "" "Cyan"
    
    try {
        # Execute the command and capture output
        $result = Invoke-Expression $command 2>&1 | Out-String
        
        if ($result) {
            Write-Output $result "Green"
        }
        
        Write-Output " Command executed successfully!" "Green"
    } catch {
        Write-Output " Error: $_" "Red"
    }
    
    Write-Output "" "Gray"
})
$form.Controls.Add($btnExecute)

# Clear Input Button
$btnClearInput = New-Object System.Windows.Forms.Button
$btnClearInput.Text = " Clear Input"
$btnClearInput.Location = New-Object System.Drawing.Point(240, 275)
$btnClearInput.Size = New-Object System.Drawing.Size(150, 45)
$btnClearInput.BackColor = [System.Drawing.Color]::FromArgb(100, 100, 100)
$btnClearInput.ForeColor = [System.Drawing.Color]::White
$btnClearInput.FlatStyle = "Flat"
$btnClearInput.Font = New-Object System.Drawing.Font("Segoe UI", 10)
$btnClearInput.Add_Click({
    $inputBox.Clear()
    $inputBox.Text = "# Paste Copilot's PowerShell command here..."
    Write-Output " Input cleared" "Gray"
})
$form.Controls.Add($btnClearInput)

# Clear Output Button
$btnClearOutput = New-Object System.Windows.Forms.Button
$btnClearOutput.Text = " Clear Output"
$btnClearOutput.Location = New-Object System.Drawing.Point(410, 275)
$btnClearOutput.Size = New-Object System.Drawing.Size(150, 45)
$btnClearOutput.BackColor = [System.Drawing.Color]::FromArgb(100, 100, 100)
$btnClearOutput.ForeColor = [System.Drawing.Color]::White
$btnClearOutput.FlatStyle = "Flat"
$btnClearOutput.Font = New-Object System.Drawing.Font("Segoe UI", 10)
$btnClearOutput.Add_Click({
    $outputBox.Clear()
    $outputBox.Text = " Output cleared. Ready for new commands!`r`n"
})
$form.Controls.Add($btnClearOutput)

# Copy Output Button
$btnCopyOutput = New-Object System.Windows.Forms.Button
$btnCopyOutput.Text = " Copy Output"
$btnCopyOutput.Location = New-Object System.Drawing.Point(580, 275)
$btnCopyOutput.Size = New-Object System.Drawing.Size(190, 45)
$btnCopyOutput.BackColor = [System.Drawing.Color]::FromArgb(0, 120, 215)
$btnCopyOutput.ForeColor = [System.Drawing.Color]::White
$btnCopyOutput.FlatStyle = "Flat"
$btnCopyOutput.Font = New-Object System.Drawing.Font("Segoe UI", 10)
$btnCopyOutput.Add_Click({
    [System.Windows.Forms.Clipboard]::SetText($outputBox.Text)
    Write-Output " Output copied to clipboard!" "Cyan"
})
$form.Controls.Add($btnCopyOutput)

# Status Bar
$statusBar = New-Object System.Windows.Forms.Label
$statusBar.Text = " Ready | User: absulysuly | Time: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss UTC')"
$statusBar.Font = New-Object System.Drawing.Font("Consolas", 9)
$statusBar.ForeColor = [System.Drawing.Color]::LightGreen
$statusBar.AutoSize = $true
$statusBar.Location = New-Object System.Drawing.Point(20, 520)
$form.Controls.Add($statusBar)

# Help text
$helpLabel = New-Object System.Windows.Forms.Label
$helpLabel.Text = " TIP: Copy commands from Copilot  Paste here  Click Execute  Done!"
$helpLabel.Font = New-Object System.Drawing.Font("Segoe UI", 9, [System.Drawing.FontStyle]::Italic)
$helpLabel.ForeColor = [System.Drawing.Color]::Orange
$helpLabel.AutoSize = $true
$helpLabel.Location = New-Object System.Drawing.Point(180, 545)
$form.Controls.Add($helpLabel)

# Show the form
Write-Output " Hamlet Command Executor initialized!" "Green"
[void]$form.ShowDialog()