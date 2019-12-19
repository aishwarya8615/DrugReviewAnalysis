// Appearance customization to improve readability.
// See https://vega.github.io/vega-lite/docs/
const dark = '#3e3c38';
export const config = {
  axis: {
    domain: false,
    tickcolor: 'lightgrey'
  },
  style: {
    "guide-label": {
      fontSize: 10,
      fill: dark
    },
    "guide-title": {
      fontSize: 19,
      fill: 'grey'
    }
  }
};