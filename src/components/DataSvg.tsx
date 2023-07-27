import React, { useEffect, useRef, useCallback } from "react";
import * as d3 from "d3";

interface DataSvgProps {
  data: [string, number][];
}

const DataSvg: React.FC<DataSvgProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  const handleMouseOver = useCallback((d: [string, number]) => {
    if (!svgRef.current) return;

    const tooltip = d3.select("#tooltip");
    const tooltipText = `${d[0]} GDP: ${d[1]}`;

    tooltip.select("text").html(tooltipText);
    tooltip.style("display", "block");
    tooltip.attr("data-date", d[0]); 
  }, []);

  const handleMouseOut = useCallback(() => {
    if (!svgRef.current) return;

    const tooltip = d3.select(svgRef.current).select("#tooltip");
    tooltip.style("display", "none");
  }, []);

  useEffect(() => {
    if (svgRef.current && data && data.length > 0) {
      const svg = d3.select(svgRef.current);

      const margin = { top: 40, right: 40, bottom: 80, left: 100 };
      const width = 800 - margin.left - margin.right;
      const height = 400 - margin.top - margin.bottom;

      const fromDate = new Date(data[0][0]);
      const toDate = new Date(data[data.length - 1][0]);

      const xScale = d3
        .scaleTime()
        .domain([fromDate, toDate])
        .range([0, width])
        .nice();

      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d[1]) || 0])
        .range([height, 0]);

      const xAxis = d3.axisBottom(xScale);
      const yAxis = d3.axisLeft(yScale);

      svg
        .append("g")
        .attr("id", "x-axis")
        .attr("transform", `translate(${margin.left}, ${height + margin.top})`)
        .call(xAxis)
        .selectAll("text")
        .attr("fill", "black")
        .style("text-anchor", "end")
        .attr("dx", "-0.8em")
        .attr("dy", "-0.15em")
        .attr("transform", "rotate(-45)");

      svg
        .append("g")
        .attr("id", "y-axis")
        .attr("transform", `translate(${margin.left}, ${margin.top})`)
        .call(yAxis)
        .selectAll("text")
        .attr("fill", "black");

      svg
        .selectAll<SVGRectElement, [string, number]>("rect.bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("data-date", (d) => d[0])
        .attr("data-gdp", (d) => d[1])
        .attr("x", (d) => xScale(new Date(d[0])) + margin.left)
        .attr("y", (d) => yScale(d[1]) + margin.top)
        .attr("width", (d) => xScale(new Date(d[0])) - xScale(fromDate))
        .attr("height", (d) => height - yScale(d[1]))
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
        .attr("x", 450)
        .attr("y", 370)
        .style("font-size", "12px")
        .style("text-anchor", "middle");
    }
  }, [data, handleMouseOver, handleMouseOut]);

  if (!data || data.length === 0) {
    return <div>Loading...</div>;
  }

  return <svg width="800" height="400" ref={svgRef}></svg>;
};

export default DataSvg;
