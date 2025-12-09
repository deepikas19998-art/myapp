import { useState } from 'react'
import './App.css'

function App() {
const [ToDoList, setToDoList] = useState([]);

  const saveToDoList = (event) => {
    event.preventDefault();

    const toName = event.target.toName.value.trim();

    if (!ToDoList.includes(toName)) {
      const finalToDoList = [...ToDoList, toName]
      setToDoList([...ToDoList, toName]);
      event.target.toName.value = "";
    } else {
      alert("ToDo Name Already Exists...");
    }
  };

  const list = ToDoList.map((value, index)=> {
    return (
<ToDoListItems value={value} key={index} indexNumber={index} 
ToDoList={ToDoList}
setToDoList={setToDoList}
/>
    )
  })


  return (
       
      <div className='outerDiv'>
        <h1>Todo List</h1>
        <form onSubmit={saveToDoList}>
          <input type= "text" name = 'toName' className="rgb-input"/><button class="save">
            <span>Save</span>
          </button>
        </form>
        <div>
        <ul>
          {list}
        </ul>
        </div>
        </div>
  )
}

export default App

function ToDoListItems({value, indexNumber, ToDoList, setToDoList}){
  const [status, setStatus] = useState(false)
  const deleteRow = () => {
    const finalData = ToDoList.filter((v,i)=> i!= indexNumber)
    setToDoList(finalData)
  }

  const checkStatus = () => {
  setStatus(!status)
  
  }
  return(
    <li className={(status)? 'completeToDo': ''} onClick={checkStatus}> {indexNumber+1} {value} <span onClick={deleteRow}>&times;</span></li>
  )
}
