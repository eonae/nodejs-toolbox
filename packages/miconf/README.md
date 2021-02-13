# What is it?
## The problem:
We have a piece of desktop software. Desktop means that there are more than one version in production at the same time. This program has configuration file which contents can differ from one version to another.

Let's say we have **v1.1.0** installed, and we want to update to **v1.3.0**. And we we want to save all our settings, but configuration schema is a little bit different in 1.3.0.

Or even we want to downgrade from **v1.8.9** to **1.4.0** Why? Maybe for testing purposes - to ensure backward compatibility with server software.

**@eonae/miconf** provides solution: config migrations functionality.

# Usage

To use miconf we need these steps:

1. Create miconf.config.yml in project root (from where you are going to run all your scripts)
``` yaml
# specify all supported versions
supported:
  - 1.3.0
  - 1.4.1
  - 1.6.1
  - 1.8.0

# this will force us to implement 4 json-schemas for each versions and 3 migrations.
```

2. Create schemas for each version (use json-schema specification). Naming convention for schema-files is **schema-**<version>**.json** and default folder is **schemas** in project root. You can use a folder of your choice and specify it by --schemasDir flag.

3. Create migrations folder. Default folder is **migrations** (--migrationsDir allows to customize this).

4. For each migration create a file (convention: **migration-**<version-to>**.ts**). It should provide default export of a class that implements ConfigMigration interface from @eonae/miconf

``` typescript
// migration-123123-1.2.4.ts

export class Migration123123_1_2_4 implements ConfigMigration {
  from = new SemanticVersion('1.2.3')
  to = new SemanticVersion('1.2.4')
  up (prev: any) {
    // 1.2.3 -> 1.2.4 { ... }
  }

  down (next: any) {
    // 1.2.4 -> 1.2.3
    return { ... }
  }
}
```

5. Using our migrations we should compile them to javascript.
``` bash
tsc migrations/*.ts
```

6. Create npm script to run the tool:
``` json
// package.json

{
  "scripts": {
    "miconf": "miconf migrate"
  }
}
```

7. Now we are ready to go:
``` bash
npm run miconf -- ./path/to/config.json 1.3.4 1.3.5
```

## Supported config formats:
.json, .yaml, .yml