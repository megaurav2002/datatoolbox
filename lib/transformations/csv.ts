function isSignificantRow(row: string[]): boolean {
  return row.length > 1 || row.some((cell) => cell.length > 0);
}

export function parseCsv(input: string, delimiter = ","): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let value = "";
  let inQuotes = false;

  for (let i = 0; i < input.length; i += 1) {
    const char = input[i];
    const next = input[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        value += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === delimiter && !inQuotes) {
      row.push(value);
      value = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") {
        i += 1;
      }
      row.push(value);
      if (isSignificantRow(row)) {
        rows.push(row);
      }
      row = [];
      value = "";
      continue;
    }

    value += char;
  }

  if (inQuotes) {
    throw new Error("CSV appears malformed: unmatched quote detected.");
  }

  if (value.length > 0 || row.length > 0) {
    row.push(value);
    rows.push(row);
  }

  return rows;
}

export function toCsv(rows: string[][]): string {
  return rows
    .map((row) =>
      row
        .map((cell) => {
          const escaped = cell.replace(/"/g, '""');
          return /[",\n]/.test(cell) ? `"${escaped}"` : escaped;
        })
        .join(","),
    )
    .join("\n");
}

export function parseSpreadsheetLikeInput(input: string): string[][] {
  const lines = input
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .filter((line) => line.trim().length > 0);

  if (lines.length === 0) {
    return [];
  }

  if (lines.some((line) => line.includes("\t"))) {
    return lines.map((line) => line.split("\t"));
  }

  return parseCsv(lines.join("\n"));
}

export function rowsToHtmlTable(rows: string[][]): string {
  if (rows.length === 0) {
    return "<table></table>";
  }

  const header = rows[0]
    .map((cell) => `<th>${escapeHtml(cell)}</th>`)
    .join("");
  const body = rows
    .slice(1)
    .map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`)
    .join("\n");

  return `<table><thead><tr>${header}</tr></thead><tbody>${body}</tbody></table>`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
