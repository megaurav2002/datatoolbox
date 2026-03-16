export type JsonPath = string;

export type JsonAddedEntry = {
  path: JsonPath;
  value: unknown;
};

export type JsonRemovedEntry = {
  path: JsonPath;
  value: unknown;
};

export type JsonChangedEntry = {
  path: JsonPath;
  before: unknown;
  after: unknown;
};

export type JsonDiffResult = {
  added: JsonAddedEntry[];
  removed: JsonRemovedEntry[];
  changed: JsonChangedEntry[];
};

export type JsonDiffOptions = {
  ignoreKeyOrder?: boolean;
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function buildObjectPath(parentPath: string, key: string): string {
  if (!parentPath) {
    return key;
  }
  return `${parentPath}.${key}`;
}

function buildArrayPath(parentPath: string, index: number): string {
  if (!parentPath) {
    return `[${index}]`;
  }
  return `${parentPath}[${index}]`;
}

export function formatPath(path: string): string {
  return path || "(root)";
}

export function compareJsonDocuments(
  before: unknown,
  after: unknown,
  options: JsonDiffOptions = {},
): JsonDiffResult {
  const added: JsonAddedEntry[] = [];
  const removed: JsonRemovedEntry[] = [];
  const changed: JsonChangedEntry[] = [];
  const ignoreKeyOrder = options.ignoreKeyOrder ?? false;

  const compare = (path: string, leftValue: unknown, rightValue: unknown) => {
    if (leftValue === rightValue) {
      return;
    }

    if (leftValue === undefined) {
      added.push({ path, value: rightValue });
      return;
    }

    if (rightValue === undefined) {
      removed.push({ path, value: leftValue });
      return;
    }

    if (Array.isArray(leftValue) && Array.isArray(rightValue)) {
      const maxLength = Math.max(leftValue.length, rightValue.length);
      for (let index = 0; index < maxLength; index += 1) {
        compare(buildArrayPath(path, index), leftValue[index], rightValue[index]);
      }
      return;
    }

    if (isObject(leftValue) && isObject(rightValue)) {
      const leftKeys = Object.keys(leftValue);
      const rightKeys = Object.keys(rightValue);
      const sameKeySet =
        leftKeys.length === rightKeys.length &&
        leftKeys.every((key) => rightKeys.includes(key));

      // Optional strict object-key-order check.
      if (!ignoreKeyOrder && sameKeySet && leftKeys.join("\u0000") !== rightKeys.join("\u0000")) {
        changed.push({
          path,
          before: leftKeys,
          after: rightKeys,
        });
      }

      const keys = new Set([...leftKeys, ...rightKeys]);
      keys.forEach((key) => {
        compare(buildObjectPath(path, key), leftValue[key], rightValue[key]);
      });
      return;
    }

    changed.push({
      path,
      before: leftValue,
      after: rightValue,
    });
  };

  compare("", before, after);

  return {
    added,
    removed,
    changed,
  };
}

