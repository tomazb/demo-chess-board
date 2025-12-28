import { execSync } from 'node:child_process'
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()
const changelogPath = join(root, 'CHANGELOG.md')
const markerPath = join(root, '.changelog-last-sha')

function getHeadSha() {
  return execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim()
}

function getCommitsSince(lastSha) {
  const range = lastSha ? `${lastSha}..HEAD` : ''
  const cmd = `git log ${range} --no-merges --pretty=format:%H%x09%s`
  const out = execSync(cmd, { encoding: 'utf8' }).trim()
  if (!out) return []
  return out.split('\n').map(line => {
    const idx = line.indexOf('\t')
    const sha = line.slice(0, idx)
    const subject = line.slice(idx + 1).trim()
    return { sha, subject }
  })
}

function categorize(subject) {
  const lower = subject.toLowerCase()
  const colonIdx = lower.indexOf(':')
  const type = colonIdx !== -1 ? lower.slice(0, colonIdx) : ''
  if (type.startsWith('feat')) return 'Dodano'
  if (type.startsWith('fix')) return 'Popravljeno'
  if (type.startsWith('docs')) return 'Dokumentacija'
  if (type.startsWith('refactor') || type.startsWith('perf') || type.startsWith('style')) return 'Spremenjeno'
  if (type.startsWith('chore') || type.startsWith('test') || type.startsWith('build') || type.startsWith('ci')) return 'Vzdrževanje'
  return 'Vzdrževanje'
}

function subjectText(subject) {
  const idx = subject.indexOf(':')
  return idx !== -1 ? subject.slice(idx + 1).trim() : subject
}

function buildUnreleased(commits) {
  const groups = new Map()
  for (const c of commits) {
    const cat = categorize(c.subject)
    const text = subjectText(c.subject)
    const arr = groups.get(cat) || []
    arr.push(`- ${text}`)
    groups.set(cat, arr)
  }
  if (groups.size === 0) return ''
  let md = '## Neizdano\n\n'
  const order = ['Dodano', 'Spremenjeno', 'Popravljeno', 'Dokumentacija', 'Vzdrževanje']
  for (const key of order) {
    const items = groups.get(key)
    if (!items || items.length === 0) continue
    md += `### ${key}\n` + items.join('\n') + '\n\n'
  }
  return md.trim() + '\n\n'
}

function insertUnreleased(content, unreleased) {
  if (!unreleased) return content
  const hasSection = content.includes('\n## Neizdano') || content.startsWith('## Neizdano')
  if (hasSection) {
    const startIdx = content.indexOf('## Neizdano')
    const afterIdx = content.indexOf('\n## ', startIdx + 1)
    if (afterIdx === -1) {
      return content.slice(0, startIdx) + unreleased + content.slice(afterIdx === -1 ? content.length : afterIdx)
    }
    return content.slice(0, startIdx) + unreleased + content.slice(afterIdx)
  }
  const introIdx = content.indexOf('Vse pomembne spremembe')
  if (introIdx !== -1) {
    const lineEnd = content.indexOf('\n', introIdx)
    const insertPos = content.indexOf('\n', lineEnd + 1)
    const pos = insertPos !== -1 ? insertPos + 1 : lineEnd + 1
    return content.slice(0, pos) + unreleased + content.slice(pos)
  }
  const h1Idx = content.indexOf('# Dnevnik sprememb')
  if (h1Idx !== -1) {
    const pos = content.indexOf('\n', h1Idx) + 1
    return content.slice(0, pos) + '\n' + unreleased + content.slice(pos)
  }
  return unreleased + content
}

function updateMode() {
  const lastSha = existsSync(markerPath) ? readFileSync(markerPath, 'utf8').trim() : ''
  const commits = getCommitsSince(lastSha)
  if (commits.length === 0) return { wrote: false }
  const unreleased = buildUnreleased(commits)
  const content = readFileSync(changelogPath, 'utf8')
  const next = insertUnreleased(content, unreleased)
  writeFileSync(changelogPath, next, 'utf8')
  const head = getHeadSha()
  writeFileSync(markerPath, head, 'utf8')
  return { wrote: true }
}

function checkMode() {
  const lastSha = existsSync(markerPath) ? readFileSync(markerPath, 'utf8').trim() : ''
  const commits = getCommitsSince(lastSha)
  if (commits.length === 0) return { pending: false }
  return { pending: true }
}

const arg = process.argv[2] || 'check'
if (!existsSync(changelogPath)) {
  console.error('CHANGELOG.md manjka')
  process.exit(1)
}
if (arg === 'update') {
  const res = updateMode()
  if (res.wrote) process.exit(0)
  process.exit(0)
} else {
  const res = checkMode()
  if (res.pending) process.exit(1)
  process.exit(0)
}
