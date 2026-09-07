import { createClient, getChangedFiles, createReview } from './github.js';
import { calculateRisk } from './risk.js';

async function main() {
  const token = process.env.GITHUB_TOKEN!;
  const repo = process.env.GITHUB_REPOSITORY!;
  const pullNumber = parseInt(process.env.PR_NUMBER || '0');

  const [owner, repoName] = repo.split('/');

  if (!owner || !repoName || pullNumber === 0) {
    console.error('Missing required environment variables: GITHUB_REPOSITORY or PR_NUMBER');
    process.exit(1);
  }

  const octokit = createClient(token);
  const files = await getChangedFiles(octokit, owner, repoName, pullNumber);

  const riskFindings = calculateRisk(
    files.map(f => ({
      filename: f.filename,
      additions: f.additions,
      deletions: f.deletions
    }))
  );

  const riskLevel = riskFindings.some(f => f.severity === 'critical')
    ? '?? Critical'
    : riskFindings.some(f => f.severity === 'high')
    ? '?? High'
    : riskFindings.some(f => f.severity === 'medium')
    ? '?? Medium'
    : '?? Low';

  const summary = `## PR Risk Analysis

**Risk Level:** ${riskLevel}

### Findings (${riskFindings.length})
${
  riskFindings.length > 0
    ? riskFindings
        .map(
          f =>
            `- **${f.severity.toUpperCase()}** [${f.category}] ${f.message}${
              f.file ? ` in \`${f.file}\`` : ''
            }`
        )
        .join('\n')
    : 'No significant risks detected'
}

### Recommendations
- Review security controls for auth/permission changes
- Verify accessibility on UI updates
- Run manual testing on impacted flows
- Consider breaking large PRs into smaller changes
`;

  const inlineComments = riskFindings
    .filter(f => f.file && f.line)
    .map(f => ({
      path: f.file!,
      line: f.line!,
      body: `**${f.severity.toUpperCase()}** ${f.message}`
    }));

  await createReview(octokit, owner, repoName, pullNumber, summary, inlineComments);

  console.log(`Posted review with ${riskFindings.length} findings`);
}

main().catch(console.error);
