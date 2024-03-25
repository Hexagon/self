import { fetchJsrPackageMeta, readDenoConfig } from "@check/deps/lib";
import { greaterOrEqual, parse } from "@std/semver";

/**
 * Represents the result of a package version check on JSR.io.
 */
export interface OwnVersionResult {
  /**
   * Indicates whether the current version is up-to-date.
   */
  isUpToDate: boolean;
  /**
   * The current installed version of the package (if found).
   */
  currentVersion?: string;
  /**
   * The latest available version of the package on JSR.io (if found).
   */
  latestVersion?: string;
}

/**
 * An error thrown when the package configuration file cannot be found.
 */
export class ConfigNotFoundError extends Error {
  /**
   * An error thrown when the package configuration file cannot be found.
   */
  constructor(message: string) {
    super(message);
    this.name = "ConfigNotFoundError";
  }
}

/**
 * An error thrown when there is a problem in the package configuration.
 */
export class PackageConfigError extends Error {
  /**
   * An error thrown when there is a problem in the package configuration.
   */
  constructor(message: string) {
    super(message);
    this.name = "PackageConfigError";
  }
}

/**
 * An error thrown when there is a problem fetching data from JSR.io.
 */
export class JsrLookupError extends Error {
  /**
   * An error thrown when there is a problem fetching data from JSR.io.
   */
  constructor(message: string, cause: Error) {
    super(message);
    this.name = "JsrLookupError";
    this.cause = cause;
  }
}

/**
 * Checks a published Deno package on JSR.io to determine if the user is running the latest version.
 *
 * @returns A promise resolving to an `OwnVersionResult` object indicating the update status and relevant versions.
 * @throws {ConfigNotFoundError} If the Deno project configuration file cannot be found.
 * @throws {PackageConfigError} If there is a missing or invalid package name/version in the configuration.
 * @throws {JsrLookupError} If an error occurs during communication with JSR.io
 */
export async function checkJsrVersion(): Promise<OwnVersionResult> {
  const firstNamedConfig = await getFirstConfigWithName();
  if (firstNamedConfig) {
    // Extract current version
    const currentName = firstNamedConfig.name;
    const currentVersion = firstNamedConfig.version;

    if (!currentName) {
      throw new PackageConfigError("Current package name not found.");
    }
    if (!currentVersion) {
      throw new PackageConfigError("Current package version not found.");
    }

    try { // Error handling for fetchJsrPackageMeta
      const remoteMeta = await fetchJsrPackageMeta(currentName!);
      if (remoteMeta?.latest) {
        const latestVersion = remoteMeta.latest;

        return {
          isUpToDate: greaterOrEqual(
            parse(currentVersion),
            parse(latestVersion),
          ),
          currentVersion,
          latestVersion,
        };
      } else {
        throw new Error("Could not determine latest version on jsr.io.");
      }
    } catch (e) {
      throw new JsrLookupError(
        "Could not determine latest version on jsr.io",
        e,
      );
    }
  } else {
    throw new ConfigNotFoundError(
      "Could not find information of the current package.",
    );
  }
}

/**
 * Helper function to retrieve the first named configuration from the project's configuration file.
 *
 * @returns The first Deno configuration object with a 'name' property, or null if none found.
 */
async function getFirstConfigWithName() {
  const configs = await readDenoConfig();

  for (const config of configs) {
    if (config.name) {
      return config; // Return the first config with a 'name' property
    }
  }

  return null; // If no configs have a name
}
