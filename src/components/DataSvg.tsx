import React, { useEffect, useRef, useCallback } from "react";
import * as d3 from "d3";

interface DataSvgProps {
  data: [string, number][];
}

const DataSvg: React.FC<DataSvgProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  const handleMouseOver = useCallback(
    (
      event: React.MouseEvent<SVGRectElement, MouseEvent>,
      d: [string, number]
    ) => {
      if (!svgRef.current) return;

      const tooltip = d3.select(svgRef.current).select("#tooltip");
      const tooltipText = `${d[0]}<br>GDP: ${d[1]}`;

      tooltip.select("text").html(tooltipText);
      tooltip.style("display", "block");
    },
    []
  );

  const handleMouseOut = useCallback(() => {
    if (!svgRef.current) return;

    const tooltip = d3.select(svgRef.current).select("#tooltip");
    tooltip.style("display", "none");
  }, []);

  useEffect(() => {
    if (svgRef.current && data && data.length > 0) {
      const svg = d3.select(svgRef.current);

      const margin = { top: 20, right: 20, bottom: 40, left: 60 };
      const width = 400 - margin.left - margin.right;
      const height = 200 - margin.top - margin.bottom;

      const xScale = d3
        .scaleBand<string>()
        .domain(data.map((d) => d[0]))
        .range([0, width])
        .padding(0.1);

      const yScale = d3
        .scaleLinear<number>()
        .domain([0, d3.max(data, (d) => d[1]) || 0])
        .range([height, 0]);

      const xAxis = d3.axisBottom(xScale);
      const yAxis = d3.axisLeft(yScale);

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

      svg
        .selectAll<SVGRectElement, [string, number]>("rect.bar") // Explicitly specify the element type and data type
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("data-date", (d) => d[0])
        .attr("data-gdp", (d) => d[1])
        .attr("x", (d) => xScale(d?.[0]) ?? 0 + margin.left) // Add optional chaining and nullish coalescing
        .attr("y", (d) => yScale(d?.[1]) ?? 0 + margin.top) // Add optional chaining and nullish coalescing
        .attr("width", xScale.bandwidth())
        .attr("height", (d) => height - yScale(d?.[1]) ?? 0) // Add optional chaining and nullish coalescing
        .attr("fill", "steelblue")
        .on("mouseover", handleMouseOver)
        .on("mouseout", handleMouseOut);

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
    }
  }, [data, handleMouseOver, handleMouseOut]);

  if (!data || data.length === 0) {
    return <div>Loading...</div>;
  }

  return <svg width="400" height="200" ref={svgRef}></svg>;
};

export default DataSvg;
