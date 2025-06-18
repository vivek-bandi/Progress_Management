import React from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";

export default function HeatMap({ data }) {
  // Show last 365 days
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 364);

  return (
    <div className="mt-8 flex justify-center">
      <div style={{ maxWidth: 1500, width: "100%" }}>
        <h3 className="font-semibold text-sky-600 mb-2">Submission Heatmap</h3>
        <CalendarHeatmap
          startDate={startDate}
          endDate={endDate}
          values={data}
          classForValue={(value) => {
            if (!value) return "color-empty";
            if (value.count >= 5) return "color-github-4";
            if (value.count >= 3) return "color-github-3";
            if (value.count >= 2) return "color-github-2";
            return "color-github-1";
          }}
          tooltipDataAttrs={(value) =>
            value.count
              ? { "data-tip": `${value.date}: ${value.count} solved` }
              : { "data-tip": "No submissions" }
          }
        />
      </div>
    </div>
  );
}
