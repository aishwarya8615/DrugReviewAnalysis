(function (vega, vegaLite, vl, vegaTooltip, d3) {
  'use strict';

  vega = vega && vega.hasOwnProperty('default') ? vega['default'] : vega;
  vegaLite = vegaLite && vegaLite.hasOwnProperty('default') ? vegaLite['default'] : vegaLite;
  vl = vl && vl.hasOwnProperty('default') ? vl['default'] : vl;

  // Appearance customization to improve readability.
  // See https://vega.github.io/vega-lite/docs/
  const dark = '#3e3c38';
  const config = {
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

  const csvUrl = 'https://gist.githubusercontent.com/aishwarya8615/4462b7306efe7e44629cb841c892b456/raw/DrugsdataTest.csv'; 
  const getData = async () => {
    let data = await d3.csv(csvUrl);
    
    data.sort((a, b) => d3.descending(+a.value, +b.value));
    
    data = data.slice(0, 80);
    
    // Have a look at the attributes available in the console!
    console.log(data[0]);

    return data;
  };

  const viz = vl
    .markBar()
    .encode(
      vl.y().fieldQ('rating').title('Ratings'),
      vl.x().fieldN('drugName').sort('-y'),
      vl.tooltip(vl.fieldO('condition'), vl.fieldN('condition'))
    );

  vl.register(vega, vegaLite, {
    view: { renderer: 'svg' },
    init: view => { view.tooltip(new vegaTooltip.Handler().call); }
  });

  const run = async () => {
    const marks = viz
      .data(await getData())
      .width(window.innerWidth)
      .height(window.innerHeight)
      .autosize({ type: 'fit', contains: 'padding' })
      .config(config);
    
    document.body.appendChild(await marks.render());
  };
  run();

}(vega, vegaLite, vl, vegaTooltip, d3));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbImNvbmZpZy5qcyIsImdldERhdGEuanMiLCJ2aXouanMiLCJpbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBBcHBlYXJhbmNlIGN1c3RvbWl6YXRpb24gdG8gaW1wcm92ZSByZWFkYWJpbGl0eS5cbi8vIFNlZSBodHRwczovL3ZlZ2EuZ2l0aHViLmlvL3ZlZ2EtbGl0ZS9kb2NzL1xuY29uc3QgZGFyayA9ICcjM2UzYzM4JztcbmV4cG9ydCBjb25zdCBjb25maWcgPSB7XG4gIGF4aXM6IHtcbiAgICBkb21haW46IGZhbHNlLFxuICAgIHRpY2tjb2xvcjogJ2xpZ2h0Z3JleSdcbiAgfSxcbiAgc3R5bGU6IHtcbiAgICBcImd1aWRlLWxhYmVsXCI6IHtcbiAgICAgIGZvbnRTaXplOiAxMCxcbiAgICAgIGZpbGw6IGRhcmtcbiAgICB9LFxuICAgIFwiZ3VpZGUtdGl0bGVcIjoge1xuICAgICAgZm9udFNpemU6IDE5LFxuICAgICAgZmlsbDogJ2dyZXknXG4gICAgfVxuICB9XG59OyIsImltcG9ydCB7IGNzdiwgZGVzY2VuZGluZyB9IGZyb20gJ2QzJztcblxuY29uc3QgY3N2VXJsID0gJ2h0dHBzOi8vZ2lzdC5naXRodWJ1c2VyY29udGVudC5jb20vYWlzaHdhcnlhODYxNS80NDYyYjczMDZlZmU3ZTQ0NjI5Y2I4NDFjODkyYjQ1Ni9yYXcvRHJ1Z3NkYXRhVGVzdC5jc3YnOyBcbmV4cG9ydCBjb25zdCBnZXREYXRhID0gYXN5bmMgKCkgPT4ge1xuICBsZXQgZGF0YSA9IGF3YWl0IGNzdihjc3ZVcmwpO1xuICBcbiAgZGF0YS5zb3J0KChhLCBiKSA9PiBkZXNjZW5kaW5nKCthLnZhbHVlLCArYi52YWx1ZSkpO1xuICBcbiAgZGF0YSA9IGRhdGEuc2xpY2UoMCwgODApO1xuICBcbiAgLy8gSGF2ZSBhIGxvb2sgYXQgdGhlIGF0dHJpYnV0ZXMgYXZhaWxhYmxlIGluIHRoZSBjb25zb2xlIVxuICBjb25zb2xlLmxvZyhkYXRhWzBdKTtcblxuICByZXR1cm4gZGF0YTtcbn07IiwiaW1wb3J0IHZsIGZyb20gJ3ZlZ2EtbGl0ZS1hcGknO1xuZXhwb3J0IGNvbnN0IHZpeiA9IHZsXG4gIC5tYXJrQmFyKClcbiAgLmVuY29kZShcbiAgICB2bC55KCkuZmllbGRRKCdyYXRpbmcnKS50aXRsZSgnUmF0aW5ncycpLFxuICAgIHZsLngoKS5maWVsZE4oJ2RydWdOYW1lJykuc29ydCgnLXknKSxcbiAgICB2bC50b29sdGlwKHZsLmZpZWxkTygnY29uZGl0aW9uJyksIHZsLmZpZWxkTignY29uZGl0aW9uJykpXG4gICk7IiwiaW1wb3J0IHZlZ2EgZnJvbSAndmVnYSc7XG5pbXBvcnQgdmVnYUxpdGUgZnJvbSAndmVnYS1saXRlJztcbmltcG9ydCB2bCBmcm9tICd2ZWdhLWxpdGUtYXBpJztcbmltcG9ydCB7IEhhbmRsZXIgfSBmcm9tICd2ZWdhLXRvb2x0aXAnO1xuaW1wb3J0IHsgY29uZmlnIH0gZnJvbSAnLi9jb25maWcnO1xuaW1wb3J0IHsgZ2V0RGF0YSB9IGZyb20gJy4vZ2V0RGF0YSc7XG5pbXBvcnQgeyB2aXogfSBmcm9tICcuL3Zpeic7XG5cblxudmwucmVnaXN0ZXIodmVnYSwgdmVnYUxpdGUsIHtcbiAgdmlldzogeyByZW5kZXJlcjogJ3N2ZycgfSxcbiAgaW5pdDogdmlldyA9PiB7IHZpZXcudG9vbHRpcChuZXcgSGFuZGxlcigpLmNhbGwpOyB9XG59KTtcblxuY29uc3QgcnVuID0gYXN5bmMgKCkgPT4ge1xuICBjb25zdCBtYXJrcyA9IHZpelxuICAgIC5kYXRhKGF3YWl0IGdldERhdGEoKSlcbiAgICAud2lkdGgod2luZG93LmlubmVyV2lkdGgpXG4gICAgLmhlaWdodCh3aW5kb3cuaW5uZXJIZWlnaHQpXG4gICAgLmF1dG9zaXplKHsgdHlwZTogJ2ZpdCcsIGNvbnRhaW5zOiAncGFkZGluZycgfSlcbiAgICAuY29uZmlnKGNvbmZpZyk7XG4gIFxuICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGF3YWl0IG1hcmtzLnJlbmRlcigpKTtcbn07XG5ydW4oKTtcbiJdLCJuYW1lcyI6WyJjc3YiLCJkZXNjZW5kaW5nIiwiSGFuZGxlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztFQUFBOztFQUVBLE1BQU0sSUFBSSxHQUFHLFNBQVMsQ0FBQztBQUN2QixFQUFPLE1BQU0sTUFBTSxHQUFHO0lBQ3BCLElBQUksRUFBRTtNQUNKLE1BQU0sRUFBRSxLQUFLO01BQ2IsU0FBUyxFQUFFLFdBQVc7S0FDdkI7SUFDRCxLQUFLLEVBQUU7TUFDTCxhQUFhLEVBQUU7UUFDYixRQUFRLEVBQUUsRUFBRTtRQUNaLElBQUksRUFBRSxJQUFJO09BQ1g7TUFDRCxhQUFhLEVBQUU7UUFDYixRQUFRLEVBQUUsRUFBRTtRQUNaLElBQUksRUFBRSxNQUFNO09BQ2I7S0FDRjtHQUNGOztFQ2hCRCxNQUFNLE1BQU0sR0FBRyx5R0FBeUcsQ0FBQztBQUN6SCxFQUFPLE1BQU0sT0FBTyxHQUFHLFlBQVk7SUFDakMsSUFBSSxJQUFJLEdBQUcsTUFBTUEsTUFBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDOztJQUU3QixJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBS0MsYUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDOztJQUVwRCxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7OztJQUd6QixPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOztJQUVyQixPQUFPLElBQUksQ0FBQztHQUNiOztFQ2JNLE1BQU0sR0FBRyxHQUFHLEVBQUU7S0FDbEIsT0FBTyxFQUFFO0tBQ1QsTUFBTTtNQUNMLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQztNQUN4QyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7TUFDcEMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7S0FDM0Q7O0VDRUgsRUFBRSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFO0lBQzFCLElBQUksRUFBRSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUU7SUFDekIsSUFBSSxFQUFFLElBQUksSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSUMsbUJBQU8sRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUU7R0FDcEQsQ0FBQyxDQUFDOztFQUVILE1BQU0sR0FBRyxHQUFHLFlBQVk7SUFDdEIsTUFBTSxLQUFLLEdBQUcsR0FBRztPQUNkLElBQUksQ0FBQyxNQUFNLE9BQU8sRUFBRSxDQUFDO09BQ3JCLEtBQUssQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDO09BQ3hCLE1BQU0sQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDO09BQzFCLFFBQVEsQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxDQUFDO09BQzlDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQzs7SUFFbEIsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztHQUNqRCxDQUFDO0VBQ0YsR0FBRyxFQUFFLENBQUM7Ozs7In0=