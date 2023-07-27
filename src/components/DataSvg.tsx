// DataSvg.tsx
import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

interface DataSvgProps {
  data: [string, number][];
}

const DataSvg: React.FC<DataSvgProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (svgRef.current && data && data.length > 0) {
      // Add null check and data length check
      const svg = d3.select(svgRef.current);

      // Chart dimensions and margins
      const margin = { top: 20, right: 20, bottom: 40, left: 60 };
      const width = 400 - margin.left - margin.right;
      const height = 200 - margin.top - margin.bottom;

      // Create x and y scales
      const xScale = d3
        .scaleBand()
        .domain(data.map((d) => d[0]))
        .range([0, width])
        .padding(0.1);

      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d[1]) || 0])
        .range([height, 0]);

      // Create x and y axes
      const xAxis = d3.axisBottom(xScale);
      const yAxis = d3.axisLeft(yScale);

      // Append axes to the SVG
      svg
        .append("g")
        .attr("id", "x-axis")
        .attr("transform", `translate(${margin.left}, ${height + margin.top})`)
        .call(xAxis);

      svg
        .append("g")
        .attr("id", "y-axis")
        .attr("transform", `translate(${margin.left}, ${margin.top})`)
        .call(yAxis);

      // Create and bind data to the bars
      svg
        .selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("data-date", (d) => d[0])
        .attr("data-gdp", (d) => d[1])
        .attr("x", (d) => xScale(d[0]) + margin.left)
        .attr("y", (d) => yScale(d[1]) + margin.top)
        .attr("width", xScale.bandwidth())
        .attr("height", (d) => height - yScale(d[1]))
        .attr("fill", "steelblue");

      // Tooltip
      const tooltip = svg
        .append("g")
        .attr("id", "tooltip")
        .style("display", "none");

      tooltip
        .append("rect")
        .attr("width", 100)
        .attr("height", 40)
        .attr("fill", "white")
        .style("opacity", 0.9);

      tooltip
        .append("text")
        .attr("x", 10)
        .attr("y", 20)
        .style("font-size", "12px");

      // Mouse event handlers to show/hide tooltip
      svg
        .selectAll(".bar")
        .on("mouseover", (event, d) => {
          const tooltipText = `${d[0]}<br>GDP: ${d[1]}`;
          tooltip.select("text").html(tooltipText);
          tooltip.style("display", "block");
        })
        .on("mouseout", () => {
          tooltip.style("display", "none");
        });
    }
  }, [data]);

  if (!data || data.length === 0) {
    // Handle the case when data is not available yet
    return <div>Loading...</div>;
  }

  return <svg width="400" height="200" ref={svgRef}></svg>;
};

export default DataSvg;
