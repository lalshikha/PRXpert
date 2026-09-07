export interface RiskFinding {
  severity: "low" | "medium" | "high" | "critical";
  category: "security" | "product" | "ux";
  message: string;
  file?: string;
  line?: number;
}

export function calculateRisk(
  files: Array<{ filename: string; additions: number; deletions: number }>
): RiskFinding[] {
  const findings: RiskFinding[] = [];

  // Security: auth/session files
  const authFiles = files.filter(f =>
    /auth|session|login|password|token|credential/i.test(f.filename)
  );
  if (authFiles.length > 0) {
    findings.push({
      severity: "high",
      category: "security",
      message: "Authentication/session files modified — verify security controls",
      file: authFiles[0].filename
    });
  }

  // Security: permission/role changes
  const permissionFiles = files.filter(f =>
    /permission|role|access|policy/i.test(f.filename)
  );
  if (permissionFiles.length > 0) {
    findings.push({
      severity: "high",
      category: "security",
      message: "Permission/role files modified — review access control changes",
      file: permissionFiles[0].filename
    });
  }

  // Product: config/DB schema changes
  const configFiles = files.filter(f =>
    /config|schema|migration|env|database/i.test(f.filename)
  );
  if (configFiles.length > 0) {
    findings.push({
      severity: "medium",
      category: "product",
      message: "Configuration or schema changes detected — review impact",
      file: configFiles[0].filename
    });
  }

  // UX: frontend form/validation changes
  const uiFiles = files.filter(f =>
    /\.(tsx|jsx|vue|svelte|html)$/i.test(f.filename) &&
    /form|input|button|modal|dialog/i.test(f.filename)
  );
  if (uiFiles.length > 0) {
    findings.push({
      severity: "low",
      category: "ux",
      message: "UI components changed — verify accessibility and validation",
      file: uiFiles[0].filename
    });
  }

  // Product: large PR (more than 500 additions)
  const totalAdditions = files.reduce((sum, f) => sum + f.additions, 0);
  if (totalAdditions > 500) {
    findings.push({
      severity: "medium",
      category: "product",
      message: `Large PR (${totalAdditions} additions) — consider breaking into smaller changes`
    });
  }

  return findings;
}
