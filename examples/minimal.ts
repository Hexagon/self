import { checkJsrVersion } from "@check/self";

try {
  const result = await checkJsrVersion();
  if (!result.isUpToDate) {
    console.warn(`Current version '${result.currentVersion}' is outdated, upgrade to '${result.latestVersion}'.`);
  }
} catch (_e) { /* Ignore */ }

console.log("The program is running!");
