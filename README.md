# **@check/self**: JSR Version Checker

A utility for Deno programs published on jsr.io, which helps you easily determine if the user has the latest version of
your program.

If you're interested in keeping your project dependencies up to date, check out our related tool, @check/deps:
[https://github.com/hexagon/deps](https://github.com/hexagon/deps).

**Installation**

Full installation instructions available at [jsr.io/@check/self](https://jsr.io/@check/self).

```bash
deno add @check/self
```

**Usage**

Full examples are available in the [/examples](https://github.com/Hexagon/self/tree/main/examples) folder of the GitHub
repository.

```javascript
import { checkJsrVersion } from "@check/self";

try {
  const result = await checkJsrVersion();
  if (result.isUpToDate) {
    console.log("Up-to-date!");
  } else {
    console.warn(
      `Current version '${result.currentVersion}' is outdated, please upgrade to '${result.latestVersion}'.`,
    );
  }
} catch (error) {
  // ... handle errors based on their type, or ignore them if you wish
}
```

**Error Handling**

@check/self utilizes these error types to help you troubleshoot:

- **ConfigNotFoundError:** Thrown if your Deno project configuration file cannot be located.
- **PackageConfigError:** Indicates an error within your package configuration (like a missing version or package name).
- **JsrLookupError:** Signals a problem during communication with JSR.io to fetch dependency information.

Example with full error handling:

```typescript
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
  // Handle errors gracefully
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
```

**Contributing**

We welcome contributions! Feel free to open issues, submit pull requests, or suggest new features. The repository is
available at [github.com/hexagon/self](https://github.com/hexagon/self).

**License**

MIT License
