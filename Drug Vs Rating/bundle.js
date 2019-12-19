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
      tickColor: 'lightGray'
    },
    style: {
      "guide-label": {
        fontSize: 10,
        fill: dark
      },
      "guide-title": {
        fontSize: 15,
        fill: dark
      }
    }
  };

  const csvUrl = 'https://gist.githubusercontent.com/aishwarya8615/4462b7306efe7e44629cb841c892b456/raw/DrugsdataTest.csv';

  const getData = async () => {
    const data = await d3.csv(csvUrl);
    
    // Have a look at the attributes available in the console!
    console.log(data[0]);

    return data;
  };

  const viz = vl
    .markCircle({ size: 30, opacity: 0.5 })
    .encode(
      vl.x().fieldO('drugName').scale({ zero: false }),
      vl.y().fieldQ('usefulCount').scale({ zero: false }),
      vl.color().field('rating'),
    	//vl.size().fieldQ('rating'),
      vl.tooltip().fieldO('condition')
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
    	//.autosize(resize: 'true')
      .autosize({ type: 'fit', contains: 'padding' })
      .config(config);
    
    document.body.appendChild(await marks.render());
  };
  run();

}(vega, vegaLite, vl, vegaTooltip, d3));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbImNvbmZpZy5qcyIsImdldERhdGEuanMiLCJ2aXouanMiLCJpbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBBcHBlYXJhbmNlIGN1c3RvbWl6YXRpb24gdG8gaW1wcm92ZSByZWFkYWJpbGl0eS5cbi8vIFNlZSBodHRwczovL3ZlZ2EuZ2l0aHViLmlvL3ZlZ2EtbGl0ZS9kb2NzL1xuY29uc3QgZGFyayA9ICcjM2UzYzM4JztcbmV4cG9ydCBjb25zdCBjb25maWcgPSB7XG4gIGF4aXM6IHtcbiAgICBkb21haW46IGZhbHNlLFxuICAgIHRpY2tDb2xvcjogJ2xpZ2h0R3JheSdcbiAgfSxcbiAgc3R5bGU6IHtcbiAgICBcImd1aWRlLWxhYmVsXCI6IHtcbiAgICAgIGZvbnRTaXplOiAxMCxcbiAgICAgIGZpbGw6IGRhcmtcbiAgICB9LFxuICAgIFwiZ3VpZGUtdGl0bGVcIjoge1xuICAgICAgZm9udFNpemU6IDE1LFxuICAgICAgZmlsbDogZGFya1xuICAgIH1cbiAgfVxufTsiLCJpbXBvcnQgeyBjc3YgfSBmcm9tICdkMyc7XG5cbmNvbnN0IGNzdlVybCA9ICdodHRwczovL2dpc3QuZ2l0aHVidXNlcmNvbnRlbnQuY29tL2Fpc2h3YXJ5YTg2MTUvNDQ2MmI3MzA2ZWZlN2U0NDYyOWNiODQxYzg5MmI0NTYvcmF3L0RydWdzZGF0YVRlc3QuY3N2JztcblxuZXhwb3J0IGNvbnN0IGdldERhdGEgPSBhc3luYyAoKSA9PiB7XG4gIGNvbnN0IGRhdGEgPSBhd2FpdCBjc3YoY3N2VXJsKTtcbiAgXG4gIC8vIEhhdmUgYSBsb29rIGF0IHRoZSBhdHRyaWJ1dGVzIGF2YWlsYWJsZSBpbiB0aGUgY29uc29sZSFcbiAgY29uc29sZS5sb2coZGF0YVswXSk7XG5cbiAgcmV0dXJuIGRhdGE7XG59OyIsImltcG9ydCB2bCBmcm9tICd2ZWdhLWxpdGUtYXBpJztcbmV4cG9ydCBjb25zdCB2aXogPSB2bFxuICAubWFya0NpcmNsZSh7IHNpemU6IDMwLCBvcGFjaXR5OiAwLjUgfSlcbiAgLmVuY29kZShcbiAgICB2bC54KCkuZmllbGRPKCdkcnVnTmFtZScpLnNjYWxlKHsgemVybzogZmFsc2UgfSksXG4gICAgdmwueSgpLmZpZWxkUSgndXNlZnVsQ291bnQnKS5zY2FsZSh7IHplcm86IGZhbHNlIH0pLFxuICAgIHZsLmNvbG9yKCkuZmllbGQoJ3JhdGluZycpLFxuICBcdC8vdmwuc2l6ZSgpLmZpZWxkUSgncmF0aW5nJyksXG4gICAgdmwudG9vbHRpcCgpLmZpZWxkTygnY29uZGl0aW9uJylcbiAgKTsiLCJpbXBvcnQgdmVnYSBmcm9tICd2ZWdhJztcbmltcG9ydCB2ZWdhTGl0ZSBmcm9tICd2ZWdhLWxpdGUnO1xuaW1wb3J0IHZsIGZyb20gJ3ZlZ2EtbGl0ZS1hcGknO1xuaW1wb3J0IHsgSGFuZGxlciB9IGZyb20gJ3ZlZ2EtdG9vbHRpcCc7XG5pbXBvcnQgeyBjb25maWcgfSBmcm9tICcuL2NvbmZpZyc7XG5pbXBvcnQgeyBnZXREYXRhIH0gZnJvbSAnLi9nZXREYXRhJztcbmltcG9ydCB7IHZpeiB9IGZyb20gJy4vdml6JztcblxudmwucmVnaXN0ZXIodmVnYSwgdmVnYUxpdGUsIHtcbiAgdmlldzogeyByZW5kZXJlcjogJ3N2ZycgfSxcbiAgaW5pdDogdmlldyA9PiB7IHZpZXcudG9vbHRpcChuZXcgSGFuZGxlcigpLmNhbGwpOyB9XG59KTtcblxuY29uc3QgcnVuID0gYXN5bmMgKCkgPT4ge1xuICBjb25zdCBtYXJrcyA9IHZpelxuICAgIC5kYXRhKGF3YWl0IGdldERhdGEoKSlcbiAgICAud2lkdGgod2luZG93LmlubmVyV2lkdGgpXG4gICAgLmhlaWdodCh3aW5kb3cuaW5uZXJIZWlnaHQpXG4gIFx0Ly8uYXV0b3NpemUocmVzaXplOiAndHJ1ZScpXG4gICAgLmF1dG9zaXplKHsgdHlwZTogJ2ZpdCcsIGNvbnRhaW5zOiAncGFkZGluZycgfSlcbiAgICAuY29uZmlnKGNvbmZpZyk7XG4gIFxuICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGF3YWl0IG1hcmtzLnJlbmRlcigpKTtcbn07XG5ydW4oKTsiXSwibmFtZXMiOlsiY3N2IiwiSGFuZGxlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztFQUFBOztFQUVBLE1BQU0sSUFBSSxHQUFHLFNBQVMsQ0FBQztBQUN2QixFQUFPLE1BQU0sTUFBTSxHQUFHO0lBQ3BCLElBQUksRUFBRTtNQUNKLE1BQU0sRUFBRSxLQUFLO01BQ2IsU0FBUyxFQUFFLFdBQVc7S0FDdkI7SUFDRCxLQUFLLEVBQUU7TUFDTCxhQUFhLEVBQUU7UUFDYixRQUFRLEVBQUUsRUFBRTtRQUNaLElBQUksRUFBRSxJQUFJO09BQ1g7TUFDRCxhQUFhLEVBQUU7UUFDYixRQUFRLEVBQUUsRUFBRTtRQUNaLElBQUksRUFBRSxJQUFJO09BQ1g7S0FDRjtHQUNGOztFQ2hCRCxNQUFNLE1BQU0sR0FBRyx5R0FBeUcsQ0FBQzs7QUFFekgsRUFBTyxNQUFNLE9BQU8sR0FBRyxZQUFZO0lBQ2pDLE1BQU0sSUFBSSxHQUFHLE1BQU1BLE1BQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQzs7O0lBRy9CLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7O0lBRXJCLE9BQU8sSUFBSSxDQUFDO0dBQ2I7O0VDVk0sTUFBTSxHQUFHLEdBQUcsRUFBRTtLQUNsQixVQUFVLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQztLQUN0QyxNQUFNO01BQ0wsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLENBQUM7TUFDaEQsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLENBQUM7TUFDbkQsRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUM7O01BRTFCLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDO0tBQ2pDOztFQ0RILEVBQUUsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRTtJQUMxQixJQUFJLEVBQUUsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFO0lBQ3pCLElBQUksRUFBRSxJQUFJLElBQUksRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUlDLG1CQUFPLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFO0dBQ3BELENBQUMsQ0FBQzs7RUFFSCxNQUFNLEdBQUcsR0FBRyxZQUFZO0lBQ3RCLE1BQU0sS0FBSyxHQUFHLEdBQUc7T0FDZCxJQUFJLENBQUMsTUFBTSxPQUFPLEVBQUUsQ0FBQztPQUNyQixLQUFLLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQztPQUN4QixNQUFNLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQzs7T0FFMUIsUUFBUSxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLENBQUM7T0FDOUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDOztJQUVsQixRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO0dBQ2pELENBQUM7RUFDRixHQUFHLEVBQUU7Ozs7In0=