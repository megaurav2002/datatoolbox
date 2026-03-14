"use client";

import { useMemo, useState } from "react";
import ToolOutput from "@/components/ToolOutput";
import { transformations } from "@/lib/transformations";

type FieldMode = "every" | "value";

function buildField(mode: FieldMode, value: number): string {
  return mode === "every" ? "*" : String(value);
}

export default function CronExpressionBuilderTool() {
  const [minuteMode, setMinuteMode] = useState<FieldMode>("value");
  const [hourMode, setHourMode] = useState<FieldMode>("value");
  const [dayMode, setDayMode] = useState<FieldMode>("every");
  const [monthMode, setMonthMode] = useState<FieldMode>("every");
  const [weekdayMode, setWeekdayMode] = useState<FieldMode>("every");
  const [minute, setMinute] = useState(0);
  const [hour, setHour] = useState(9);
  const [dayOfMonth, setDayOfMonth] = useState(1);
  const [month, setMonth] = useState(1);
  const [dayOfWeek, setDayOfWeek] = useState(1);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const payload = useMemo(
    () => ({
      minute: buildField(minuteMode, minute),
      hour: buildField(hourMode, hour),
      dayOfMonth: buildField(dayMode, dayOfMonth),
      month: buildField(monthMode, month),
      dayOfWeek: buildField(weekdayMode, dayOfWeek),
    }),
    [dayMode, dayOfMonth, dayOfWeek, hour, hourMode, minute, minuteMode, month, monthMode, weekdayMode],
  );

  const onGenerate = () => {
    try {
      const transform = transformations["cron-expression-builder"];
      const result = transform(JSON.stringify(payload));
      setOutput(result.output);
      setError("");
    } catch (caughtError) {
      setOutput("");
      setError(caughtError instanceof Error ? caughtError.message : "Could not build cron expression.");
    }
  };

  return (
    <section className="grid gap-6 lg:grid-cols-2">
      <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">Schedule builder</h2>
        <p className="text-sm text-slate-700">
          Use selections below to generate a 5-field cron expression.
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="space-y-1 text-sm text-slate-700">
            Minute
            <select
              value={minuteMode}
              onChange={(event) => setMinuteMode(event.target.value as FieldMode)}
              className="w-full rounded-md border border-slate-300 px-2 py-1.5"
            >
              <option value="every">Every minute</option>
              <option value="value">Specific minute</option>
            </select>
            {minuteMode === "value" ? (
              <input
                type="number"
                min={0}
                max={59}
                value={minute}
                onChange={(event) => setMinute(Number(event.target.value))}
                className="w-full rounded-md border border-slate-300 px-2 py-1.5"
              />
            ) : null}
          </label>

          <label className="space-y-1 text-sm text-slate-700">
            Hour
            <select
              value={hourMode}
              onChange={(event) => setHourMode(event.target.value as FieldMode)}
              className="w-full rounded-md border border-slate-300 px-2 py-1.5"
            >
              <option value="every">Every hour</option>
              <option value="value">Specific hour</option>
            </select>
            {hourMode === "value" ? (
              <input
                type="number"
                min={0}
                max={23}
                value={hour}
                onChange={(event) => setHour(Number(event.target.value))}
                className="w-full rounded-md border border-slate-300 px-2 py-1.5"
              />
            ) : null}
          </label>

          <label className="space-y-1 text-sm text-slate-700">
            Day of month
            <select
              value={dayMode}
              onChange={(event) => setDayMode(event.target.value as FieldMode)}
              className="w-full rounded-md border border-slate-300 px-2 py-1.5"
            >
              <option value="every">Every day</option>
              <option value="value">Specific day</option>
            </select>
            {dayMode === "value" ? (
              <input
                type="number"
                min={1}
                max={31}
                value={dayOfMonth}
                onChange={(event) => setDayOfMonth(Number(event.target.value))}
                className="w-full rounded-md border border-slate-300 px-2 py-1.5"
              />
            ) : null}
          </label>

          <label className="space-y-1 text-sm text-slate-700">
            Month
            <select
              value={monthMode}
              onChange={(event) => setMonthMode(event.target.value as FieldMode)}
              className="w-full rounded-md border border-slate-300 px-2 py-1.5"
            >
              <option value="every">Every month</option>
              <option value="value">Specific month</option>
            </select>
            {monthMode === "value" ? (
              <input
                type="number"
                min={1}
                max={12}
                value={month}
                onChange={(event) => setMonth(Number(event.target.value))}
                className="w-full rounded-md border border-slate-300 px-2 py-1.5"
              />
            ) : null}
          </label>

          <label className="space-y-1 text-sm text-slate-700">
            Day of week
            <select
              value={weekdayMode}
              onChange={(event) => setWeekdayMode(event.target.value as FieldMode)}
              className="w-full rounded-md border border-slate-300 px-2 py-1.5"
            >
              <option value="every">Every day of week</option>
              <option value="value">Specific day (0-6)</option>
            </select>
            {weekdayMode === "value" ? (
              <input
                type="number"
                min={0}
                max={6}
                value={dayOfWeek}
                onChange={(event) => setDayOfWeek(Number(event.target.value))}
                className="w-full rounded-md border border-slate-300 px-2 py-1.5"
              />
            ) : null}
          </label>
        </div>

        <button
          type="button"
          onClick={onGenerate}
          className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
        >
          Generate Expression
        </button>
      </section>

      <ToolOutput value={output} error={error} downloadFileName="cron-expression.txt" downloadMimeType="text/plain" />
    </section>
  );
}
