param(
  [Parameter(Mandatory = $true)]
  [string]$Version
)
$ErrorActionPreference = 'Stop'
$env:SONARIS_VERSION = $Version
npm run package:win
node scripts/normalize-artifact.js windows $Version
