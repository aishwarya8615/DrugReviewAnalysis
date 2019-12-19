import vl from 'vega-lite-api';
export const viz = vl
  .markCircle({ size: 30, opacity: 0.5 })
  .encode(
    vl.x().fieldO('drugName').scale({ zero: false }),
    vl.y().fieldQ('usefulCount').scale({ zero: false }),
    vl.color().field('rating'),
  	//vl.size().fieldQ('rating'),
    vl.tooltip().fieldO('condition')
  );