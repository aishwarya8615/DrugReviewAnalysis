import React, { useState, useEffect } from 'react';
import { csv } from 'd3';

const csvUrl =
  'https://gist.githubusercontent.com/aishwarya8615/4462b7306efe7e44629cb841c892b456/raw/DrugsdataTest.csv';
export const useData = () => {
  const [data, setData] = useState(null);
  if(data){
    console.log(data[0]);
  }
  useEffect(() => {
    const row = d => {
      d['rating'] = +d['rating'];
      d['date'] = new Date(d['date']);
      return d;
    };
    csv(csvUrl, row).then(setData);
  }, []);
  
  return data;
};