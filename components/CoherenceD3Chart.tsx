'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Activity, ShieldCheck, TrendingUp } from 'lucide-react';

interface DataPoint {
  time: Date;
  value: number;
}

// Deterministic seed data ensuring 100% identical SSR and Client initial hydration
const FIXED_EPOCH = 1772270000000;
function getDeterministicInitialData(): DataPoint[] {
  const initialData: DataPoint[] = [];
  for (let i = 59; i >= 0; i--) {
    const t = new Date(FIXED_EPOCH - i * 1000);
    const base = 99.992;
    const wave = Math.sin(i * 0.25) * 0.004 + Math.cos(i * 0.4) * 0.002;
    initialData.push({
      time: t,
      value: parseFloat(Math.min(99.999, Math.max(99.980, base + wave)).toFixed(4))
    });
  }
  return initialData;
}

export default function CoherenceD3Chart() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [containerWidth, setContainerWidth] = useState(600);
  const [data, setData] = useState<DataPoint[]>(getDeterministicInitialData);
  const [currentCoherence, setCurrentCoherence] = useState(99.992);
  const [hoveredPoint, setHoveredPoint] = useState<DataPoint | null>(null);

  // Resize observer to handle dynamic responsive layout
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0) {
          setContainerWidth(entry.contentRect.width);
        }
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // 1-second real-time ticker running purely on client after hydration
  useEffect(() => {
    const interval = setInterval(() => {
      const nextTime = new Date();
      const base = 99.992;
      const tSec = nextTime.getSeconds();
      const wave = Math.sin(tSec * 0.3) * 0.004 + ((tSec % 7) * 0.0006 - 0.002);
      const nextVal = parseFloat(Math.min(99.999, Math.max(99.980, base + wave)).toFixed(4));
      
      setCurrentCoherence(nextVal);
      setData((prev) => {
        const updated = [...prev.slice(1), { time: nextTime, value: nextVal }];
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // D3 Chart Render with smooth visualization
  useEffect(() => {
    if (!svgRef.current || !containerRef.current || data.length === 0) return;

    const width = containerWidth || containerRef.current.clientWidth || 600;
    const height = 220;
    const margin = { top: 20, right: 35, bottom: 30, left: 55 };
    const innerWidth = Math.max(100, width - margin.left - margin.right);
    const innerHeight = Math.max(50, height - margin.top - margin.bottom);

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    svg.attr('width', width).attr('height', height);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // Gradients & Filters
    const defs = svg.append('defs');

    // Glow filter
    const filter = defs.append('filter').attr('id', 'd3-glow').attr('x', '-20%').attr('y', '-20%').attr('width', '140%').attr('height', '140%');
    filter.append('feGaussianBlur').attr('stdDeviation', '3.5').attr('result', 'coloredBlur');
    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Area Gradient
    const areaGrad = defs.append('linearGradient').attr('id', 'coherence-area-grad').attr('x1', '0%').attr('y1', '0%').attr('x2', '0%').attr('y2', '100%');
    areaGrad.append('stop').attr('offset', '0%').attr('stop-color', '#34D399').attr('stop-opacity', 0.35);
    areaGrad.append('stop').attr('offset', '50%').attr('stop-color', '#67E8F9').attr('stop-opacity', 0.15);
    areaGrad.append('stop').attr('offset', '100%').attr('stop-color', '#060913').attr('stop-opacity', 0.0);

    // Line Gradient
    const lineGrad = defs.append('linearGradient').attr('id', 'coherence-line-grad').attr('x1', '0%').attr('y1', '0%').attr('x2', '100%').attr('y2', '0%');
    lineGrad.append('stop').attr('offset', '0%').attr('stop-color', '#67E8F9');
    lineGrad.append('stop').attr('offset', '60%').attr('stop-color', '#34D399');
    lineGrad.append('stop').attr('offset', '100%').attr('stop-color', '#A7F3D0');

    // Scales
    const xDomain = d3.extent(data, (d) => d.time) as [Date, Date];
    const xScale = d3.scaleTime().domain(xDomain).range([0, innerWidth]);

    const yMin = (d3.min(data, (d) => d.value) ?? 99.980) - 0.003;
    const yMax = (d3.max(data, (d) => d.value) ?? 99.999) + 0.002;
    const yScale = d3.scaleLinear().domain([yMin, yMax]).range([innerHeight, 0]);

    // Grid lines
    const yGrid = d3.axisLeft(yScale).ticks(5).tickSize(-innerWidth).tickFormat(() => '');
    g.append('g')
      .attr('class', 'y-grid')
      .call(yGrid)
      .selectAll('line')
      .attr('stroke', 'rgba(103, 232, 249, 0.08)')
      .attr('stroke-dasharray', '3,3');
    g.select('.y-grid .domain').remove();

    const xGrid = d3.axisBottom(xScale).ticks(6).tickSize(-innerHeight).tickFormat(() => '');
    g.append('g')
      .attr('class', 'x-grid')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xGrid)
      .selectAll('line')
      .attr('stroke', 'rgba(103, 232, 249, 0.08)')
      .attr('stroke-dasharray', '3,3');
    g.select('.x-grid .domain').remove();

    // Area Generator
    const areaGenerator = d3
      .area<DataPoint>()
      .x((d) => xScale(d.time))
      .y0(innerHeight)
      .y1((d) => yScale(d.value))
      .curve(d3.curveMonotoneX);

    g.append('path')
      .datum(data)
      .attr('fill', 'url(#coherence-area-grad)')
      .attr('d', areaGenerator);

    // Line Generator
    const lineGenerator = d3
      .line<DataPoint>()
      .x((d) => xScale(d.time))
      .y((d) => yScale(d.value))
      .curve(d3.curveMonotoneX);

    g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'url(#coherence-line-grad)')
      .attr('stroke-width', 2.2)
      .attr('filter', 'url(#d3-glow)')
      .attr('d', lineGenerator);

    // Axes
    const xAxis = d3.axisBottom(xScale).ticks(6).tickFormat((d) => d3.timeFormat('%H:%M:%S')(d as Date));
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis)
      .attr('color', '#64748b')
      .selectAll('text')
      .attr('font-family', 'JetBrains Mono, monospace')
      .attr('font-size', '9px')
      .attr('fill', '#94a3b8');

    const yAxis = d3.axisLeft(yScale).ticks(5).tickFormat((d) => `${(d as number).toFixed(3)}%`);
    g.append('g')
      .call(yAxis)
      .attr('color', '#64748b')
      .selectAll('text')
      .attr('font-family', 'JetBrains Mono, monospace')
      .attr('font-size', '9px')
      .attr('fill', '#94a3b8');

    // Current latest point pulsing marker
    const latest = data[data.length - 1];
    if (latest) {
      const lx = xScale(latest.time);
      const ly = yScale(latest.value);

      // Pulse ring
      g.append('circle')
        .attr('cx', lx)
        .attr('cy', ly)
        .attr('r', 7)
        .attr('fill', 'rgba(52, 211, 153, 0.35)')
        .attr('stroke', '#34D399')
        .attr('stroke-width', 1.5)
        .attr('class', 'animate-ping');

      // Core point
      g.append('circle')
        .attr('cx', lx)
        .attr('cy', ly)
        .attr('r', 4.5)
        .attr('fill', '#34D399')
        .attr('stroke', '#FFFFFF')
        .attr('stroke-width', 1.5)
        .attr('filter', 'url(#d3-glow)');
    }

    // Interactive Overlay for crosshair & tooltip
    const overlay = g
      .append('rect')
      .attr('width', innerWidth)
      .attr('height', innerHeight)
      .attr('fill', 'transparent')
      .attr('cursor', 'crosshair');

    const focusG = g.append('g').style('display', 'none');

    const focusLineX = focusG
      .append('line')
      .attr('y1', 0)
      .attr('y2', innerHeight)
      .attr('stroke', '#67E8F9')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '3,3');

    const focusLineY = focusG
      .append('line')
      .attr('x1', 0)
      .attr('x2', innerWidth)
      .attr('stroke', '#67E8F9')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '3,3');

    const focusDot = focusG
      .append('circle')
      .attr('r', 5)
      .attr('fill', '#67E8F9')
      .attr('stroke', '#FFFFFF')
      .attr('stroke-width', 2);

    const bisectDate = d3.bisector<DataPoint, Date>((d) => d.time).left;

    overlay
      .on('mouseover', () => focusG.style('display', null))
      .on('mouseout', () => {
        focusG.style('display', 'none');
        setHoveredPoint(null);
      })
      .on('mousemove', (event: MouseEvent) => {
        const [mx] = d3.pointer(event, overlay.node());
        const x0 = xScale.invert(mx);
        const idx = bisectDate(data, x0, 1);
        const d0 = data[idx - 1];
        const d1 = data[idx];
        let d = d0;
        if (d1) {
          d = x0.getTime() - d0.time.getTime() > d1.time.getTime() - x0.getTime() ? d1 : d0;
        }
        if (!d) return;

        const xPos = xScale(d.time);
        const yPos = yScale(d.value);

        focusLineX.attr('x1', xPos).attr('x2', xPos);
        focusLineY.attr('y1', yPos).attr('y2', yPos);
        focusDot.attr('cx', xPos).attr('cy', yPos);

        setHoveredPoint(d);
      });
  }, [data, containerWidth]);

  // Statistics calculation
  const values = data.map((d) => d.value);
  const minVal = values.length ? Math.min(...values) : 99.985;
  const maxVal = values.length ? Math.max(...values) : 99.998;
  const avgVal = values.length ? values.reduce((a, b) => a + b, 0) / values.length : 99.992;

  return (
    <div ref={containerRef} className="w-full bg-[#0f172a]/95 border border-emerald-500/40 rounded-2xl p-5 backdrop-blur-xl shadow-2xl space-y-3 emerald-glow">
      <div className="flex flex-wrap justify-between items-center gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-400/50 text-emerald-300">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-emerald-400 font-bold font-mono tracking-widest uppercase">REAL-TIME D3.JS TELEMETRY ENGINE</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono text-[9px] font-bold">
                60s SLIDING WINDOW
              </span>
            </div>
            <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
              Quantum Coherence Trend Visualizer
              <span className="text-emerald-400 font-bold text-lg">({currentCoherence.toFixed(3)}%)</span>
            </h3>
          </div>
        </div>

        {/* Real-time stats badges */}
        <div className="flex items-center gap-3 text-[11px] font-mono">
          <div className="px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800">
            <span className="text-slate-400 text-[9px] block">MIN (60s)</span>
            <span className="text-cyan-300 font-bold">{minVal.toFixed(3)}%</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800">
            <span className="text-slate-400 text-[9px] block">AVG (60s)</span>
            <span className="text-emerald-400 font-bold">{avgVal.toFixed(3)}%</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800">
            <span className="text-slate-400 text-[9px] block">MAX (60s)</span>
            <span className="text-amber-300 font-bold">{maxVal.toFixed(3)}%</span>
          </div>
        </div>
      </div>

      {/* D3 SVG Canvas */}
      <div className="relative w-full overflow-hidden bg-black/60 rounded-xl border border-slate-800/90 p-1">
        <svg ref={svgRef} className="w-full overflow-visible" />
        
        {/* Tooltip Overlay */}
        {hoveredPoint && (
          <div className="absolute top-3 right-4 bg-slate-950/95 border border-cyan-400/80 px-3 py-1.5 rounded-lg shadow-xl font-mono text-[10px] pointer-events-none space-y-0.5">
            <div className="text-slate-400">Time: <span className="text-white font-bold">{hoveredPoint.time.toLocaleTimeString()}</span></div>
            <div className="text-emerald-400 font-bold">Coherence: {hoveredPoint.value.toFixed(4)}%</div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap justify-between items-center text-[10px] font-mono text-slate-400 pt-1">
        <span className="flex items-center gap-1.5 text-emerald-300">
          <ShieldCheck className="w-3.5 h-3.5" />
          Quantum Decoherence Protection: Active (Sub-Kelvin Cryo Helium-4 Bus 14.98 mK)
        </span>
        <span className="text-slate-500">
          Sample Frequency: 1.00 Hz • Tolerance Threshold: &ge; 99.980%
        </span>
      </div>
    </div>
  );
}
