param(
  [string]$MongoUri = "",
  [string]$Database = "",
  [string]$ComposeService = "mongo",
  [switch]$SkipWriteTest
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Parse-DbNameFromUri {
  param([string]$Uri)
  if ([string]::IsNullOrWhiteSpace($Uri)) {
    return ""
  }
  if ($Uri -match "mongodb(?:\+srv)?:\/\/[^\/]+\/([^?\s]+)") {
    return $Matches[1]
  }
  return ""
}

function Get-MongoMode {
  $local = Get-Command mongosh -ErrorAction SilentlyContinue
  if ($null -ne $local) {
    return "local"
  }
  return "docker"
}

function Invoke-MongoEval {
  param(
    [string]$Javascript,
    [string]$Mode,
    [string]$ResolvedUri,
    [string]$ResolvedDb,
    [string]$Service
  )

  if ($Mode -eq "local") {
    & mongosh $ResolvedUri --quiet --eval $Javascript
    return
  }

  $escapedJs = $Javascript.Replace('"', '\"')
  $cmd = "mongosh --quiet --eval ""$escapedJs"""
  & docker compose exec -T $Service sh -lc $cmd
}

if ([string]::IsNullOrWhiteSpace($MongoUri)) {
  if (-not [string]::IsNullOrWhiteSpace($env:MONGO_URI)) {
    $MongoUri = $env:MONGO_URI
  } else {
    $MongoUri = "mongodb://localhost:27017/sunisland"
  }
}

if ([string]::IsNullOrWhiteSpace($Database)) {
  $Database = Parse-DbNameFromUri -Uri $MongoUri
}
if ([string]::IsNullOrWhiteSpace($Database)) {
  $Database = "sunisland"
}

$mode = Get-MongoMode
$collections = @("bookings", "vehicles", "pricing_rule_sets", "faqs")
$writeTestEnabledJs = (-not $SkipWriteTest).ToString().ToLower()
$collectionJs = (($collections | ForEach-Object { "'$_'" }) -join ", ")

Write-Host "Mongo check mode: $mode"
Write-Host "Mongo URI: $MongoUri"
Write-Host "Database: $Database"
Write-Host ""

$js = @"
const dbName = '$Database';
const d = db.getSiblingDB(dbName);
const ping = d.runCommand({ ping: 1 });
print(JSON.stringify({ stage: 'ping', ok: ping.ok }));

const names = [$collectionJs];
for (const c of names) {
  const n = d.getCollection(c).countDocuments({});
  print(JSON.stringify({ stage: 'count', collection: c, count: n }));
}

if ($writeTestEnabledJs) {
  const check = d.getCollection('connection_checks');
  const marker = 'check-' + new Date().toISOString() + '-' + Math.floor(Math.random() * 1000000);
  const insert = check.insertOne({ marker, createdAt: new Date(), source: 'check-mongo-connection.ps1' });
  const found = check.findOne({ marker: marker });
  const del = check.deleteOne({ marker: marker });
  print(JSON.stringify({ stage: 'writeTest', insertedId: String(insert.insertedId), found: !!found, deletedCount: del.deletedCount }));
}
"@

Invoke-MongoEval -Javascript $js -Mode $mode -ResolvedUri $MongoUri -ResolvedDb $Database -Service $ComposeService

Write-Host ""
Write-Host "Mongo connectivity/save check completed."
