export interface RiskFinding {
    severity: "low" | "medium" | "high" | "critical";
    category: "security" | "product" | "ux";
    message: string;
    file?: string;
    line?: number;
}
export declare function calculateRisk(files: Array<{
    filename: string;
    additions: number;
    deletions: number;
}>): RiskFinding[];
//# sourceMappingURL=risk.d.ts.map