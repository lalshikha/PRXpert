"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createClient = createClient;
exports.getChangedFiles = getChangedFiles;
exports.createReview = createReview;
const rest_1 = require("@octokit/rest");
function createClient(token) {
    return new rest_1.Octokit({ auth: token });
}
async function getChangedFiles(octokit, owner, repo, pullNumber) {
    const { data } = await octokit.pulls.listFiles({
        owner,
        repo,
        pull_number: pullNumber
    });
    return data;
}
async function createReview(octokit, owner, repo, pullNumber, body, comments) {
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
//# sourceMappingURL=github.js.map