import { readFileSync } from "fs";
import { parse } from "papaparse";

export function loadEntries(file: string) {
  const data = readFileSync(file).toString();
  const entries: string[] = [];
  parse(data, {
    header: false,
    step: entry => {
      entries.push((entry.data as string[]).join());
    },
  });
  if (new Set(entries.map(e => e.toLowerCase())).size !== entries.length) {
    throw Error("Duplicate entries detected in given CSV.");
  }
  return entries;
}
