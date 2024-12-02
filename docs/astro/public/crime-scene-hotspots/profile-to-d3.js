import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';
const margin = 10,
  outerDiameter = 960,
  innerDiameter = outerDiameter - margin - margin;

const x = d3.scaleLinear().range([0, innerDiameter]);
const y = d3.scaleLinear().range([0, innerDiameter]);
const color = d3
  .scaleLinear()
  .domain([-1, 5])
  .range(['hsl(185,60%,99%)', 'hsl(187,40%,70%)'])
  .interpolate(d3.interpolateHcl);

const pack = d3.pack().padding(2).size([innerDiameter, innerDiameter]);

const svg = d3
  .select('body')
  .append('svg')
  .attr('width', outerDiameter)
  .attr('height', outerDiameter)
  .append('g')
  .attr('transform', 'translate(' + margin + ',' + margin + ')');

const d3Json = await d3.json('hotspots.json');
const root = d3.hierarchy(d3Json).sum((d) => d.size);
const nodes = pack(root).descendants();
let focus = root;


svg
  .append('g')
  .selectAll('circle')
  .data(nodes)
  .enter()
  .append('circle')
  .attr('class', function (d) {
    if(!d.parent) {
      return 'node node--root'
    }
    if(d.children) {
      return 'node'
    }
    return 'node node--leaf'

  })
  .attr('transform', function (d) {
    return 'translate(' + d.x + ',' + d.y + ')';
  })
  .attr('r', function (d) {
    return d.r;
  })
  .style('fill', function (d) {
    if(d.weight > 0.0) {  
      return 'darkred'
    }
    if(d.children) {
      return color(d.depth)
    }
    return 'WhiteSmoke'
  })
  .style('fill-opacity', function (d) {
    return d.weight;
  })
  .on('click', function (event, d) {
    return zoom(event, focus === d ? root : d);
  });

svg
  .append('g')
  .selectAll('text')
  .data(nodes)
  .enter()
  .append('text')
  .attr('class', 'label')
  .attr('transform', function (d) {
    return `translate(${d.x}, ${d.y})`;
  })
  .style('fill-opacity', function (d) {
    return d.parent === root ? 1 : 0;
  })
  .style('display', function (d) {
    return d.parent === root ? null : 'none';
  })
  .text(function (d) {
    return d.data.name;
  });

d3.select(window).on('click', function (event) {
  zoom(event, root);
});

function zoom(event, d) {
  const focus0 = focus;
  focus = d;

  const k = innerDiameter / d.r / 2;
  x.domain([d.x - d.r, d.x + d.r]);
  y.domain([d.y - d.r, d.y + d.r]);
  event.stopPropagation();

  const transition = svg
    .selectAll('text,circle')
    .transition()
    .duration(event.altKey ? 7500 : 750)
    .attr('transform', function (d) {
      return `translate(${x(d.x)}, ${y(d.y)})`;
    });

  transition.filter('circle').attr('r', function (d) {
    return k * d.r;
  });

  transition
    .filter('text')
    .filter(function (d) {
      return d.parent === focus || d.parent === focus0;
    })
    .style('fill-opacity', function (d) {
      return d.parent === focus ? 1 : 0;
    })
    .on('start', function (d) {
      if (d.parent === focus) this.style.display = 'inline';
    })
    .on('end', function (d) {
      if (d.parent !== focus) this.style.display = 'none';
    });
}

d3.select(self.frameElement).style('height', outerDiameter + 'px');
