import vl from 'vega-lite-api';
export const viz = vl
  .markBar()
  .encode(
    vl.y().fieldQ('rating').title('Ratings'),
    vl.x().fieldN('drugName').sort('-y'),
    vl.tooltip(vl.fieldO('condition'), vl.fieldN('condition'))
  );