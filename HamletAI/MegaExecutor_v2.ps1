Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

$form = New-Object System.Windows.Forms.Form
$form.Text = "Hamlet Mega Executor v2.0"
$form.Size = New-Object System.Drawing.Size(1100, 800)
$form.StartPosition = "CenterScreen"
$form.BackColor = [System.Drawing.Color]::FromArgb(10, 10, 10)

$titleLabel = New-Object System.Windows.Forms.Label
$titleLabel.Text = "HAMLET MEGA EXECUTOR v2.0"
$titleLabel.Font = New-Object System.Drawing.Font("Segoe UI", 22, [System.Drawing.FontStyle]::Bold)
$titleLabel.ForeColor = [System.Drawing.Color]::FromArgb(0, 255, 200)
$titleLabel.AutoSize = $true
$titleLabel.Location = New-Object System.Drawing.Point(280, 15)
$form.Controls.Add($titleLabel)

$subtitleLabel = New-Object System.Windows.Forms.Label
$subtitleLabel.Text = "Paste ANYTHING from Copilot - No Limits!"
$subtitleLabel.Font = New-Object System.Drawing.Font("Segoe UI", 11)
$subtitleLabel.ForeColor = [System.Drawing.Color]::LimeGreen
$subtitleLabel.AutoSize = $true
$subtitleLabel.Location = New-Object System.Drawing.Point(300, 55)
$form.Controls.Add($subtitleLabel)

$inputLabel = New-Object System.Windows.Forms.Label
$inputLabel.Text = "PASTE COPILOT COMMAND (Any Size):"
$inputLabel.Font = New-Object System.Drawing.Font("Segoe UI", 11, [System.Drawing.FontStyle]::Bold)
$inputLabel.ForeColor = [System.Drawing.Color]::Yellow
$inputLabel.AutoSize = $true
$inputLabel.Location = New-Object System.Drawing.Point(20, 95)
$form.Controls.Add($inputLabel)

$inputBox = New-Object System.Windows.Forms.TextBox
$inputBox.Multiline = $true
$inputBox.ScrollBars = "Vertical"
$inputBox.Location = New-Object System.Drawing.Point(20, 125)
$inputBox.Size = New-Object System.Drawing.Size(1050, 250)
$inputBox.BackColor = [System.Drawing.Color]::FromArgb(20, 20, 20)
$inputBox.ForeColor = [System.Drawing.Color]::FromArgb(255, 255, 100)
$inputBox.Font = New-Object System.Drawing.Font("Consolas", 9)
$inputBox.Text = "# Ready! Paste ANY command from Copilot here...`r`n# Even 1000+ line scripts work!"
$form.Controls.Add($inputBox)

$outputLabel = New-Object System.Windows.Forms.Label
$outputLabel.Text = "OUTPUT & RESULTS:"
$outputLabel.Font = New-Object System.Drawing.Font("Segoe UI", 11, [System.Drawing.FontStyle]::Bold)
$outputLabel.ForeColor = [System.Drawing.Color]::Cyan
$outputLabel.AutoSize = $true
$outputLabel.Location = New-Object System.Drawing.Point(20, 510)
$form.Controls.Add($outputLabel)

$outputBox = New-Object System.Windows.Forms.TextBox
$outputBox.Multiline = $true
$outputBox.ScrollBars = "Vertical"
$outputBox.Location = New-Object System.Drawing.Point(20, 540)
$outputBox.Size = New-Object System.Drawing.Size(1050, 180)
$outputBox.BackColor = [System.Drawing.Color]::FromArgb(5, 5, 5)
$outputBox.ForeColor = [System.Drawing.Color]::LimeGreen
$outputBox.Font = New-Object System.Drawing.Font("Consolas", 9)
$outputBox.ReadOnly = $true
$outputBox.Text = "Mega Executor v2.0 Ready!`r`nTime: " + (Get-Date -Format 'yyyy-MM-dd HH:mm:ss UTC') + "`r`nUser: absulysuly`r`n`r`nReady for commands!`r`n"
$form.Controls.Add($outputBox)

function Write-Output {
    param([string]$message)
    $timestamp = Get-Date -Format "HH:mm:ss"
    $outputBox.AppendText("[$timestamp] $message`r`n")
    $outputBox.ScrollToCaret()
    [System.Windows.Forms.Application]::DoEvents()
}

