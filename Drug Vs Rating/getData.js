import { csv } from 'd3';

const csvUrl = 'https://gist.githubusercontent.com/aishwarya8615/4462b7306efe7e44629cb841c892b456/raw/DrugsdataTest.csv';

export const getData = async () => {
  const data = await csv(csvUrl);
  
  // Have a look at the attributes available in the console!
  console.log(data[0]);

  return data;
};