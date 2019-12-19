import { csv, descending } from 'd3';

const csvUrl = 'https://gist.githubusercontent.com/aishwarya8615/4462b7306efe7e44629cb841c892b456/raw/DrugsdataTest.csv'; 
export const getData = async () => {
  let data = await csv(csvUrl);
  
  data.sort((a, b) => descending(+a.value, +b.value));
  
  data = data.slice(0, 80);
  
  // Have a look at the attributes available in the console!
  console.log(data[0]);

  return data;
};