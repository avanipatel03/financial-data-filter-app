import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {

  const[data, setData] = useState([]);
  const[filteredData, setFilteredData] = useState([]);
  const[sortConfig, setSortConfig] = useState({
    key:'date',
    direction:'asc',
  })
 


  // Filter States
  const[dateRange, setDateRange] = useState({start:'',end: ''});
  const[revenueRange, setRevenueRange] = useState({min:'',max:''}) ;
  const[netIncomeRange, setNetIncomeRange] = useState({min:'', max:''});

 
    // Fetch data from API
  useEffect( () => {
    const fetchData = async () => {
      try{
        const response = await axios.get("https://financialmodelingprep.com/api/v3/income-statement/AAPL?period=annual&apikey=mMIolHVZRCU1aSPUmL8gK4CWjphpKFCD")
        setData(response.data);
        setFilteredData(response.data);
      }
      catch(error){
        console.error("Error fetching data", error);
      }
    };
    fetchData();

  }, []);

  // Filtering Code from user input

  const applyFilters = () => {
    let filtered = [...data];

     // Filter by Date Range (years)
     if (dateRange.start && dateRange.end) {
      filtered = filtered.filter(item => {
        const itemYear = new Date(item.date).getFullYear();
        return itemYear >= parseInt(dateRange.start) && itemYear <= parseInt(dateRange.end);
      });
    }


    // Filter Revenue Range

    if(revenueRange.min && revenueRange.max){
      filtered = filtered.filter(item => item.revenue >= revenueRange.min && item.revenue <= revenueRange.max);
    }

    // Filter Net Income

    if(netIncomeRange.min && netIncomeRange.max){
      filtered = filtered.filter(item => item.netIncome >= netIncomeRange.min && item.netIncome <= netIncomeRange.max);

    }



    setFilteredData(filtered);
  };

  // handle Sorting


  const sortColumn = (key) =>{
    let direction = 'asc';
    if(sortConfig.key === key && sortConfig.direction === 'asc'){
      direction = 'desc';
    }
    setSortConfig({key,direction});
  };

 //sorting based on column

 const sortedData = [...filteredData].sort((a,b) => {

  const aValue = a[sortConfig.key];
  const bValue = b[sortConfig.key];

  if(aValue < bValue) {
    return sortConfig.direction === 'asc' ? -1:1;
  }
  if(aValue > bValue) {
    return sortConfig.direction === 'asc' ? 1:-1;
  }
  return 0;

 });


  
  return(

   
    <div className='container mx-auto p-4'>
      <h1 className='text-3xl text-purple-900 font-bold mb-4'>Financial Data - Income statements</h1>

      {/* Filters */}

      <div className='mb-4'>
        <div className='flex mb-4 gap-4'>
          <div className='dateRange'>
            <label className='block text-purple-900'>Date Range: </label>
            <input type='number' className='border px-2 py-2 mb-2' name='dateReange_start' 
            value={dateRange.start}
              onChange={(e) => setDateRange((prev) => ({ ...prev, start: e.target.value }))}
              placeholder='Start Year'/>
            <input type='number' className='border px-2 py-2' 
            name='dateRange_end'
            value={dateRange.end} 
            onChange={(e) => setDateRange((prev) => ({ ...prev, end: e.target.value }))}
            placeholder='End Year'/>

          </div>

          <div className='revenueRange'>
            <label className='block text-purple-900'>Revenue Range: </label>
            <input type='number' className='border px-2 py-2 mb-2'
            value={revenueRange.min}
            onChange={(e) => setRevenueRange((prev) => ({...prev,min:e.target.value}))}
            placeholder='Min Revenue'/>
            <input type='number' className='border px-2 py-2' 
            value={revenueRange.max}
            onChange={(e) => setRevenueRange((prev) => ({...prev,max:e.target.value}))}
             placeholder='Max Revenue'/>

          </div>


          <div className='netIncomeRange'>
            <label className='block text-purple-900'>Net Income Range: </label>
            <input type='number' className='border px-2 py-2 mb-2' 
            value={netIncomeRange.min}
            onChange={(e) => setNetIncomeRange((prev) => ({...prev,min:e.target.value}) )}
            placeholder='Min Net Income'/>
            <input type='number' className='border px-2 py-2'
            value={netIncomeRange.max}
            onChange={(e) => setNetIncomeRange((prev) => ({...prev,max:e.target.value}) )}
             placeholder='max Net Income'/>
            
          </div>


         

          <div className='flex items-end'>
            <button onClick={applyFilters} className='bg-purple-900 text-white px-2 py-2 m-2 rounded'>
              Apply Filter
            </button>

          </div>

          

        </div>
        
      </div>

      {/*  Filter codeing End*/ }
      <div className='overflow-x-auto'>
      <table className='min-w-full table-auto border-collapse'>
        <thead>
          <tr>
            <th className='border px-4 py-2 cursor-pointer' onClick={()=> sortColumn('date')} >
                Date
            </th>
            <th className='border px-4 py-2 '>Symbol</th>
            <th className='border px-4 py-2 '>Filling Date</th>

            <th className='border px-4 py-2 cursor-pointer'  onClick={() => sortColumn('revenue')} >Revenue</th>
            <th className='border px-4 py-2 cursor-pointer'  onClick={() => sortColumn('netIncome')}>Net Income</th>
            <th className='border px-4 py-2 '>Gross Profit</th>
            <th className='border px-4 py-2 '>EPS</th>
            <th className='border px-4 py-2 '>Operating Income</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.length > 0 ? (
            sortedData.map((item, index) => (

              
              <tr key={index} >
                <td className='border px-4 py-2' >{item.date}</td>
                <td className='border px-4 py-2'>{item.symbol}</td>
                <td className='border px-4 py-2'>{item.fillingDate}</td>

                <td className='border px-4 py-2'>{item.revenue}</td>
                <td className='border px-4 py-2'>{item.netIncome}</td>
                <td className='border px-4 py-2'>{item.grossProfit}</td>
                <td className='border px-4 py-2'>{item.eps}</td>
                <td className='border px-4 py-2'>{item.operatingIncome}</td>


              </tr>
            ))

          ): (
            <tr>
              <td className='border px-4 py-2'>
                No data available
              </td>
            </tr>

          )}

        </tbody>
      </table>
      </div>
    </div>

  );

}

export default App;



 
