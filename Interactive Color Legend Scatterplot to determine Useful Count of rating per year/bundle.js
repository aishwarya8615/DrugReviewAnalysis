(function (React$1, ReactDOM, d3) {
  'use strict';

  var React$1__default = 'default' in React$1 ? React$1['default'] : React$1;
  ReactDOM = ReactDOM && ReactDOM.hasOwnProperty('default') ? ReactDOM['default'] : ReactDOM;

  const csvUrl =
    'https://gist.githubusercontent.com/aishwarya8615/4462b7306efe7e44629cb841c892b456/raw/DrugsdataTest.csv';

  const useData = () => {
    const [data, setData] = React$1.useState(null);
   	//const formatYear = d3.timeFormat("%Y"),
           //formatYear(date);

    React$1.useEffect(() => {
      const row = d => {
        d.drugName  = +d.drugName ;
        d.rating  = +d.rating ;
        d.usefulCount = +d.usefulCount; 
        d. uniqueID = +d.uniqueID;
        //d.year = +d.year;

        //d.percentage_expenditure = +d.percentage_expenditure;
        //d.Year = +d.Year;
        return d;
      };
      d3.csv(csvUrl, row).then(setData);
    }, []);
    
    return data;
  };

  const AxisBottom = ({ xScale, innerHeight, tickFormat, tickOffset = 3 }) =>
    xScale.ticks().map(tickValue => (
      React.createElement( 'g', {
        className: "tick", key: tickValue, transform: `translate(${xScale(tickValue)},0)` },
        React.createElement( 'line', { y2: innerHeight }),
        React.createElement( 'text', { style: { textAnchor: 'middle' }, dy: ".71em", y: innerHeight + tickOffset },
          tickFormat(tickValue)
        )
      )
    ));

  const AxisLeft = ({ yScale, innerWidth, tickOffset = 3 }) =>
    yScale.ticks().map(tickValue => (
      React.createElement( 'g', { className: "tick", transform: `translate(0,${yScale(tickValue)})` },
        React.createElement( 'line', { x2: innerWidth }),
        React.createElement( 'text', {
          key: tickValue, style: { textAnchor: 'end' }, x: -tickOffset, dy: ".32em" },
          tickValue
        )
      )
    ));

  const Marks = ({
    data,
    xScale,
    xValue,
    yScale,
    yValue,
    colorScale,
    colorValue,
    tooltipFormat,
    circleRadius
  }) =>
    data.map(d => (
      React.createElement( 'circle', {
        className: "mark", cx: xScale(xValue(d)), cy: yScale(yValue(d)), fill: colorScale(colorValue(d)), r: circleRadius },
        React.createElement( 'title', null, tooltipFormat(xValue(d)) )
      )
    ));

  const ColorLegend = ({
    colorScale,
    tickSpacing = 20,
    tickSize = 10,
    tickTextOffset = 20,
    onHover,
    hoveredValue,
    fadeOpacity
  }) =>
    colorScale.domain().map((domainValue, i) => (
      React.createElement( 'g', {
        className: "tick", transform: `translate(0,${i * tickSpacing})`, onMouseEnter: () => {
          onHover(domainValue);
          //onHover(console.log(domainValue))
        }, onMouseOut: () => {
          onHover(null);
        }, opacity: hoveredValue && domainValue !== hoveredValue ? fadeOpacity : 1 },
        React.createElement( 'circle', { fill: colorScale(domainValue), r: tickSize }),
        React.createElement( 'text', { x: tickTextOffset, dy: ".32em" },
          domainValue
        )
      )
    ));

  const width = 960;
  const height = 500;
  const margin = { top: 20, right: 200, bottom: 65, left: 90 };
  const xAxisLabelOffset = 50;
  const yAxisLabelOffset = 45;
  const fadeOpacity = 0.2;

  const App = () => {
    const data = useData();
    const [hoveredValue, setHoveredValue] = React$1.useState(null);

    if (!data) {
      return React$1__default.createElement( 'pre', null, "Loading..." );
    }

    const innerHeight = height - margin.top - margin.bottom;
    const innerWidth = width - margin.left - margin.right;

    const xValue = d => d.rating;
    const xAxisLabel = 'Ratings';

    const yValue = d => d.usefulCount;
    const yAxisLabel = 'Useful Count';

    const colorValue = d => d.year;
    const colorLegendLabel = 'Year';

    const filteredData = data.filter(d => hoveredValue === colorValue(d));

    const circleRadius = 7;

    const siFormat = d3.format('.2s');
    const xAxisTickFormat = tickValue => siFormat(tickValue).replace('G', 'B');

    const xScale = d3.scaleLinear()
      .domain(d3.extent(data, xValue))
      .range([0, innerWidth])
      .nice();

    const yScale = d3.scaleLinear()
      .domain(d3.extent(data, yValue))
      .range([innerHeight,0]);

    const colorScale =d3.scaleOrdinal()
      .domain(data.map(colorValue))
      .range(['#E6842A', '#137B80', '#8E6C8A', '#69b3a2','#007AFF','#FFF500','#7fa67a','#7ab5e3','red','indigo']);
  	  
    return (
      React$1__default.createElement( 'svg', { width: width, height: height },
        React$1__default.createElement( 'g', { transform: `translate(${margin.left},${margin.top})` },
          React$1__default.createElement( AxisBottom, {
            xScale: xScale, innerHeight: innerHeight, tickFormat: xAxisTickFormat, tickOffset: 5 }),
          React$1__default.createElement( 'text', {
            className: "axis-label", textAnchor: "middle", transform: `translate(${-yAxisLabelOffset},${innerHeight /
            2}) rotate(-90)` },
            yAxisLabel
          ),
          React$1__default.createElement( AxisLeft, { yScale: yScale, innerWidth: innerWidth, tickOffset: 5 }),
          React$1__default.createElement( 'text', {
            className: "axis-label", x: innerWidth / 2, y: innerHeight + xAxisLabelOffset, textAnchor: "middle" },
            xAxisLabel
          ),
          React$1__default.createElement( 'g', { transform: `translate(${innerWidth + 60}, 60)` },
            React$1__default.createElement( 'text', { x: 35, y: -25, className: "axis-label", textAnchor: "middle" },
              colorLegendLabel
            ),
            React$1__default.createElement( ColorLegend, {
              tickSpacing: 22, tickSize: 10, tickTextOffset: 12, tickSize: circleRadius, colorScale: colorScale, onHover: setHoveredValue, hoveredValue: hoveredValue, fadeOpacity: fadeOpacity })
          ),
          React$1__default.createElement( 'g', { opacity: hoveredValue ? fadeOpacity : 1 },
            React$1__default.createElement( Marks, {
              data: data, xScale: xScale, xValue: xValue, yScale: yScale, yValue: yValue, colorScale: colorScale, colorValue: colorValue, tooltipFormat: xAxisTickFormat, circleRadius: circleRadius })
          ),
          React$1__default.createElement( Marks, {
            data: filteredData, xScale: xScale, xValue: xValue, yScale: yScale, yValue: yValue, colorScale: colorScale, colorValue: colorValue, tooltipFormat: xAxisTickFormat, circleRadius: circleRadius })
        )
      )
    );
  };
  const rootElement = document.getElementById('root');
  ReactDOM.render(React$1__default.createElement( App, null ), rootElement);

}(React, ReactDOM, d3));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbInVzZURhdGEuanMiLCJBeGlzQm90dG9tLmpzIiwiQXhpc0xlZnQuanMiLCJNYXJrcy5qcyIsIkNvbG9yTGVnZW5kLmpzIiwiaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IHVzZVN0YXRlLCB1c2VFZmZlY3QgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBjc3YgfSBmcm9tICdkMyc7XG5cbmNvbnN0IGNzdlVybCA9XG4gICdodHRwczovL2dpc3QuZ2l0aHVidXNlcmNvbnRlbnQuY29tL2Fpc2h3YXJ5YTg2MTUvNDQ2MmI3MzA2ZWZlN2U0NDYyOWNiODQxYzg5MmI0NTYvcmF3L0RydWdzZGF0YVRlc3QuY3N2JztcblxuZXhwb3J0IGNvbnN0IHVzZURhdGEgPSAoKSA9PiB7XG4gIGNvbnN0IFtkYXRhLCBzZXREYXRhXSA9IHVzZVN0YXRlKG51bGwpO1xuIFx0Ly9jb25zdCBmb3JtYXRZZWFyID0gZDMudGltZUZvcm1hdChcIiVZXCIpLFxuICAgICAgICAgLy9mb3JtYXRZZWFyKGRhdGUpO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3Qgcm93ID0gZCA9PiB7XG4gICAgICBkLmRydWdOYW1lICA9ICtkLmRydWdOYW1lIDtcbiAgICAgIGQucmF0aW5nICA9ICtkLnJhdGluZyA7XG4gICAgICBkLnVzZWZ1bENvdW50ID0gK2QudXNlZnVsQ291bnQ7IFxuICAgICAgZC4gdW5pcXVlSUQgPSArZC51bmlxdWVJRDtcbiAgICAgIC8vZC55ZWFyID0gK2QueWVhcjtcblxuICAgICAgLy9kLnBlcmNlbnRhZ2VfZXhwZW5kaXR1cmUgPSArZC5wZXJjZW50YWdlX2V4cGVuZGl0dXJlO1xuICAgICAgLy9kLlllYXIgPSArZC5ZZWFyO1xuICAgICAgcmV0dXJuIGQ7XG4gICAgfTtcbiAgICBjc3YoY3N2VXJsLCByb3cpLnRoZW4oc2V0RGF0YSk7XG4gIH0sIFtdKTtcbiAgXG4gIHJldHVybiBkYXRhO1xufTsiLCJleHBvcnQgY29uc3QgQXhpc0JvdHRvbSA9ICh7IHhTY2FsZSwgaW5uZXJIZWlnaHQsIHRpY2tGb3JtYXQsIHRpY2tPZmZzZXQgPSAzIH0pID0+XG4gIHhTY2FsZS50aWNrcygpLm1hcCh0aWNrVmFsdWUgPT4gKFxuICAgIDxnXG4gICAgICBjbGFzc05hbWU9XCJ0aWNrXCJcbiAgICAgIGtleT17dGlja1ZhbHVlfVxuICAgICAgdHJhbnNmb3JtPXtgdHJhbnNsYXRlKCR7eFNjYWxlKHRpY2tWYWx1ZSl9LDApYH1cbiAgICA+XG4gICAgICA8bGluZSB5Mj17aW5uZXJIZWlnaHR9IC8+XG4gICAgICA8dGV4dCBzdHlsZT17eyB0ZXh0QW5jaG9yOiAnbWlkZGxlJyB9fSBkeT1cIi43MWVtXCIgeT17aW5uZXJIZWlnaHQgKyB0aWNrT2Zmc2V0fT5cbiAgICAgICAge3RpY2tGb3JtYXQodGlja1ZhbHVlKX1cbiAgICAgIDwvdGV4dD5cbiAgICA8L2c+XG4gICkpO1xuIiwiZXhwb3J0IGNvbnN0IEF4aXNMZWZ0ID0gKHsgeVNjYWxlLCBpbm5lcldpZHRoLCB0aWNrT2Zmc2V0ID0gMyB9KSA9PlxuICB5U2NhbGUudGlja3MoKS5tYXAodGlja1ZhbHVlID0+IChcbiAgICA8ZyBjbGFzc05hbWU9XCJ0aWNrXCIgdHJhbnNmb3JtPXtgdHJhbnNsYXRlKDAsJHt5U2NhbGUodGlja1ZhbHVlKX0pYH0+XG4gICAgICA8bGluZSB4Mj17aW5uZXJXaWR0aH0gLz5cbiAgICAgIDx0ZXh0XG4gICAgICAgIGtleT17dGlja1ZhbHVlfVxuICAgICAgICBzdHlsZT17eyB0ZXh0QW5jaG9yOiAnZW5kJyB9fVxuICAgICAgICB4PXstdGlja09mZnNldH1cbiAgICAgICAgZHk9XCIuMzJlbVwiXG4gICAgICA+XG4gICAgICAgIHt0aWNrVmFsdWV9XG4gICAgICA8L3RleHQ+XG4gICAgPC9nPlxuICApKTtcbiIsImV4cG9ydCBjb25zdCBNYXJrcyA9ICh7XG4gIGRhdGEsXG4gIHhTY2FsZSxcbiAgeFZhbHVlLFxuICB5U2NhbGUsXG4gIHlWYWx1ZSxcbiAgY29sb3JTY2FsZSxcbiAgY29sb3JWYWx1ZSxcbiAgdG9vbHRpcEZvcm1hdCxcbiAgY2lyY2xlUmFkaXVzXG59KSA9PlxuICBkYXRhLm1hcChkID0+IChcbiAgICA8Y2lyY2xlXG4gICAgICBjbGFzc05hbWU9XCJtYXJrXCJcbiAgICAgIGN4PXt4U2NhbGUoeFZhbHVlKGQpKX1cbiAgICAgIGN5PXt5U2NhbGUoeVZhbHVlKGQpKX1cbiAgICAgIGZpbGw9e2NvbG9yU2NhbGUoY29sb3JWYWx1ZShkKSl9XG4gICAgICByPXtjaXJjbGVSYWRpdXN9XG4gICAgPlxuICAgICAgPHRpdGxlPnt0b29sdGlwRm9ybWF0KHhWYWx1ZShkKSl9PC90aXRsZT5cbiAgICA8L2NpcmNsZT5cbiAgKSk7XG4iLCJleHBvcnQgY29uc3QgQ29sb3JMZWdlbmQgPSAoe1xuICBjb2xvclNjYWxlLFxuICB0aWNrU3BhY2luZyA9IDIwLFxuICB0aWNrU2l6ZSA9IDEwLFxuICB0aWNrVGV4dE9mZnNldCA9IDIwLFxuICBvbkhvdmVyLFxuICBob3ZlcmVkVmFsdWUsXG4gIGZhZGVPcGFjaXR5XG59KSA9PlxuICBjb2xvclNjYWxlLmRvbWFpbigpLm1hcCgoZG9tYWluVmFsdWUsIGkpID0+IChcbiAgICA8Z1xuICAgICAgY2xhc3NOYW1lPVwidGlja1wiXG4gICAgICB0cmFuc2Zvcm09e2B0cmFuc2xhdGUoMCwke2kgKiB0aWNrU3BhY2luZ30pYH1cbiAgICAgIG9uTW91c2VFbnRlcj17KCkgPT4ge1xuICAgICAgICBvbkhvdmVyKGRvbWFpblZhbHVlKTtcbiAgICAgICAgLy9vbkhvdmVyKGNvbnNvbGUubG9nKGRvbWFpblZhbHVlKSlcbiAgICAgIH19XG4gICAgICBvbk1vdXNlT3V0PXsoKSA9PiB7XG4gICAgICAgIG9uSG92ZXIobnVsbCk7XG4gICAgICB9fVxuICAgICAgb3BhY2l0eT17aG92ZXJlZFZhbHVlICYmIGRvbWFpblZhbHVlICE9PSBob3ZlcmVkVmFsdWUgPyBmYWRlT3BhY2l0eSA6IDF9XG4gICAgPlxuICAgICAgPGNpcmNsZSBmaWxsPXtjb2xvclNjYWxlKGRvbWFpblZhbHVlKX0gcj17dGlja1NpemV9IC8+XG4gICAgICA8dGV4dCB4PXt0aWNrVGV4dE9mZnNldH0gZHk9XCIuMzJlbVwiPlxuICAgICAgICB7ZG9tYWluVmFsdWV9XG4gICAgICA8L3RleHQ+XG4gICAgPC9nPlxuICApKTtcbiIsImltcG9ydCBSZWFjdCwgeyB1c2VTdGF0ZSwgdXNlQ2FsbGJhY2ssIHVzZUVmZmVjdCB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBSZWFjdERPTSBmcm9tICdyZWFjdC1kb20nO1xuaW1wb3J0IHsgY3N2LCBzY2FsZUxpbmVhciwgc2NhbGVPcmRpbmFsLCBtYXgsIGZvcm1hdCwgZXh0ZW50IH0gZnJvbSAnZDMnO1xuaW1wb3J0IHsgdXNlRGF0YSB9IGZyb20gJy4vdXNlRGF0YSc7XG5pbXBvcnQgeyBBeGlzQm90dG9tIH0gZnJvbSAnLi9BeGlzQm90dG9tJztcbmltcG9ydCB7IEF4aXNMZWZ0IH0gZnJvbSAnLi9BeGlzTGVmdCc7XG5pbXBvcnQgeyBNYXJrcyB9IGZyb20gJy4vTWFya3MnO1xuaW1wb3J0IHsgQ29sb3JMZWdlbmQgfSBmcm9tICcuL0NvbG9yTGVnZW5kJztcblxuY29uc3Qgd2lkdGggPSA5NjA7XG5jb25zdCBoZWlnaHQgPSA1MDA7XG5jb25zdCBtYXJnaW4gPSB7IHRvcDogMjAsIHJpZ2h0OiAyMDAsIGJvdHRvbTogNjUsIGxlZnQ6IDkwIH07XG5jb25zdCB4QXhpc0xhYmVsT2Zmc2V0ID0gNTA7XG5jb25zdCB5QXhpc0xhYmVsT2Zmc2V0ID0gNDU7XG5jb25zdCBmYWRlT3BhY2l0eSA9IDAuMjtcblxuY29uc3QgQXBwID0gKCkgPT4ge1xuICBjb25zdCBkYXRhID0gdXNlRGF0YSgpO1xuICBjb25zdCBbaG92ZXJlZFZhbHVlLCBzZXRIb3ZlcmVkVmFsdWVdID0gdXNlU3RhdGUobnVsbCk7XG5cbiAgaWYgKCFkYXRhKSB7XG4gICAgcmV0dXJuIDxwcmU+TG9hZGluZy4uLjwvcHJlPjtcbiAgfVxuXG4gIGNvbnN0IGlubmVySGVpZ2h0ID0gaGVpZ2h0IC0gbWFyZ2luLnRvcCAtIG1hcmdpbi5ib3R0b207XG4gIGNvbnN0IGlubmVyV2lkdGggPSB3aWR0aCAtIG1hcmdpbi5sZWZ0IC0gbWFyZ2luLnJpZ2h0O1xuXG4gIGNvbnN0IHhWYWx1ZSA9IGQgPT4gZC5yYXRpbmc7XG4gIGNvbnN0IHhBeGlzTGFiZWwgPSAnUmF0aW5ncyc7XG5cbiAgY29uc3QgeVZhbHVlID0gZCA9PiBkLnVzZWZ1bENvdW50O1xuICBjb25zdCB5QXhpc0xhYmVsID0gJ1VzZWZ1bCBDb3VudCc7XG5cbiAgY29uc3QgY29sb3JWYWx1ZSA9IGQgPT4gZC55ZWFyO1xuICBjb25zdCBjb2xvckxlZ2VuZExhYmVsID0gJ1llYXInO1xuXG4gIGNvbnN0IGZpbHRlcmVkRGF0YSA9IGRhdGEuZmlsdGVyKGQgPT4gaG92ZXJlZFZhbHVlID09PSBjb2xvclZhbHVlKGQpKTtcblxuICBjb25zdCBjaXJjbGVSYWRpdXMgPSA3O1xuXG4gIGNvbnN0IHNpRm9ybWF0ID0gZm9ybWF0KCcuMnMnKTtcbiAgY29uc3QgeEF4aXNUaWNrRm9ybWF0ID0gdGlja1ZhbHVlID0+IHNpRm9ybWF0KHRpY2tWYWx1ZSkucmVwbGFjZSgnRycsICdCJyk7XG5cbiAgY29uc3QgeFNjYWxlID0gc2NhbGVMaW5lYXIoKVxuICAgIC5kb21haW4oZXh0ZW50KGRhdGEsIHhWYWx1ZSkpXG4gICAgLnJhbmdlKFswLCBpbm5lcldpZHRoXSlcbiAgICAubmljZSgpO1xuXG4gIGNvbnN0IHlTY2FsZSA9IHNjYWxlTGluZWFyKClcbiAgICAuZG9tYWluKGV4dGVudChkYXRhLCB5VmFsdWUpKVxuICAgIC5yYW5nZShbaW5uZXJIZWlnaHQsMF0pO1xuXG4gIGNvbnN0IGNvbG9yU2NhbGUgPXNjYWxlT3JkaW5hbCgpXG4gICAgLmRvbWFpbihkYXRhLm1hcChjb2xvclZhbHVlKSlcbiAgICAucmFuZ2UoWycjRTY4NDJBJywgJyMxMzdCODAnLCAnIzhFNkM4QScsICcjNjliM2EyJywnIzAwN0FGRicsJyNGRkY1MDAnLCcjN2ZhNjdhJywnIzdhYjVlMycsJ3JlZCcsJ2luZGlnbyddKTtcblx0ICBcbiAgcmV0dXJuIChcbiAgICA8c3ZnIHdpZHRoPXt3aWR0aH0gaGVpZ2h0PXtoZWlnaHR9PlxuICAgICAgPGcgdHJhbnNmb3JtPXtgdHJhbnNsYXRlKCR7bWFyZ2luLmxlZnR9LCR7bWFyZ2luLnRvcH0pYH0+XG4gICAgICAgIDxBeGlzQm90dG9tXG4gICAgICAgICAgeFNjYWxlPXt4U2NhbGV9XG4gICAgICAgICAgaW5uZXJIZWlnaHQ9e2lubmVySGVpZ2h0fVxuICAgICAgICAgIHRpY2tGb3JtYXQ9e3hBeGlzVGlja0Zvcm1hdH1cbiAgICAgICAgICB0aWNrT2Zmc2V0PXs1fVxuICAgICAgICAvPlxuICAgICAgICA8dGV4dFxuICAgICAgICAgIGNsYXNzTmFtZT1cImF4aXMtbGFiZWxcIlxuICAgICAgICAgIHRleHRBbmNob3I9XCJtaWRkbGVcIlxuICAgICAgICAgIHRyYW5zZm9ybT17YHRyYW5zbGF0ZSgkey15QXhpc0xhYmVsT2Zmc2V0fSwke2lubmVySGVpZ2h0IC9cbiAgICAgICAgICAgIDJ9KSByb3RhdGUoLTkwKWB9XG4gICAgICAgID5cbiAgICAgICAgICB7eUF4aXNMYWJlbH1cbiAgICAgICAgPC90ZXh0PlxuICAgICAgICA8QXhpc0xlZnQgeVNjYWxlPXt5U2NhbGV9IGlubmVyV2lkdGg9e2lubmVyV2lkdGh9IHRpY2tPZmZzZXQ9ezV9IC8+XG4gICAgICAgIDx0ZXh0XG4gICAgICAgICAgY2xhc3NOYW1lPVwiYXhpcy1sYWJlbFwiXG4gICAgICAgICAgeD17aW5uZXJXaWR0aCAvIDJ9XG4gICAgICAgICAgeT17aW5uZXJIZWlnaHQgKyB4QXhpc0xhYmVsT2Zmc2V0fVxuICAgICAgICAgIHRleHRBbmNob3I9XCJtaWRkbGVcIlxuICAgICAgICA+XG4gICAgICAgICAge3hBeGlzTGFiZWx9XG4gICAgICAgIDwvdGV4dD5cbiAgICAgICAgPGcgdHJhbnNmb3JtPXtgdHJhbnNsYXRlKCR7aW5uZXJXaWR0aCArIDYwfSwgNjApYH0+XG4gICAgICAgICAgPHRleHQgeD17MzV9IHk9ey0yNX0gY2xhc3NOYW1lPVwiYXhpcy1sYWJlbFwiIHRleHRBbmNob3I9XCJtaWRkbGVcIj5cbiAgICAgICAgICAgIHtjb2xvckxlZ2VuZExhYmVsfVxuICAgICAgICAgIDwvdGV4dD5cbiAgICAgICAgICA8Q29sb3JMZWdlbmRcbiAgICAgICAgICAgIHRpY2tTcGFjaW5nPXsyMn1cbiAgICAgICAgICAgIHRpY2tTaXplPXsxMH1cbiAgICAgICAgICAgIHRpY2tUZXh0T2Zmc2V0PXsxMn1cbiAgICAgICAgICAgIHRpY2tTaXplPXtjaXJjbGVSYWRpdXN9XG4gICAgICAgICAgICBjb2xvclNjYWxlPXtjb2xvclNjYWxlfVxuICAgICAgICAgICAgb25Ib3Zlcj17c2V0SG92ZXJlZFZhbHVlfVxuICAgICAgICAgICAgaG92ZXJlZFZhbHVlPXtob3ZlcmVkVmFsdWV9XG4gICAgICAgICAgICBmYWRlT3BhY2l0eT17ZmFkZU9wYWNpdHl9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9nPlxuICAgICAgICA8ZyBvcGFjaXR5PXtob3ZlcmVkVmFsdWUgPyBmYWRlT3BhY2l0eSA6IDF9PlxuICAgICAgICAgIDxNYXJrc1xuICAgICAgICAgICAgZGF0YT17ZGF0YX1cbiAgICAgICAgICAgIHhTY2FsZT17eFNjYWxlfVxuICAgICAgICAgICAgeFZhbHVlPXt4VmFsdWV9XG4gICAgICAgICAgICB5U2NhbGU9e3lTY2FsZX1cbiAgICAgICAgICAgIHlWYWx1ZT17eVZhbHVlfVxuICAgICAgICAgICAgY29sb3JTY2FsZT17Y29sb3JTY2FsZX1cbiAgICAgICAgICAgIGNvbG9yVmFsdWU9e2NvbG9yVmFsdWV9XG4gICAgICAgICAgICB0b29sdGlwRm9ybWF0PXt4QXhpc1RpY2tGb3JtYXR9XG4gICAgICAgICAgICBjaXJjbGVSYWRpdXM9e2NpcmNsZVJhZGl1c31cbiAgICAgICAgICAvPlxuICAgICAgICA8L2c+XG4gICAgICAgIDxNYXJrc1xuICAgICAgICAgIGRhdGE9e2ZpbHRlcmVkRGF0YX1cbiAgICAgICAgICB4U2NhbGU9e3hTY2FsZX1cbiAgICAgICAgICB4VmFsdWU9e3hWYWx1ZX1cbiAgICAgICAgICB5U2NhbGU9e3lTY2FsZX1cbiAgICAgICAgICB5VmFsdWU9e3lWYWx1ZX1cbiAgICAgICAgICBjb2xvclNjYWxlPXtjb2xvclNjYWxlfVxuICAgICAgICAgIGNvbG9yVmFsdWU9e2NvbG9yVmFsdWV9XG4gICAgICAgICAgdG9vbHRpcEZvcm1hdD17eEF4aXNUaWNrRm9ybWF0fVxuICAgICAgICAgIGNpcmNsZVJhZGl1cz17Y2lyY2xlUmFkaXVzfVxuICAgICAgICAvPlxuICAgICAgPC9nPlxuICAgIDwvc3ZnPlxuICApO1xufTtcbmNvbnN0IHJvb3RFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jvb3QnKTtcblJlYWN0RE9NLnJlbmRlcig8QXBwIC8+LCByb290RWxlbWVudCk7XG4iXSwibmFtZXMiOlsidXNlU3RhdGUiLCJ1c2VFZmZlY3QiLCJjc3YiLCJSZWFjdCIsImZvcm1hdCIsInNjYWxlTGluZWFyIiwiZXh0ZW50Iiwic2NhbGVPcmRpbmFsIl0sIm1hcHBpbmdzIjoiOzs7Ozs7RUFHQSxNQUFNLE1BQU07SUFDVix5R0FBeUcsQ0FBQzs7QUFFNUcsRUFBTyxNQUFNLE9BQU8sR0FBRyxNQUFNO0lBQzNCLE1BQU0sQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLEdBQUdBLGdCQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7Ozs7SUFJdkNDLGlCQUFTLENBQUMsTUFBTTtNQUNkLE1BQU0sR0FBRyxHQUFHLENBQUMsSUFBSTtRQUNmLENBQUMsQ0FBQyxRQUFRLElBQUksQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFO1FBQzNCLENBQUMsQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFO1FBQ3ZCLENBQUMsQ0FBQyxXQUFXLEdBQUcsQ0FBQyxD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