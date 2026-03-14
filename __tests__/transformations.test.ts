import { transformations } from "@/lib/transformations";

describe("transformations", () => {
  it("covers all expected phase 2 transformation slugs", () => {
    expect(Object.keys(transformations).sort()).toEqual([
      "base64-decoder",
      "base64-encoder",
      "bcrypt-hash-generator",
      "case-converter",
      "character-counter",
      "cron-expression-builder",
      "cron-expression-parser",
      "csv-cleaner",
      "csv-column-mapper",
      "csv-merge-tool",
      "csv-splitter",
      "csv-to-excel",
      "csv-to-json",
      "csv-to-sql",
      "csv-validator",
      "csv-viewer",
      "curl-to-fetch",
      "date-format-converter",
      "excel-to-csv",
      "extract-emails",
      "extract-numbers",
      "extract-urls",
      "hash-generator",
      "hmac-generator",
      "html-decoder",
      "html-encoder",
      "html-to-markdown",
      "json-diff-checker",
      "json-flatten-to-csv",
      "json-formatter",
      "json-minifier",
      "json-path-extractor",
      "json-schema-generator",
      "json-to-csv",
      "json-to-xml",
      "json-to-yaml",
      "json-validator",
      "jwt-decoder",
      "jwt-encoder",
      "lorem-ipsum-generator",
      "markdown-to-html",
      "mermaid-editor",
      "ndjson-formatter",
      "ndjson-to-csv",
      "password-generator",
      "query-string-builder",
      "query-string-parser",
      "random-string-generator",
      "regex-tester",
      "remove-duplicate-lines",
      "remove-empty-lines",
      "remove-extra-spaces",
      "remove-line-breaks",
      "reverse-text",
      "slug-generator",
      "sort-lines-alphabetically",
      "sql-formatter",
      "sql-minifier",
      "sql-to-csv",
      "text-diff-checker",
      "timestamp-converter",
      "url-decoder",
      "url-encoder",
      "url-parser",
      "uuid-generator",
      "word-counter",
      "xml-to-json",
      "xml-validator",
      "yaml-formatter",
      "yaml-to-json",
      "yaml-validator",
    ]);
  });

  describe("csv-to-json", () => {
    it("converts CSV with headers to JSON", () => {
      const result = transformations["csv-to-json"]("name,email\nAna,ana@example.com");
      expect(result.output).toContain('"name": "Ana"');
      expect(result.downloadFileName).toBe("converted.json");
      expect(result.downloadMimeType).toBe("application/json");
    });

    it("supports quoted CSV values", () => {
      const result = transformations["csv-to-json"]('name,note\nAna,"hello, world"');
      expect(result.output).toContain('"note": "hello, world"');
    });

    it("fills empty headers with generated column names", () => {
      const result = transformations["csv-to-json"](",email\nAna,ana@example.com");
      expect(result.output).toContain('"column_1": "Ana"');
      expect(result.output).toContain('"email": "ana@example.com"');
    });

    it("fills missing row values with empty strings", () => {
      const result = transformations["csv-to-json"]("name,email\nAna");
      expect(result.output).toContain('"name": "Ana"');
      expect(result.output).toContain('"email": ""');
    });

    it("throws for missing data rows", () => {
      expect(() => transformations["csv-to-json"]("name,email")).toThrow(
        "CSV to JSON requires a header row and at least one data row.",
      );
    });
  });

  describe("csv-to-sql", () => {
    it("generates create table and insert statements", () => {
      const result = transformations["csv-to-sql"](
        "id,name,active\n1,Ana,true\n2,Bob,false",
      );

      expect(result.output).toContain("CREATE TABLE");
      expect(result.output).toContain("INSERT INTO");
      expect(result.downloadFileName).toBe("generated.sql");
      expect(result.downloadMimeType).toBe("text/sql");
    });

    it("throws when csv has no data rows", () => {
      expect(() => transformations["csv-to-sql"]("id,name")).toThrow(
        "CSV to SQL requires a header row and at least one data row.",
      );
    });
  });

  describe("json-to-csv", () => {
    it("converts JSON array of objects to CSV", () => {
      const result = transformations["json-to-csv"](
        '[{"name":"Ana","email":"ana@example.com"}]',
      );
      expect(result.output).toBe("name,email\nAna,ana@example.com");
      expect(result.downloadFileName).toBe("converted.csv");
    });

    it("throws for non-array input", () => {
      expect(() => transformations["json-to-csv"]('{"name":"Ana"}')).toThrow(
        "JSON to CSV requires a non-empty array of objects.",
      );
    });

    it("throws for invalid JSON", () => {
      expect(() => transformations["json-to-csv"]("{bad json}")).toThrow(
        "JSON to CSV: invalid JSON syntax.",
      );
    });

    it("throws when array items are not objects", () => {
      expect(() => transformations["json-to-csv"]('[{"name":"Ana"}, 1]')).toThrow(
        "JSON to CSV requires every array item to be an object.",
      );
    });

    it("fills missing object keys with empty CSV cells", () => {
      const result = transformations["json-to-csv"](
        '[{"name":"Ana","email":"ana@example.com"},{"name":"Bob"}]',
      );
      expect(result.output).toBe("name,email\nAna,ana@example.com\nBob,");
    });

    it("throws when no object keys are available", () => {
      expect(() => transformations["json-to-csv"]("[{}]")).toThrow(
        "JSON to CSV could not find object keys to build columns.",
      );
    });
  });

  describe("csv-cleaner", () => {
    it("trims cells and removes empty rows", () => {
      const result = transformations["csv-cleaner"]("name,email\n Ana , ana@example.com \n,\n");
      expect(result.output).toBe("name,email\nAna,ana@example.com");
    });

    it("throws when no usable rows remain", () => {
      expect(() => transformations["csv-cleaner"]("\n\n")).toThrow("Please provide input.");
    });

    it("throws when rows exist but all cells are empty", () => {
      expect(() => transformations["csv-cleaner"](",,\n,")).toThrow(
        "CSV Cleaner found no usable rows after cleaning.",
      );
    });
  });

  describe("csv-column-mapper", () => {
    it("renames mapped headers and keeps others unchanged", () => {
      const result = transformations["csv-column-mapper"](
        "name:full_name,email:email_address\n\nname,email,city\nAna,ana@example.com,Melbourne",
      );
      expect(result.output).toBe("full_name,email_address,city\nAna,ana@example.com,Melbourne");
      expect(result.downloadFileName).toBe("mapped.csv");
      expect(result.downloadMimeType).toBe("text/csv");
    });

    it("throws when mapping and csv sections are missing", () => {
      expect(() => transformations["csv-column-mapper"]("name:full_name,name,email")).toThrow(
        "CSV Column Mapper requires mapping rules first, then a blank line, then CSV data.",
      );
    });

    it("throws on invalid mapping format", () => {
      expect(() => transformations["csv-column-mapper"]("name=full_name\n\nname,email\nAna,ana@example.com")).toThrow(
        "CSV Column Mapper mapping rules must use source:target format, e.g. name:full_name.",
      );
    });

    it("throws when mapping creates duplicate headers", () => {
      expect(() =>
        transformations["csv-column-mapper"](
          "first:name,last:name\n\nfirst,last\nAna,Doe",
        ),
      ).toThrow("CSV Column Mapper produced duplicate target headers. Adjust mapping rules.");
    });

    it("throws when csv section is missing", () => {
      expect(() => transformations["csv-column-mapper"]("name:full_name\n\n\n")).toThrow(
        "CSV Column Mapper requires mapping rules first, then a blank line, then CSV data.",
      );
    });
  });

  describe("csv-merge-tool", () => {
    it("merges csv blocks with union headers", () => {
      const result = transformations["csv-merge-tool"](
        "id,name\n1,Ana\n\nid,email\n2,bob@example.com",
      );
      expect(result.output).toBe("id,name,email\n1,Ana,\n2,,bob@example.com");
      expect(result.downloadFileName).toBe("merged.csv");
      expect(result.downloadMimeType).toBe("text/csv");
    });

    it("throws when second csv block is missing", () => {
      expect(() => transformations["csv-merge-tool"]("id,name\n1,Ana")).toThrow(
        "CSV Merge Tool requires two CSV blocks separated by a blank line.",
      );
    });
  });

  describe("csv-splitter", () => {
    it("splits csv rows into chunk previews", () => {
      const result = transformations["csv-splitter"]("2\n\nid,name\n1,Ana\n2,Bob\n3,Cam");
      expect(result.output).toContain("--- chunk_1.csv ---");
      expect(result.output).toContain("--- chunk_2.csv ---");
      expect(result.downloadFileName).toBe("split-preview.txt");
    });

    it("throws for invalid chunk size", () => {
      expect(() => transformations["csv-splitter"]("0\n\nid,name\n1,Ana")).toThrow(
        "CSV Splitter requires a positive whole number of rows per file.",
      );
    });
  });

  describe("csv-validator", () => {
    it("returns valid result for consistent rows", () => {
      const result = transformations["csv-validator"]("name,email\nAna,ana@example.com");
      expect(result.output).toContain("Valid CSV");
    });

    it("reports inconsistent rows", () => {
      const result = transformations["csv-validator"]("name,email\nAna,ana@example.com\nBob");
      expect(result.output).toContain("Row 3: expected 2 columns, found 1.");
    });
  });

  describe("csv-to-excel", () => {
    it("returns excel-compatible html output", () => {
      const result = transformations["csv-to-excel"]("name,sales\nAna,120");
      expect(result.output).toContain("<table>");
      expect(result.downloadFileName).toBe("converted.xls");
      expect(result.downloadMimeType).toBe("application/vnd.ms-excel");
    });

    it("escapes html in cells", () => {
      const result = transformations["csv-to-excel"]("name\n<script>alert(1)</script>");
      expect(result.output).toContain("&lt;script&gt;alert(1)&lt;/script&gt;");
    });
  });

  describe("excel-to-csv", () => {
    it("converts tab-separated input to csv", () => {
      const result = transformations["excel-to-csv"]("name\temail\nAna\tana@example.com");
      expect(result.output).toBe("name,email\nAna,ana@example.com");
    });

    it("keeps csv input compatible", () => {
      const result = transformations["excel-to-csv"]("name,email\nAna,ana@example.com");
      expect(result.output).toBe("name,email\nAna,ana@example.com");
    });

    it("throws on empty content", () => {
      expect(() => transformations["excel-to-csv"]("\n \n")).toThrow("Please provide input.");
    });
  });

  describe("json tools", () => {
    it("formats json", () => {
      const result = transformations["json-formatter"]('{"name":"Ana"}');
      expect(result.output).toBe('{\n  "name": "Ana"\n}');
    });

    it("validates json", () => {
      const result = transformations["json-validator"]('{"name":"Ana"}');
      expect(result.output).toBe("Valid JSON.");
    });

    it("minifies json", () => {
      const result = transformations["json-minifier"]('{\n  "name": "Ana"\n}');
      expect(result.output).toBe('{"name":"Ana"}');
      expect(result.downloadFileName).toBe("minified.json");
    });

    it("throws on invalid JSON for formatter", () => {
      expect(() => transformations["json-formatter"]("{bad json}")).toThrow(
        "JSON Formatter: invalid JSON syntax.",
      );
    });

    it("throws on invalid JSON for validator", () => {
      expect(() => transformations["json-validator"]("{bad json}")).toThrow(
        "JSON Validator: invalid JSON syntax at line 1, column 2.",
      );
    });

    it("rethrows non-syntax JSON parsing errors for validator", () => {
      const originalParse = JSON.parse;
      JSON.parse = () => {
        throw new TypeError("unexpected parser failure");
      };

      try {
        expect(() => transformations["json-validator"]("{\"name\":\"Ana\"}")).toThrow(
          "unexpected parser failure",
        );
      } finally {
        JSON.parse = originalParse;
      }
    });

    it("throws on invalid JSON for minifier", () => {
      expect(() => transformations["json-minifier"]("{bad json}")).toThrow(
        "JSON Minifier: invalid JSON syntax.",
      );
    });

    it("flattens nested json to csv", () => {
      const result = transformations["json-flatten-to-csv"](
        '{"user":{"name":"Ana","address":{"city":"Melbourne"}}}',
      );

      expect(result.output).toContain("user.name");
      expect(result.output).toContain("user.address.city");
      expect(result.downloadFileName).toBe("flattened.csv");
      expect(result.downloadMimeType).toBe("text/csv");
    });

    it("throws for invalid input in flatten tool", () => {
      expect(() => transformations["json-flatten-to-csv"]("[]")).toThrow(
        "JSON Flatten requires a non-empty object or array of objects.",
      );
    });

    it("generates schema from JSON sample", () => {
      const result = transformations["json-schema-generator"](
        '{"id":1,"name":"Ana","active":true}',
      );
      expect(result.output).toContain('"$schema": "http://json-schema.org/draft-07/schema#"');
      expect(result.output).toContain('"id"');
      expect(result.output).toContain('"type": "integer"');
      expect(result.downloadFileName).toBe("schema.json");
      expect(result.downloadMimeType).toBe("application/json");
    });

    it("throws on invalid json for schema generator", () => {
      expect(() => transformations["json-schema-generator"]("{bad json}")).toThrow(
        "JSON Schema Generator: invalid JSON syntax.",
      );
    });

    it("generates schema for empty array input", () => {
      const result = transformations["json-schema-generator"]("[]");
      expect(result.output).toContain('"type": "array"');
      expect(result.output).toContain('"items": {}');
    });

    it("supports mixed-type arrays using anyOf", () => {
      const result = transformations["json-schema-generator"]('[1,"two",{"id":3}]');
      expect(result.output).toContain('"anyOf"');
    });
  });

  describe("ndjson-to-csv", () => {
    it("converts ndjson lines into csv", () => {
      const result = transformations["ndjson-to-csv"](
        '{"id":1,"event":"signup"}\n{"id":2,"event":"login"}',
      );
      expect(result.output).toBe("id,event\n1,signup\n2,login");
      expect(result.downloadFileName).toBe("converted.csv");
      expect(result.downloadMimeType).toBe("text/csv");
    });

    it("serializes object values in csv cells", () => {
      const result = transformations["ndjson-to-csv"]('{"id":1,"meta":{"plan":"pro"}}');
      expect(result.output).toContain('"{""plan"":""pro""}"');
    });

    it("throws with line number for invalid ndjson", () => {
      expect(() => transformations["ndjson-to-csv"]('{"id":1}\n{bad}')).toThrow(
        "NDJSON to CSV found invalid JSON at line 2.",
      );
    });

    it("throws when ndjson input has no object lines", () => {
      expect(() => transformations["ndjson-to-csv"]("\n\n")).toThrow(
        "Please provide input.",
      );
    });

    it("throws when ndjson line is not an object", () => {
      expect(() => transformations["ndjson-to-csv"]('{"id":1}\n[1,2]')).toThrow(
        "NDJSON to CSV expects objects on each line. Invalid record at line 2.",
      );
    });
  });

  describe("ndjson-formatter", () => {
    it("formats ndjson into pretty json blocks", () => {
      const result = transformations["ndjson-formatter"]('{"id":1}\n{"id":2}');
      expect(result.output).toContain('{\n  "id": 1\n}');
      expect(result.output).toContain('{\n  "id": 2\n}');
    });

    it("throws for invalid ndjson line", () => {
      expect(() => transformations["ndjson-formatter"]('{"id":1}\n{bad}')).toThrow(
        "NDJSON Formatter found invalid JSON at line 2.",
      );
    });
  });

  describe("json-path-extractor", () => {
    it("extracts nested json value by path", () => {
      const result = transformations["json-path-extractor"](
        'user.profile.email\n{"user":{"profile":{"email":"ana@example.com"}}}',
      );
      expect(result.output).toBe("ana@example.com");
    });

    it("throws when path is missing", () => {
      expect(() =>
        transformations["json-path-extractor"]('user.profile.phone\n{"user":{"profile":{"email":"ana@example.com"}}}'),
      ).toThrow("JSON Path Extractor: path not found in input JSON.");
    });
  });

  describe("jwt-decoder", () => {
    it("decodes jwt header and payload", () => {
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." +
        "eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ." +
        "SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
      const result = transformations["jwt-decoder"](token);
      expect(result.output).toContain('"alg": "HS256"');
      expect(result.output).toContain('"sub": "1234567890"');
      expect(result.output).toContain('"signaturePresent": true');
      expect(result.downloadFileName).toBe("decoded-jwt.json");
      expect(result.downloadMimeType).toBe("application/json");
    });

    it("throws for invalid token format", () => {
      expect(() => transformations["jwt-decoder"]("not-a-jwt")).toThrow(
        "JWT Decoder requires a token with header.payload.signature format.",
      );
    });

    it("accepts bearer token input", () => {
      const token =
        "Bearer " +
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." +
        "eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFuYSJ9." +
        "SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
      const result = transformations["jwt-decoder"](token);
      expect(result.output).toContain('"name": "Ana"');
    });

    it("throws when token segments are not decodable json", () => {
      expect(() => transformations["jwt-decoder"]("abc.def.ghi")).toThrow(
        "JWT Decoder could not decode token. Ensure it is a valid JWT.",
      );
    });
  });

  describe("cron-expression-parser", () => {
    it("explains 5-field cron expressions", () => {
      const result = transformations["cron-expression-parser"]("*/15 9-17 * * 1-5");
      expect(result.output).toContain("Every 15 minutes");
      expect(result.output).toContain("day-of-week");
    });

    it("throws for invalid field count", () => {
      expect(() => transformations["cron-expression-parser"]("* * * *")).toThrow(
        "Cron Expression Parser requires 5 fields: minute hour day-of-month month day-of-week.",
      );
    });

    it("rejects zero step values", () => {
      expect(() => transformations["cron-expression-parser"]("*/0 * * * *")).toThrow(
        "Cron Expression Parser: minute step value must be between 1 and 59.",
      );
    });

    it("supports day-of-week 7 as Sunday", () => {
      const result = transformations["cron-expression-parser"]("0 9 * * 7");
      expect(result.output).toContain("Sunday (7)");
    });
  });

  describe("sql tools", () => {
    it("formats sql clauses with line breaks", () => {
      const result = transformations["sql-formatter"](
        "select id,name from users where active = 1 order by name",
      );
      expect(result.output).toContain("SELECT");
      expect(result.output).toContain("\nFROM");
      expect(result.downloadFileName).toBe("formatted.sql");
    });

    it("minifies sql by removing comments and whitespace", () => {
      const result = transformations["sql-minifier"]("-- c\nSELECT id, name FROM users WHERE active = 1;");
      expect(result.output).toBe("SELECT id,name FROM users WHERE active=1;");
      expect(result.downloadFileName).toBe("minified.sql");
    });

    it("converts sql insert values to csv", () => {
      const result = transformations["sql-to-csv"](
        "INSERT INTO users (id,name,city) VALUES (1,'Ana','Melbourne'),(2,'Bob','Sydney');",
      );
      expect(result.output).toBe("id,name,city\n1,Ana,Melbourne\n2,Bob,Sydney");
      expect(result.downloadFileName).toBe("converted.csv");
    });
  });

  describe("url-parser", () => {
    it("parses url into component json", () => {
      const result = transformations["url-parser"](
        "https://example.com:8080/path?p=1&p=2#hash",
      );
      expect(result.output).toContain('"host": "example.com:8080"');
      expect(result.output).toContain('"p": [');
      expect(result.downloadFileName).toBe("parsed-url.json");
    });

    it("throws for invalid absolute url", () => {
      expect(() => transformations["url-parser"]("/relative/path")).toThrow(
        "URL Parser requires a valid absolute URL including protocol (e.g. https://...).",
      );
    });
  });

  describe("date-format-converter", () => {
    it("converts unix timestamp into multiple date formats", () => {
      const result = transformations["date-format-converter"]("1710000000");
      expect(result.output).toContain('"unixSeconds": 1710000000');
      expect(result.output).toContain('"dateOnlyUtc":');
    });

    it("throws for invalid date input", () => {
      expect(() => transformations["date-format-converter"]("not-a-date")).toThrow(
        "Date Format Converter requires a valid date string or unix timestamp.",
      );
    });
  });

  describe("markdown/html converters", () => {
    it("converts markdown to html", () => {
      const result = transformations["markdown-to-html"]("# Title\n\n- one\n- two");
      expect(result.output).toContain("<h1>Title</h1>");
      expect(result.output).toContain("<ul>");
      expect(result.downloadFileName).toBe("converted.html");
      expect(result.downloadMimeType).toBe("text/html");
    });

    it("converts html to markdown", () => {
      const result = transformations["html-to-markdown"]("<h2>Title</h2><p>Body</p>");
      expect(result.output).toContain("## Title");
      expect(result.output).toContain("Body");
    });
  });

  describe("json/xml tools", () => {
    it("diffs two json documents", () => {
      const result = transformations["json-diff-checker"](
        '{"user":{"role":"admin"}}\n\n{"user":{"role":"editor","active":true}}',
      );
      expect(result.output).toContain("Added paths:");
      expect(result.output).toContain("user.active");
      expect(result.output).toContain("Changed paths:");
      expect(result.output).toContain("user.role");
    });

    it("throws when json diff input is not two blocks", () => {
      expect(() => transformations["json-diff-checker"]('{"a":1}')).toThrow(
        "JSON Diff Checker requires two text blocks separated by a blank line.",
      );
    });

    it("validates xml", () => {
      const result = transformations["xml-validator"]("<root><item>1</item></root>");
      expect(result.output).toBe("Valid XML.");
    });

    it("throws for invalid xml", () => {
      expect(() => transformations["xml-validator"]("<root><item></root>")).toThrow(
        "XML Validator: invalid XML input.",
      );
    });

    it("converts xml to json", () => {
      const result = transformations["xml-to-json"]('<user id="1"><name>Ana</name></user>');
      expect(result.output).toContain('"user"');
      expect(result.output).toContain('"@attributes"');
      expect(result.downloadFileName).toBe("converted.json");
      expect(result.downloadMimeType).toBe("application/json");
    });

    it("converts json to xml", () => {
      const result = transformations["json-to-xml"]('{"user":{"name":"Ana"}}');
      expect(result.output).toContain("<user>");
      expect(result.output).toContain("<name>Ana</name>");
      expect(result.downloadFileName).toBe("converted.xml");
      expect(result.downloadMimeType).toBe("application/xml");
    });

    it("throws for non-object json to xml input", () => {
      expect(() => transformations["json-to-xml"]('[{"name":"Ana"}]')).toThrow(
        "JSON to XML requires a JSON object input.",
      );
    });
  });

  describe("text tools", () => {
    it("removes duplicate lines while preserving first seen order", () => {
      const result = transformations["remove-duplicate-lines"]("apple\nbanana\napple\nbanana\npear");
      expect(result.output).toBe("apple\nbanana\npear");
    });

    it("sorts lines alphabetically case-insensitively", () => {
      const result = transformations["sort-lines-alphabetically"]("zebra\napple\nBanana");
      expect(result.output).toBe("apple\nBanana\nzebra");
    });

    it("extracts unique emails", () => {
      const result = transformations["extract-emails"](
        "a@b.com b@c.io a@b.com not-an-email",
      );
      expect(result.output).toBe("a@b.com\nb@c.io");
    });

    it("returns no email message", () => {
      const result = transformations["extract-emails"]("no email here");
      expect(result.output).toBe("No emails found.");
    });

    it("extracts numbers including signed and decimal", () => {
      const result = transformations["extract-numbers"]("temp -3.5 and +10 and 7");
      expect(result.output).toBe("-3.5\n+10\n7");
    });

    it("returns no number message", () => {
      const result = transformations["extract-numbers"]("no digits");
      expect(result.output).toBe("No numbers found.");
    });

    it("extracts unique urls", () => {
      const result = transformations["extract-urls"](
        "Visit https://example.com and https://google.com and https://example.com.",
      );
      expect(result.output).toBe("https://example.com\nhttps://google.com");
    });

    it("returns no url message", () => {
      const result = transformations["extract-urls"]("no links here");
      expect(result.output).toBe("No URLs found.");
    });

    it("counts words, characters, lines, and paragraphs", () => {
      const result = transformations["word-counter"](
        "First paragraph here.\n\nSecond paragraph now.",
      );
      const parsed = JSON.parse(result.output) as {
        words: number;
        characters: number;
        lines: number;
        paragraphs: number;
      };
      expect(parsed.words).toBe(6);
      expect(parsed.lines).toBe(3);
      expect(parsed.paragraphs).toBe(2);
      expect(result.downloadFileName).toBe("word-count.json");
      expect(result.downloadMimeType).toBe("application/json");
    });

    it("converts text to requested case mode", () => {
      expect(transformations["case-converter"]("snake\n\nCustomer Order ID").output).toBe(
        "customer_order_id",
      );
      expect(transformations["case-converter"]("kebab\n\nCustomer Order ID").output).toBe(
        "customer-order-id",
      );
      expect(transformations["case-converter"]("camel\n\nCustomer Order ID").output).toBe(
        "customerOrderId",
      );
    });

    it("throws for invalid case converter mode", () => {
      expect(() => transformations["case-converter"]("pascal\n\nHello world")).toThrow(
        "Case Converter mode must be one of: uppercase, lowercase, title, sentence, kebab, snake, camel.",
      );
    });

    it("removes line breaks in default single-line mode", () => {
      const result = transformations["remove-line-breaks"]("Line one\nLine two\n\nLine three");
      expect(result.output).toBe("Line one Line two Line three");
    });

    it("normalizes line breaks in normalize mode", () => {
      const result = transformations["remove-line-breaks"]("normalize\n\nLine one\n\n\n\nLine two");
      expect(result.output).toBe("Line one\n\nLine two");
    });

    it("throws for invalid remove-line-breaks mode", () => {
      expect(() => transformations["remove-line-breaks"]("mode=compact\n\nLine one")).toThrow(
        "Remove Line Breaks mode must be `single-line` or `normalize`.",
      );
    });

    it("removes extra spaces and trims lines", () => {
      const result = transformations["remove-extra-spaces"]("  Hello   world  \n  this\t\tis   text ");
      expect(result.output).toBe("Hello world\nthis is text");
    });

    it("removes empty lines from multiline text", () => {
      const result = transformations["remove-empty-lines"]("apple\n\nbanana\n \n\norange");
      expect(result.output).toBe("apple\nbanana\norange");
    });

    it("reverses text by characters by default", () => {
      const result = transformations["reverse-text"]("hello world");
      expect(result.output).toBe("dlrow olleh");
    });

    it("reverses text by words in words mode", () => {
      const result = transformations["reverse-text"]("words\n\nhello world again");
      expect(result.output).toBe("again world hello");
    });

    it("counts characters, words, and lines", () => {
      const result = transformations["character-counter"]("hello world\nline two");
      const parsed = JSON.parse(result.output) as {
        characters: number;
        charactersExcludingSpaces: number;
        words: number;
        lines: number;
      };
      expect(parsed.characters).toBe(20);
      expect(parsed.words).toBe(4);
      expect(parsed.lines).toBe(2);
      expect(result.downloadFileName).toBe("character-count.json");
      expect(result.downloadMimeType).toBe("application/json");
    });

    it("generates url-friendly slugs", () => {
      const result = transformations["slug-generator"]("How to Import CSV into SQL!");
      expect(result.output).toBe("how-to-import-csv-into-sql");
    });

    it("throws when slug cannot be generated", () => {
      expect(() => transformations["slug-generator"]("!!!")).toThrow(
        "Slug Generator could not build a slug from the provided input.",
      );
    });

    it("compares two text blocks by line", () => {
      const result = transformations["text-diff-checker"]("apple\nbanana\n\napple\npear");
      expect(result.output).toContain("Only in first input:");
      expect(result.output).toContain("- banana");
      expect(result.output).toContain("Only in second input:");
      expect(result.output).toContain("- pear");
    });

    it("throws when text diff input does not include two blocks", () => {
      expect(() => transformations["text-diff-checker"]("only one block")).toThrow(
        "Text Diff Checker requires two text blocks separated by a blank line.",
      );
    });
  });

  describe("developer tools", () => {
    it("generates md5 hash in fallback transformation", () => {
      const result = transformations["hash-generator"]("hello");
      expect(result.output).toBe("5d41402abc4b2a76b9719d911017c592");
      expect(result.downloadFileName).toBe("hash.txt");
      expect(result.downloadMimeType).toBe("text/plain");
    });

    it("returns mermaid source for editor transformation", () => {
      const source = "flowchart TD\nA-->B";
      const result = transformations["mermaid-editor"](source);
      expect(result.output).toBe(source);
      expect(result.downloadFileName).toBe("diagram.mmd");
      expect(result.downloadMimeType).toBe("text/plain");
    });

    it("throws when mermaid editor input is empty", () => {
      expect(() => transformations["mermaid-editor"]("   ")).toThrow("Please provide input.");
    });

    it("encodes payload object into unsigned jwt", () => {
      const result = transformations["jwt-encoder"]('{"sub":"user_1","role":"admin"}');
      expect(result.output.split(".")).toHaveLength(3);
      expect(result.output.endsWith(".")).toBe(true);
      expect(result.downloadFileName).toBe("encoded-jwt.txt");
      expect(result.downloadMimeType).toBe("text/plain");
    });

    it("supports custom header block for jwt encoding", () => {
      const result = transformations["jwt-encoder"](
        '{"alg":"HS256","typ":"JWT"}\n\n{"sub":"user_1"}',
      );
      expect(result.output.split(".")).toHaveLength(3);
    });

    it("throws when jwt payload is not an object", () => {
      expect(() => transformations["jwt-encoder"]("[1,2,3]")).toThrow(
        "JWT Encoder payload must be a JSON object.",
      );
    });

    it("encodes text to base64", () => {
      const result = transformations["base64-encoder"]("hello world");
      expect(result.output).toBe("aGVsbG8gd29ybGQ=");
    });

    it("encodes base64 via browser branch when btoa/TextEncoder are available", () => {
      const originalBtoa = globalThis.btoa;
      const originalTextEncoder = globalThis.TextEncoder;
      const fakeBtoa = (value: string) => `B64:${value.length}`;
      class FakeTextEncoder {
        encode(value: string) {
          return Uint8Array.from(value.split("").map((ch) => ch.charCodeAt(0)));
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (globalThis as any).btoa = fakeBtoa;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (globalThis as any).TextEncoder = FakeTextEncoder;

      try {
        const result = transformations["base64-encoder"]("abc");
        expect(result.output).toBe("B64:3");
      } finally {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (globalThis as any).btoa = originalBtoa;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (globalThis as any).TextEncoder = originalTextEncoder;
      }
    });

    it("decodes valid base64 text", () => {
      const result = transformations["base64-decoder"]("aGVsbG8gd29ybGQ=");
      expect(result.output).toBe("hello world");
    });

    it("decodes base64 via browser branch when atob/TextDecoder are available", () => {
      const originalAtob = globalThis.atob;
      const originalTextDecoder = globalThis.TextDecoder;
      const fakeAtob = () => "abc";
      class FakeTextDecoder {
        decode(bytes: Uint8Array) {
          return String.fromCharCode(...bytes);
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (globalThis as any).atob = fakeAtob;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (globalThis as any).TextDecoder = FakeTextDecoder;

      try {
        const result = transformations["base64-decoder"]("aGVsbG8=");
        expect(result.output).toBe("abc");
      } finally {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (globalThis as any).atob = originalAtob;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (globalThis as any).TextDecoder = originalTextDecoder;
      }
    });

    it("throws for invalid base64 text", () => {
      expect(() => transformations["base64-decoder"]("not_base64")).toThrow(
        "Base64 Decoder requires valid Base64 input.",
      );
    });

    it("handles base64 decoding failure after passing validation", () => {
      const originalAtob = globalThis.atob;
      const originalTextDecoder = globalThis.TextDecoder;
      const throwingAtob = () => {
        throw new Error("decode failed");
      };
      // Force the branch that uses atob/TextDecoder.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (globalThis as any).atob = throwingAtob;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (globalThis as any).TextDecoder = class {
        decode() {
          return "";
        }
      };

      try {
        expect(() => transformations["base64-decoder"]("aGVsbG8=")).toThrow(
          "Base64 Decoder requires valid Base64 input.",
        );
      } finally {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (globalThis as any).atob = originalAtob;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (globalThis as any).TextDecoder = originalTextDecoder;
      }
    });

    it("encodes URL components", () => {
      const result = transformations["url-encoder"]("name=John Doe&city=NY");
      expect(result.output).toBe("name%3DJohn%20Doe%26city%3DNY");
    });

    it("decodes URL components", () => {
      const result = transformations["url-decoder"]("name%3DJohn%20Doe%26city%3DNY");
      expect(result.output).toBe("name=John Doe&city=NY");
    });

    it("throws for malformed url-encoded input", () => {
      expect(() => transformations["url-decoder"]("%E0%A4%A")).toThrow(
        "URL Decoder requires valid URL-encoded input.",
      );
    });

    it("generates one uuid by default", () => {
      const result = transformations["uuid-generator"]("");
      expect(result.output).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
      );
    });

    it("generates multiple uuids when count is provided", () => {
      const result = transformations["uuid-generator"]("3");
      const lines = result.output.split("\n");
      expect(lines).toHaveLength(3);
      lines.forEach((line) => {
        expect(line).toMatch(
          /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
        );
      });
    });

    it("throws for invalid uuid count", () => {
      expect(() => transformations["uuid-generator"]("0")).toThrow(
        "UUID Generator expects a whole number between 1 and 100.",
      );
      expect(() => transformations["uuid-generator"]("1.5")).toThrow(
        "UUID Generator expects a whole number between 1 and 100.",
      );
    });

    it("generates random alphanumeric strings", () => {
      const result = transformations["random-string-generator"]("24");
      expect(result.output).toHaveLength(24);
      expect(result.output).toMatch(/^[A-Za-z0-9]+$/);
    });

    it("throws for invalid random string length", () => {
      expect(() => transformations["random-string-generator"]("0")).toThrow(
        "Random String Generator expects a whole number between 1 and 512.",
      );
    });

    it("generates passwords with default length", () => {
      const result = transformations["password-generator"]("");
      expect(result.output).toHaveLength(16);
      expect(result.downloadFileName).toBe("password.txt");
      expect(result.downloadMimeType).toBe("text/plain");
    });

    it("throws for invalid password length", () => {
      expect(() => transformations["password-generator"]("4")).toThrow(
        "Password Generator expects a whole number between 8 and 128.",
      );
    });

    it("builds query strings from json object", () => {
      const result = transformations["query-string-builder"]('{"a":1,"b":"test","tags":["x","y"]}');
      expect(result.output).toBe("a=1&b=test&tags=x&tags=y");
    });

    it("throws for non-object query builder input", () => {
      expect(() => transformations["query-string-builder"]('["a","b"]')).toThrow(
        "Query String Builder requires a JSON object input.",
      );
    });

    it("throws for nested object values in query builder", () => {
      expect(() => transformations["query-string-builder"]('{"filters":{"active":true}}')).toThrow(
        "Query String Builder does not support nested objects. Flatten values first.",
      );
    });

    it("parses query string into json", () => {
      const result = transformations["query-string-parser"]("?a=1&tag=x&tag=y");
      expect(result.output).toContain('"a": "1"');
      expect(result.output).toContain('"tag": [');
      expect(result.downloadFileName).toBe("parsed-query.json");
      expect(result.downloadMimeType).toBe("application/json");
    });

    it("returns empty object for full url without query", () => {
      const result = transformations["query-string-parser"]("https://example.com/path");
      expect(result.output).toBe("{}");
    });

    it("generates hmac digest from secret and message blocks", () => {
      const result = transformations["hmac-generator"]("secret\n\nmessage");
      expect(result.output).toMatch(/^[a-f0-9]{64}$/);
      expect(result.downloadFileName).toBe("hmac.txt");
      expect(result.downloadMimeType).toBe("text/plain");
    });

    it("throws when hmac input missing second block", () => {
      expect(() => transformations["hmac-generator"]("secret only")).toThrow(
        "HMAC Generator requires two text blocks separated by a blank line.",
      );
    });

    it("generates bcrypt hash", () => {
      const result = transformations["bcrypt-hash-generator"]("super-secret");
      expect(result.output).toMatch(/^\$2[aby]\$\d{2}\$.{53}$/);
      expect(result.downloadFileName).toBe("bcrypt-hash.txt");
      expect(result.downloadMimeType).toBe("text/plain");
    });

    it("throws for invalid bcrypt rounds", () => {
      expect(() => transformations["bcrypt-hash-generator"]("secret\n\n2")).toThrow(
        "Bcrypt Hash Generator expects a whole number between 4 and 15.",
      );
    });

    it("renders csv viewer markdown table with delimiter config", () => {
      const result = transformations["csv-viewer"](
        "delimiter=semicolon\n\nid;name;city\n1;Ana;Melbourne\n2;Bob;Sydney",
      );
      expect(result.output).toContain("| id | name | city |");
      expect(result.output).toContain("| 1 | Ana | Melbourne |");
      expect(result.output).toContain("| 2 | Bob | Sydney |");
    });

    it("throws for invalid csv viewer delimiter", () => {
      expect(() => transformations["csv-viewer"]("delimiter=space\n\na,b\n1,2")).toThrow(
        "CSV Viewer delimiter must be comma, semicolon, tab, or pipe.",
      );
    });

    it("encodes and decodes html entities", () => {
      const encoded = transformations["html-encoder"]("<div>Tom & 'Jerry'</div>");
      expect(encoded.output).toBe("&lt;div&gt;Tom &amp; &#39;Jerry&#39;&lt;/div&gt;");
      const decoded = transformations["html-decoder"](encoded.output);
      expect(decoded.output).toBe("<div>Tom & 'Jerry'</div>");
    });

    it("converts yaml to json", () => {
      const result = transformations["yaml-to-json"]("version: 1\nservice:\n  name: api");
      expect(result.output).toContain('"version": 1');
      expect(result.output).toContain('"service"');
      expect(result.downloadFileName).toBe("converted.json");
      expect(result.downloadMimeType).toBe("application/json");
    });

    it("formats yaml content", () => {
      const result = transformations["yaml-formatter"]("service: {name: api, ports: [3000, 3001]}");
      expect(result.output).toContain("service:");
      expect(result.output).toContain("name: api");
      expect(result.output).toContain("- 3000");
      expect(result.downloadFileName).toBe("formatted.yaml");
      expect(result.downloadMimeType).toBe("application/x-yaml");
    });

    it("converts json to yaml", () => {
      const result = transformations["json-to-yaml"]('{"service":{"name":"api"},"ports":[80,443]}');
      expect(result.output).toContain("service:");
      expect(result.output).toContain("name: api");
      expect(result.output).toContain("- 80");
      expect(result.downloadFileName).toBe("converted.yaml");
      expect(result.downloadMimeType).toBe("application/x-yaml");
    });

    it("builds cron expression from config object", () => {
      const result = transformations["cron-expression-builder"](
        '{"minute":"30","hour":"9","dayOfMonth":"*","month":"*","dayOfWeek":"1-5"}',
      );
      expect(result.output).toBe("30 9 * * 1-5");
      expect(result.downloadFileName).toBe("cron-expression.txt");
      expect(result.downloadMimeType).toBe("text/plain");
    });

    it("throws when cron builder input is not object", () => {
      expect(() => transformations["cron-expression-builder"]('["*","*","*","*","*"]')).toThrow(
        "Cron Expression Builder requires a JSON object input.",
      );
    });

    it("throws when cron builder creates out-of-range fields", () => {
      expect(() =>
        transformations["cron-expression-builder"](
          '{"minute":"70","hour":"9","dayOfMonth":"*","month":"*","dayOfWeek":"1-5"}',
        ),
      ).toThrow("Cron Expression Parser: minute value must be between 0 and 59.");
    });

    it("converts simple curl command to fetch", () => {
      const result = transformations["curl-to-fetch"]("curl https://api.example.com");
      expect(result.output).toBe('fetch("https://api.example.com");');
    });

    it("converts curl with headers and body to fetch options", () => {
      const result = transformations["curl-to-fetch"](
        "curl -X POST https://api.example.com -H 'Content-Type: application/json' -d '{\"name\":\"Ana\"}'",
      );
      expect(result.output).toContain('fetch("https://api.example.com", {');
      expect(result.output).toContain('method: "POST"');
      expect(result.output).toContain('"Content-Type": "application/json"');
      expect(result.output).toContain('body: "{\\"name\\":\\"Ana\\"}"');
    });

    it("throws for non-curl input in curl to fetch", () => {
      expect(() => transformations["curl-to-fetch"]("https://api.example.com")).toThrow(
        "Curl to Fetch Converter requires input starting with `curl`.",
      );
    });

    it("uses the real URL when curl includes output flag", () => {
      const result = transformations["curl-to-fetch"](
        "curl -o out.json https://api.example.com/v1/users",
      );
      expect(result.output).toBe('fetch("https://api.example.com/v1/users");');
    });

    it("generates lorem ipsum by words mode", () => {
      const result = transformations["lorem-ipsum-generator"]("words\n5");
      const words = result.output.split(/\s+/).filter(Boolean);
      expect(words).toHaveLength(5);
    });

    it("generates lorem ipsum by paragraphs mode", () => {
      const result = transformations["lorem-ipsum-generator"]("paragraphs\n2");
      const paragraphs = result.output.split(/\n\s*\n/);
      expect(paragraphs).toHaveLength(2);
    });

    it("validates yaml input", () => {
      const result = transformations["yaml-validator"]("version: 1\nservices:\n  api:\n    image: node:20");
      expect(result.output).toBe("Valid YAML.");
    });

    it("throws for invalid yaml input", () => {
      expect(() => transformations["yaml-validator"]("services:\n  - name: api\n   image: bad-indent")).toThrow(
        "YAML Validator:",
      );
    });

    it("uses fallback UUID generation when randomUUID is unavailable", () => {
      const originalCrypto = globalThis.crypto;
      Object.defineProperty(globalThis, "crypto", {
        value: {},
        configurable: true,
      });

      try {
        const result = transformations["uuid-generator"]("1");
        expect(result.output).toMatch(
          /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
        );
      } finally {
        Object.defineProperty(globalThis, "crypto", {
          value: originalCrypto,
          configurable: true,
        });
      }
    });

    it("tests regex with /pattern/flags format", () => {
      const result = transformations["regex-tester"]("/\\b\\w{4}\\b/g\nThis line has many word tokens.");
      expect(result.output).toContain("Total matches:");
      expect(result.output).toContain("1. This");
    });

    it("tests regex with plain pattern text", () => {
      const result = transformations["regex-tester"]("\\d+\nOrder 42 has 3 items.");
      expect(result.output).toContain("Total matches: 2");
      expect(result.output).toContain("1. 42");
      expect(result.output).toContain("2. 3");
    });

    it("returns no match output for regex tester", () => {
      const result = transformations["regex-tester"]("/xyz/g\nalpha beta gamma");
      expect(result.output).toContain("Total matches: 0");
    });

    it("throws for invalid regex pattern", () => {
      expect(() => transformations["regex-tester"]("/([a-z]/g\ntext")).toThrow(
        "Regex Tester requires a valid regular expression pattern.",
      );
    });

    it("throws when regex test text is missing", () => {
      expect(() => transformations["regex-tester"]("/test/g")).toThrow(
        "Regex Tester requires test text below the pattern.",
      );
    });

    it("throws when regex descriptor line is empty", () => {
      expect(() => transformations["regex-tester"]("\ntext to test")).toThrow(
        "Regex Tester requires a pattern on the first line.",
      );
    });

    it("converts unix seconds timestamp to normalized output", () => {
      const result = transformations["timestamp-converter"]("1710000000");
      const parsed = JSON.parse(result.output) as {
        unixSeconds: number;
        unixMilliseconds: number;
        utc: string;
      };
      expect(parsed.unixSeconds).toBe(1710000000);
      expect(parsed.unixMilliseconds).toBe(1710000000000);
      expect(parsed.utc).toBe("2024-03-09T16:00:00.000Z");
    });

    it("handles negative unix seconds correctly", () => {
      const result = transformations["timestamp-converter"]("-1");
      const parsed = JSON.parse(result.output) as {
        unixSeconds: number;
        unixMilliseconds: number;
        utc: string;
      };
      expect(parsed.unixSeconds).toBe(-1);
      expect(parsed.unixMilliseconds).toBe(-1000);
      expect(parsed.utc).toBe("1969-12-31T23:59:59.000Z");
    });

    it("keeps unix milliseconds without scaling", () => {
      const result = transformations["timestamp-converter"]("1710000000000");
      const parsed = JSON.parse(result.output) as {
        unixSeconds: number;
        unixMilliseconds: number;
      };
      expect(parsed.unixMilliseconds).toBe(1710000000000);
      expect(parsed.unixSeconds).toBe(1710000000);
    });

    it("converts ISO date string timestamp", () => {
      const result = transformations["timestamp-converter"]("2024-01-01T00:00:00Z");
      const parsed = JSON.parse(result.output) as {
        unixSeconds: number;
        utc: string;
      };
      expect(parsed.utc).toBe("2024-01-01T00:00:00.000Z");
      expect(parsed.unixSeconds).toBe(1704067200);
    });

    it("throws for invalid timestamp input", () => {
      expect(() => transformations["timestamp-converter"]("not-a-date")).toThrow(
        "Timestamp Converter requires a valid timestamp or date string.",
      );
    });

    it("throws for timestamp numeric overflow input", () => {
      const huge = "9".repeat(400);
      expect(() => transformations["timestamp-converter"](huge)).toThrow(
        "Timestamp Converter requires a valid timestamp or date string.",
      );
    });
  });

  describe("shared invalid input handling", () => {
    it("throws for empty input across all transformation functions", () => {
      Object.entries(transformations).forEach(([slug, transform]) => {
        if (
          slug === "uuid-generator" ||
          slug === "password-generator" ||
          slug === "random-string-generator"
        ) {
          return;
        }
        expect(() => transform("  \n  ")).toThrow("Please provide input.");
        expect(typeof slug).toBe("string");
      });
    });

    it("throws for malformed quoted CSV where applicable", () => {
      expect(() => transformations["csv-to-json"]('name,email\n"Ana,ana@example.com')).toThrow(
        "CSV appears malformed: unmatched quote detected.",
      );
      expect(() => transformations["csv-validator"]('name,email\n"Ana,ana@example.com')).toThrow(
        "CSV appears malformed: unmatched quote detected.",
      );
    });
  });
});
