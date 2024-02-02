import React, {useState, useEffect} from 'react';
import './App.css';
import {AiOutlineDelete} from 'react-icons/ai';
import {BsCheckLg} from 'react-icons/bs';
import axios from 'axios';
function App () {
  const [allTodos, setAllTodos] = useState ([]);
  const [newTodoTitle, setNewTodoTitle] = useState ('');
  const [newDescription, setNewDescription] = useState ('');
  const [completedTodos, setCompletedTodos] = useState ([]);
  const [isCompletedScreen, setIsCompletedScreen] = useState (false);

  const handleAddNewToDo = () => {
    // const xhr = new XMLHttpRequest();
    // xhr.open('POST', 'http://13.235.48.55/task/create')
    axios.post('http://13.235.48.55/task/create', {
      title: newTodoTitle,
      description: newDescription,
      dueDate: ""
    })
      .then(response => {
        let fetchedTodos = response.data;
        console.log(fetchedTodos);
      })
      .catch(error => {
        console.error(error);
      });
    fetchAndSetTodos();
    setNewDescription ('');
    setNewTodoTitle ('');
  };
  const fetchAndSetTodos = () => {
    axios.get('http://13.235.48.55/tasks?pageSize=1000')
      .then(response => {
        let fetchedTodos = response.data;
        let uncompleteTodos = [];
        let completeTodos = [];
        console.log(fetchedTodos);
        for (let todo of fetchedTodos) {
          console.log(todo);
          if (todo.completed === true) {
            completeTodos.push(todo);
          }
          else {
            uncompleteTodos.push(todo);
          }
        }
        console.log(uncompleteTodos);
        console.log(completeTodos);
        setAllTodos(uncompleteTodos);
        setCompletedTodos(completeTodos);
      })
      .catch(error => {
        console.error(error);
      });
  };
  useEffect (() => {
    fetchAndSetTodos();
  }, []);

  const handleToDoDelete = index => {
    axios.delete('http://13.235.48.55/task/delete/'.concat(index))
      .then(response => {
        console.log(response.data);
        fetchAndSetTodos();
      })
      .catch(error => {
        console.error(error);
      });
  };

  const handleCompletedTodoDelete = index => {
    axios.delete('http://13.235.48.55/task/delete/'.concat(index))
      .then(response => {
        console.log(response.data);
        fetchAndSetTodos();
      })
      .catch(error => {
        console.error(error);
      });
  };

  const handleComplete = item => {
    const date = new Date ();
    var dd = date.getDate ();
    var mm = date.getMonth () + 1;
    var yyyy = date.getFullYear ();
    var hh = date.getHours ();
    var minutes = date.getMinutes ();
    var ss = date.getSeconds ();
    var finalDate =
      dd + '-' + mm + '-' + yyyy + ' at ' + hh + ':' + minutes + ':' + ss;

    axios.put('http://13.235.48.55/task/update', {
      id: item.id,
      title: item.title,
      description: item.description,
      dueDate: finalDate,
      completed: true
    }).then(response => {
      fetchAndSetTodos();
    })
    .catch(error => {
      console.error(error);
    });
  };

  return (
    <div className="App">
      <h1>Task Tracker App</h1>

      <div className="todo-wrapper">

        <div className="todo-input">
          <div className="todo-input-item">
            <label>Title:</label>
            <input
              type="text"
              value={newTodoTitle}
              onChange={e => setNewTodoTitle (e.target.value)}
              placeholder="What's the title of your To Do?"
            />
          </div>
          <div className="todo-input-item">
            <label>Description:</label>
            <input
              type="text"
              value={newDescription}
              onChange={e => setNewDescription (e.target.value)}
              placeholder="What's the description of your To Do?"
            />
          </div>
          <div className="todo-input-item">
            <button
              className="primary-btn"
              type="button"
              onClick={handleAddNewToDo}
            >
              Add
            </button>
          </div>
        </div>
        <div className="btn-area">
          <button
            className={`secondaryBtn ${isCompletedScreen === false && 'active'}`}
            onClick={() => setIsCompletedScreen (false)}
          >
            To Do
          </button>
          <button
            className={`secondaryBtn ${isCompletedScreen === true && 'active'}`}
            onClick={() => setIsCompletedScreen (true)}
          >
            Completed
          </button>
        </div>
        <div className="todo-list">

          {isCompletedScreen === false &&
            allTodos.map ((item, index) => (
              <div className="todo-list-item" key={item.id}>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>

                </div>
                <div>
                  <AiOutlineDelete
                    title="Delete?"
                    className="icon"
                    onClick={() => handleToDoDelete (item.id)}
                  />
                  <BsCheckLg
                    title="Completed?"
                    className=" check-icon"
                    onClick={() => handleComplete (item)}
                  />
                </div>
              </div>
            ))}

          {isCompletedScreen === true &&
            completedTodos.map ((item, index) => (
              <div className="todo-list-item" key={item.id}>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <p> <i>Completed at: {item.dueDate}</i></p>
                </div>
                <div>
                  <AiOutlineDelete
                    className="icon"
                    onClick={() => handleCompletedTodoDelete (item.id)}
                  />
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default App;