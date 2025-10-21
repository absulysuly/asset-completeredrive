$ErrorActionPreference = 'Stop'

function Write-Info($message) { Write-Host "[INFO] $message" -ForegroundColor Cyan }
function Write-Success($message) { Write-Host "[OK]   $message" -ForegroundColor Green }
function Write-Warn($message) { Write-Host "[WARN] $message" -ForegroundColor Yellow }
function Write-Fail($message) { Write-Host "[FAIL] $message" -ForegroundColor Red }

try {
    $branch = 'feature/api-validation-hardening'
    $timestamp = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
    $tag = "v" + (Get-Date -Format 'yyyyMMddHHmmss')
    $commitMessage = "chore(auto): autopilot commit $timestamp"

    $scriptRoot = Split-Path -Parent $PSCommandPath
    $repoRoot = Resolve-Path (Join-Path $scriptRoot '..')
    Set-Location $repoRoot

    Write-Info "Working directory set to $repoRoot"

    $token = $env:GITHUB_TOKEN
    if (-not $token) {
        throw 'GITHUB_TOKEN environment variable is not set.'
    }

    Write-Info 'Fetching latest changes from origin...'
    git fetch origin | Out-Null

    $currentBranch = (git symbolic-ref --short HEAD 2>$null)
    if ($currentBranch -ne $branch) {
        if (git show-ref --verify --quiet "refs/heads/$branch") {
            Write-Info "Checking out existing local branch $branch"
            git checkout $branch | Out-Null
        } elseif (git show-ref --verify --quiet "refs/remotes/origin/$branch") {
            Write-Info "Creating local branch $branch from origin/$branch"
            git checkout -b $branch "origin/$branch" | Out-Null
        } else {
            Write-Info "Creating new branch $branch"
            git checkout -b $branch | Out-Null
        }
    }

    Write-Info 'Staging all changes...'
    git add -A

    $changes = git status --porcelain
    if (-not $changes) {
        Write-Warn 'No changes detected. Nothing to commit.'
        return
    }

    Write-Info "Committing changes with message: $commitMessage"
    git commit -m $commitMessage | Out-Null
    Write-Success 'Commit created.'

    Write-Info "Pushing branch $branch to origin..."
    git push --set-upstream origin $branch | Out-Null
    Write-Success 'Branch push completed.'

    Write-Info "Creating tag $tag"
    git tag -a $tag -m "Automated release $timestamp"
    git push origin $tag | Out-Null
    Write-Success "Tag $tag pushed."

    $remoteUrl = git remote get-url origin
    if ($remoteUrl -match 'github.com[:/](?<owner>[^/]+?)/(?<repo>[^/]+?)(\.git)?$') {
        $repoSlug = "$($Matches.owner)/$($Matches.repo)"
    } else {
        throw "Unable to parse GitHub repository from remote URL: $remoteUrl"
    }

    $releaseBody = @{
        tag_name = $tag
        name = "Hamlet Autopilot $tag"
        body = "Automated release created at $timestamp"
        draft = $false
        prerelease = $false
    } | ConvertTo-Json -Depth 4

    $headers = @{
        Authorization = "token $token"
        Accept = 'application/vnd.github+json'
        'User-Agent' = 'hamlet-autopilot'
    }

    Write-Info 'Creating GitHub release...'
    try {
        $response = Invoke-RestMethod -Method Post -Uri "https://api.github.com/repos/$repoSlug/releases" -Headers $headers -Body $releaseBody -ContentType 'application/json'
        Write-Success "Release created: $($response.html_url)"
    } catch {
        if ($_.Exception.Response -and $_.Exception.Response.StatusCode.Value__ -eq 422) {
            Write-Warn 'Release already exists for this tag. Skipping release creation.'
        } else {
            throw $_
        }
    }

    Write-Success 'Hamlet Autopilot completed successfully.'
}
catch {
    Write-Fail $_.Exception.Message
    exit 1
}
