import React, { useEffect, useState } from 'react';
// import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import {FormControl,InputLabel,Select,MenuItem,Button,Box} from '@mui/material';
import  {SelectChangeEvent} from '@mui/material/Select';

type Employee = {
  id: string,
  name: string
};
type Task = {
  id: string,
  name: string,
  des:string,
  location:object,
  status:string
};
type Assign = {
  id:string,
  employeeID: string,
  employeeName: string,
  taskID: string,
  taskname: string,
  status:string,
  location:object
};

function App() {

 const [getemp, setDataEMP] = useState<Employee[]>([]);
 const [gettask, setDataTask] = useState<Task[]>([]);
 const [getassign, setAssign] = useState<Assign>({id:"task1",employeeID:"",employeeName:"",taskID:"",taskname:"",status:"waiting",location:{}});

 async function fetchMoviesAndCategories() {
  const [employees, Task] = await Promise.all([
    fetch('https://680f-2405-9800-ba12-b9a9-1dc1-89a6-936-2c1f.ap.ngrok.io/employees'),
    fetch('https://680f-2405-9800-ba12-b9a9-1dc1-89a6-936-2c1f.ap.ngrok.io/Task')
  ]);
  const employeesDB = await employees.json();
  const TaskDB = await Task.json();
  return [employeesDB, TaskDB];
}

 useEffect(() => {
  fetchMoviesAndCategories().then(([employeesDB, TaskDB]) => {
    setDataEMP(employeesDB)
    setDataTask(TaskDB)
  }).catch(error => {
    console.log(error)
    // /movies or /categories request failed
  });
}, [])

const handleChange = (event: SelectChangeEvent) => {
  const getVlaue = event.target.value;
  let getItem = getemp.find(state => state.id === getVlaue)!;
  // setAssign({employeeID: getItem.id,employeeName:getItem.name as string})

  let updatedValue = {};
  updatedValue = {employeeID: getItem.id,employeeName:getItem.name as string};
  setAssign(getemp => ({
       ...getemp,
       ...updatedValue
  }));

};

const handleChangeTask = (event: SelectChangeEvent) => {
  const getVlaue = event.target.value;
  let getItem = gettask.find(state => state.id === getVlaue)!;
  let updatedValue = {};
  updatedValue = {taskID: getItem.id,taskname:getItem.name as string,location:getItem.location};
  setAssign(getemp => ({
       ...getemp,
       ...updatedValue
  }));
};

const onAssign = () => {
  console.log(getassign)

    fetch('https://680f-2405-9800-ba12-b9a9-1dc1-89a6-936-2c1f.ap.ngrok.io/assignTask', {
      method: 'POST',
      headers: {
        Accept: 'application/form-data',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(getassign),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(response.statusText)
      }
      return response.json()
    }).catch(err=>{
    console.log(err)
    })
};


  // Promise.all([
  //   fetch("https://132c-2405-9800-ba12-b9a9-5c42-b1c7-8192-5994.ap.ngrok.io/employees",requestOptions),
  //   fetch("https://132c-2405-9800-ba12-b9a9-5c42-b1c7-8192-5994.ap.ngrok.io/Task",requestOptions),
  //   fetch("https://132c-2405-9800-ba12-b9a9-5c42-b1c7-8192-5994.ap.ngrok.io/assignTask",requestOptions)
  // ]).then(([employees, Task, assignTask]) => {
  //     console.log(employees)
  //     console.log(Task)
  //     console.log(assignTask)
  // }).catch((err) => {
  //     console.log(err);
  // });

  return (
    <div className="App">
      <header className="App-header">
      <Box sx={{ minWidth: 120 }}>
      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="demo-simple-select-label">Employees</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          label="Employee"
          onChange={handleChange}
          value={getassign.employeeID}
        >
          {getemp.map((employee, index) => {
            return(
              <MenuItem value={employee.id}>{employee.name}</MenuItem>
              )
            })
            }
              {/* { getemp && getemp.map((item) => (
                <MenuItem key={item}>
                  {item.name}
                </MenuItem>
              ))} */}
        </Select>
      </FormControl>
      <FormControl  sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="demo-simple-select-label">Task</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          label="Task"
          onChange={handleChangeTask}
          value={getassign.taskID}
        >
          {gettask.map((task, index) => {
            return(
              <MenuItem value={task.id}>{task.name}</MenuItem>
              )
            })
            }
              {/* { getemp && getemp.map((item) => (
                <MenuItem key={item}>
                  {item.name}
                </MenuItem>
              ))} */}
        </Select>
      </FormControl>
      </Box>
      <Box sx={{ minWidth: 120 }}>    
           <Button onClick={onAssign} variant="contained">Assign Task</Button>   
      </Box>
        {/* <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a> */}
      </header>
    </div>
  );
}

export default App;