$btnExecute = New-Object System.Windows.Forms.Button
$btnExecute.Text = "EXECUTE"
$btnExecute.Location = New-Object System.Drawing.Point(20, 390)
$btnExecute.Size = New-Object System.Drawing.Size(250, 60)
$btnExecute.BackColor = [System.Drawing.Color]::FromArgb(0, 200, 0)
$btnExecute.ForeColor = [System.Drawing.Color]::White
$btnExecute.FlatStyle = "Flat"
$btnExecute.Font = New-Object System.Drawing.Font("Segoe UI", 16, [System.Drawing.FontStyle]::Bold)
$btnExecute.Add_Click({
    $command = $inputBox.Text.Trim()
    
    if ([string]::IsNullOrWhiteSpace($command) -or ($command -match '^#' -and $command.Split("`n").Count -eq 1)) {
        Write-Output "Please paste a command first!"
        return
    }
    
    Write-Output ""
    Write-Output "Executing command..."
    Write-Output "---"
    
    try {
        $scriptBlock = [ScriptBlock]::Create($command)
        $result = & $scriptBlock 2>&1
        
        if ($result) {
            $result | ForEach-Object { Write-Output $_.ToString() }
        }
        
        Write-Output ""
        Write-Output "Command executed successfully!"
    } catch {
        Write-Output ""
        Write-Output "Error: $($_.Exception.Message)"
    }
    
    Write-Output "---"
})
$form.Controls.Add($btnExecute)

$btnSave = New-Object System.Windows.Forms.Button
$btnSave.Text = "Save Script"
$btnSave.Location = New-Object System.Drawing.Point(290, 390)
$btnSave.Size = New-Object System.Drawing.Size(180, 60)
$btnSave.BackColor = [System.Drawing.Color]::FromArgb(0, 120, 215)
$btnSave.ForeColor = [System.Drawing.Color]::White
$btnSave.FlatStyle = "Flat"
$btnSave.Font = New-Object System.Drawing.Font("Segoe UI", 11)
$btnSave.Add_Click({
    $command = $inputBox.Text.Trim()
    if ([string]::IsNullOrWhiteSpace($command)) {
        Write-Output "Nothing to save!"
        return
    }
    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $filename = "C:\HamletAI\saved_$timestamp.ps1"
    [System.IO.File]::WriteAllText($filename, $command, [System.Text.Encoding]::UTF8)
    Write-Output "Saved to: $filename"
})
$form.Controls.Add($btnSave)

$btnClearInput = New-Object System.Windows.Forms.Button
$btnClearInput.Text = "Clear Input"
$btnClearInput.Location = New-Object System.Drawing.Point(490, 390)
$btnClearInput.Size = New-Object System.Drawing.Size(180, 60)
$btnClearInput.BackColor = [System.Drawing.Color]::FromArgb(80, 80, 80)
$btnClearInput.ForeColor = [System.Drawing.Color]::White
$btnClearInput.FlatStyle = "Flat"
$btnClearInput.Font = New-Object System.Drawing.Font("Segoe UI", 10)
$btnClearInput.Add_Click({
    $inputBox.Clear()
    $inputBox.Text = "# Ready for next command..."
    Write-Output "Input cleared"
})
$form.Controls.Add($btnClearInput)

$btnClearOutput = New-Object System.Windows.Forms.Button
$btnClearOutput.Text = "Clear Output"
$btnClearOutput.Location = New-Object System.Drawing.Point(690, 390)
$btnClearOutput.Size = New-Object System.Drawing.Size(180, 60)
$btnClearOutput.BackColor = [System.Drawing.Color]::FromArgb(80, 80, 80)
$btnClearOutput.ForeColor = [System.Drawing.Color]::White
$btnClearOutput.FlatStyle = "Flat"
$btnClearOutput.Font = New-Object System.Drawing.Font("Segoe UI", 10)
$btnClearOutput.Add_Click({
    $outputBox.Clear()
    $outputBox.Text = "Ready!`r`n"
})
$form.Controls.Add($btnClearOutput)

$btnCopy = New-Object System.Windows.Forms.Button
$btnCopy.Text = "Copy Output"
$btnCopy.Location = New-Object System.Drawing.Point(890, 390)
$btnCopy.Size = New-Object System.Drawing.Size(180, 60)
$btnCopy.BackColor = [System.Drawing.Color]::FromArgb(150, 0, 200)
$btnCopy.ForeColor = [System.Drawing.Color]::White
$btnCopy.FlatStyle = "Flat"
$btnCopy.Font = New-Object System.Drawing.Font("Segoe UI", 10)
$btnCopy.Add_Click({
    [System.Windows.Forms.Clipboard]::SetText($outputBox.Text)
    Write-Output "Copied to clipboard!"
})
$form.Controls.Add($btnCopy)

$statusBar = New-Object System.Windows.Forms.Label
$statusBar.Text = "ONLINE | User: absulysuly | Ready!"
$statusBar.Font = New-Object System.Drawing.Font("Consolas", 10, [System.Drawing.FontStyle]::Bold)
$statusBar.ForeColor = [System.Drawing.Color]::LimeGreen
$statusBar.AutoSize = $true
$statusBar.Location = New-Object System.Drawing.Point(25, 735)
$form.Controls.Add($statusBar)

Write-Output "Mega Executor loaded!"
[void]$form.ShowDialog()