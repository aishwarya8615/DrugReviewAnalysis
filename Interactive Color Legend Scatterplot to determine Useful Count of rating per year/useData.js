import React, { useState, useEffect } from 'react';
import { csv } from 'd3';

const csvUrl =
  'https://gist.githubusercontent.com/aishwarya8615/4462b7306efe7e44629cb841c892b456/raw/DrugsdataTest.csv';

export const useData = () => {
  const [data, setData] = useState(null);
 	//const formatYear = d3.timeFormat("%Y"),
         //formatYear(date);

  useEffect(() => {
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
    csv(csvUrl, row).then(setData);
  }, []);
  
  return data;
};