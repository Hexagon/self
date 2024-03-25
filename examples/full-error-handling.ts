import { checkJsrVersion, ConfigNotFoundError, JsrLookupError, PackageConfigError } from "@check/self";

try {
  const result = await checkJsrVersion();
  if (result.isUpToDate) {
    console.log("The program is up to date!");
  } else {
    console.warn(
      `Current version '${result.currentVersion}' is outdated, please upgrade to '${result.latestVersion}'.`,
    );
  }
} catch (e) {
  // Ignore, or handle errors gracefully, example:
  if (e instanceof ConfigNotFoundError) {
    console.error(
      "Error: Could not find package configuration file.",
      e.message,
    );
  } else if (e instanceof PackageConfigError) {
    console.error("Error in package configuration:", e.message);
  } else if (e instanceof JsrLookupError) {
    console.error("Error fetching data from JSR.io:", e.message, e.cause);
  } else {
    console.error("Unexpected error:", e);
  }
}
