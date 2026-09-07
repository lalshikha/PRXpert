import { Octokit } from "@octokit/rest";
export declare function createClient(token: string): Octokit;
export declare function getChangedFiles(octokit: Octokit, owner: string, repo: string, pullNumber: number): Promise<{
    sha: string | null;
    filename: string;
    status: "added" | "removed" | "modified" | "renamed" | "copied" | "changed" | "unchanged";
    additions: number;
    deletions: number;
    changes: number;
    blob_url: string;
    raw_url: string;
    contents_url: string;
    patch?: string;
    previous_filename?: string;
}[]>;
export declare function createReview(octokit: Octokit, owner: string, repo: string, pullNumber: number, body: string, comments: Array<{
    path: string;
    line: number;
    body: string;
}>): Promise<void>;
//# sourceMappingURL=github.d.ts.map