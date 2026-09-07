import { Octokit } from "@octokit/rest";

export function createClient(token: string): Octokit {
  return new Octokit({ auth: token });
}

export async function getChangedFiles(
  octokit: Octokit,
  owner: string,
  repo: string,
  pullNumber: number
) {
  const { data } = await octokit.pulls.listFiles({
    owner,
    repo,
    pull_number: pullNumber
  });
  return data;
}

export async function createReview(
  octokit: Octokit,
  owner: string,
  repo: string,
  pullNumber: number,
  body: string,
  comments: Array<{ path: string; line: number; body: string }>
) {
  await octokit.pulls.createReview({
    owner,
    repo,
    pull_number: pullNumber,
    event: "COMMENT",
    body,
    comments: comments.map(c => ({
      path: c.path,
      line: c.line,
      body: c.body
    }))
  });
}
