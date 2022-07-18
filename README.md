# @casimir/cli

Command line interface for working with Casimir-based projects

## Installation

```shell
npm install @casimir/cli
```

Global installation

```shell
npm install @casimir/cli -g
```

## Usage

```shell
cas <command> <action> [options]

Commands:
  cas framework  Operations with framework on project side
  cas packages   Operations with packages on mono-repo side
  cas project    Operations with current project

Options:
  -i, --interactive  Enable interactive prompts
  -h, --help         Show help  [boolean]
  -v, --version      Show version number  [boolean]
```

### Framework

Operations with framework on project side

#### `cas framework update`

Update framework packages

```shell
Options:
  -t, --target       point to target packages version  [string] [choices: "latest", "greatest", "newest", "minor", "patch"] [default: "latest"]
  -s, --scope        Packages scopes  [array] [choices: "casimir", "deip"] [default: ["casimir","deip"]]
  -y, --yes          Confirm framework packages update

  -h, --help         Show help  [boolean]
  -v, --version      Show version number  [boolean]
```

#### `cas framework link`

Link framework packages

```shell
Options:
  -y, --yes          Confirm framework packages link

  -h, --help         Show help  [boolean]
  -v, --version      Show version number  [boolean]
```

### Packages

Operations with packages on mono-repo side

#### `cas packages build`

Build ts, js, vue packages in mono-repository

```shell
Options:
  -h, --help         Show help  [boolean]
  -v, --version      Show version number  [boolean]
```

#### `cas packages dev`

Enable watching and build for mono-repository

```shell
Options:
  -h, --help         Show help  [boolean]
  -v, --version      Show version number  [boolean]
```

#### `cas packages release`

Release and publish framework packages

```shell
Options:
      --bootstrap    Bootstrap packages  [boolean] [default: true]
      --clean        Clean packages  [boolean] [default: true]
  -y, --yes          Confirm packages release
  -h, --help         Show help  [boolean]
  -v, --version      Show version number  [boolean]

Examples:
  cas release                            Make default packages publish
  cas release --prerelease               Make prerelease packages publish with 'beta' identifier
  cas release --prerelease --preid next  Make prerelease packages publish with 'next' identifier
```

#### `cas packages bootstrap`

Bootstrap lerna packages

```shell
Options:
      --ci           Enable/Disable CI verification  [boolean] [default: false]
  -h, --help         Show help  [boolean]
  -v, --version      Show version number  [boolean]
```

### Project

Operations with current project

#### `cas project release`

Release current project

```shell
Options:
  -i, --interactive  Enable interactive prompts
      --ci           Enable/Disable CI verification  [boolean] [default: true]
      --dryRun       Run command in test mode  [boolean] [default: false]
      --npmPublish   Publish to npm registry  [boolean] [default: false]
  -y, --yes          Confirm projectCommand release
  -h, --help         Show help  [boolean]
  -v, --version      Show version number  [boolean]
```
