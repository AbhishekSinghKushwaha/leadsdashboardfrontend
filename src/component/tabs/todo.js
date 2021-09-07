import React, { useState, useEffect, useRef } from 'react';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dialog } from 'primereact/dialog';
import { Calendar } from 'primereact/calendar';
import { useDispatch, useSelector } from 'react-redux';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import {fetchTodos, createTask, updateTask, deleteTask, filterTodo} from '../../actions/todo';
import { Link } from "react-router-dom";
import classNames from 'classnames';

const Todo = () => {

    const emptyTask = {
        title: "",
        task : "",
        priority: "",
        taskdate : new Date(),
        isCompleted : false
    };

    const emptyFilter = {
        ftask:"",
        ftasktype:"",
        isCompletedtrue:true,
        isfalse:false
    }

    const [tasks, setTasks] = useState(emptyTask);
    const todo = useSelector((state)=>state.todos);
    const high = useSelector((state)=>state.todos ? state.todos.filter((p)=>p.priority === "High"): null);
    const medium = useSelector((state)=>state.todos ? state.todos.filter((p)=>p.priority === "Medium"): null);
    const low = useSelector((state)=>state.todos ? state.todos.filter((p)=>p.priority === "Low"): null);

    const [submitted, setSubmitted] = useState(false);
    const [userDialog, setTasksDialog] = useState(false);
    const [google, setGoogle] = useState(JSON.parse(localStorage.getItem('profile')));
    const [filter, setfilter] = useState(emptyFilter);
    const dispatch = useDispatch();
    const [refreshKey, setRefreshKey] = useState(0);

    const toast = useRef(null);

    const openNew = () => {
        setTasks(emptyTask);
        setSubmitted(false);
        setTasksDialog(true);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setTasksDialog(false);
    }

    const handleInputChange = event => {
        const { name, value } = event.target;
        setTasks({ ...tasks, [name]: value });
    };

    const saveTask = e => {
        setSubmitted(true); 

        e.preventDefault();
        dispatch(createTask(tasks))
        .catch(e => {
            console.log(e);
        })
        setTasksDialog(false);
        toast.current.show({severity:'success', summary: 'Success', detail:'Task Created Successfully', life: 3000});
    };

    const updatedTask = (id) => {
        let data = {
            isCompleted : true
        }; 
        dispatch(updateTask(id, data))
        .then(response => {
        //   console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        })
        //toast.current.show({severity:'success', summary: 'Completed', detail:'Task Completed Successfully', life: 3000});
        setRefreshKey(oldKey => oldKey +1)
    }

    const deletedTask = (id) => {
        dispatch(deleteTask(id))
          .catch(e => {
            console.log(e);
          })
          toast.current.show({severity:'success', summary: 'Completed', detail:'Deleted Successfully', life: 3000});
      };

    const userDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog}/>
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveTask}/>
        </React.Fragment>
    );

   

    useEffect(() => {
        dispatch(fetchTodos());     
}, [refreshKey, dispatch]);


    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(filterTodo(filter));
      }

      const handleFilter = event => {
        const { name, value } = event.target;
        setfilter({ ...filter, [name]: value });
      };

      const filterReset = () => {
          setfilter({
            ftask:"",
            ftasktype:"",
            isCompletedtrue:true,
            isfalse:false
          })
      }

      const priorityoptions = ["High", "Medium", "Low"];

      const type = ["Completed", "Pending"];

    return ( 
        <div className="todo">
            <Toast ref={toast} />
            <div className="newtask">
            {google?(<>
                    <Button label="New Task" icon="pi pi-plus" className="p-button-sm p-button-info p-button-outlined" onClick={openNew}/>
            </>):(<><div>
                <Link to={"/auth"}>Signin</Link> to create tasks
                </div></>)}
                <form onSubmit={handleSubmit}>
                    <Dropdown 
                        id="ftasktype" 
                        name="ftasktype" 
                        value={filter.ftasktype} 
                        options={type} 
                        onChange={handleFilter} 
                        className="p-inputtext-sm p-d-block p-mb-2"
                        placeholder="Select Task" 
                        style={{marginRight: '.3em'}}
                    />
                    
                    <InputText 
                        id="ftask" 
                        name="ftask" 
                        value={filter.ftask} 
                        type="text" 
                        className="p-inputtext-sm p-d-block p-mb-2"
                        onChange={handleFilter} 
                        placeholder="Search..."
                        style={{marginRight: '.3em'}} 
                    />
                    <Button 
                        icon="pi pi-search"
                        className="p-button-info p-button-sm p-button-outlined"
                        type="submit" 
                        style={{marginRight: '.3em'}}
                    />
                    <Button 
                        icon="pi pi-times"
                        className="p-button-info p-button-sm p-button-outlined"
                        type="submit" 
                        onClick={filterReset}
                    />
                </form>
            </div>
            <br />
            <br />

            <Dialog visible={userDialog} style={{ width: '600px' }} header="Add New Task" modal className="p-fluid" footer={userDialogFooter} onHide={hideDialog}>

                    <div className="p-field">
                        <label htmlFor="newtask">Title</label>
                        <div className="p-col">
                            <InputText 
                            id="title" 
                            type="text"
                            value={tasks.title}
                            onChange={handleInputChange}
                            name="title"
                            required 
                            className={classNames({ 'p-invalid': submitted && !tasks.title })}
                            />
                            {submitted && !tasks.title && <small className="p-error">Title is required.</small>}
                        </div>
                    </div><br/>

                    <div className="p-field">
                        <label htmlFor="newtask">Task</label>
                        <div className="p-col">
                            <InputTextarea 
                            id="task" 
                            type="text"
                            value={tasks.task}
                            onChange={handleInputChange}
                            name="task"
                            rows={5} 
                            cols={30}
                            autoResize 
                            required 
                            className={classNames({ 'p-invalid': submitted && !tasks.task })}
                            />
                            {submitted && !tasks.task && <small className="p-error">Task is required.</small>}
                        </div>
                    </div><br/>

                    <div className="p-field">
                    <label>Priority</label>
                    <Dropdown 
                    value={tasks.priority} 
                    options={priorityoptions} 
                    onChange={handleInputChange} 
                    placeholder="Select priority" 
                    name="priority"
                    required 
                    className={classNames({ 'p-invalid': submitted && !tasks.priority })}
                    />
                    {submitted && !tasks.priority && <small className="p-error">Priority is required.</small>}
                    </div><br/>

                    <div className="p-field">
                        <label htmlFor="icon">Due date</label>
                        <Calendar id="icon" 
                        value={tasks.taskdate} 
                        onChange={handleInputChange} 
                        showIcon 
                        name="taskdate"
                        required 
                        className={classNames({ 'p-invalid': submitted && !tasks.taskdate })}
                        />
                        {submitted && !tasks.taskdate && <small className="p-error">Due date is required.</small>}
                    </div>              
            </Dialog>

            <div className="container page-todo bootstrap snippets bootdeys">
                <div className="col-sm-12 tasks">
                
                    <div className="task-list">
                        <h4 style={{textAlign:"center"}}>Tasks</h4>
                        <div className="priority high"><span>High Priority</span></div>
                        {!high.length ? <i className="pi pi-spin pi-spinner todoloader"></i> : 
                        <div>
                        {high.map((data, index) => (
                        <div className="task high" key={index}>
                            <div className="desc">
                            <h6>{data.title}</h6>
                                <div>Created at {new Date(data.createdAt).toLocaleDateString()}</div><br />
                                <div className={data.isCompleted ? "strike" : ""} style={{fontSize:"14px"}}>{data.task}</div>
                            </div>
                            <div className="time">
                                <div>Due date</div>
                                <h6 className="datatask">{new Date(data.taskdate).toLocaleDateString()}</h6><br />
                                {google?(<>
                                    <div className="dropdown">
                                        <Button 
                                        className="p-button-text p-button-secondary p-button-sm"
                                        icon="pi pi-ellipsis-h" 
                                        type="button" 
                                        id="dropdownMenuButton" 
                                        data-toggle="dropdown" 
                                        aria-haspopup="true" 
                                        aria-expanded="false"
                                        />
                                    <div className="dropdown-menu dropdown-todo" aria-labelledby="dropdownMenuButton">
                                    {!data.isCompleted && <>
                                        <Button icon="pi pi-check" label="Mark as completed" className="p-button-text p-button-secondary p-button-sm btn-block dropbutton" onClick={() => updatedTask(data._id)}/></>}
                                        <Button icon="pi pi-trash" label="Delete Task" className="p-button-text p-button-danger p-button-sm btn-block dropbutton" onClick={() => deletedTask(data._id)}/>
                                    </div>
                                    </div>
                                </>):
                                (<>
                                </>)} 
                            </div>
                            </div>
                        ))}
                        </div> 
                        }

                        <div className="priority medium"><span>Medium Priority</span></div>
                        {!medium.length ? <i className="pi pi-spin pi-spinner todoloader"></i> : 
                        <div>
                        {medium.map((data, index) => (
                        <div className="task medium" key={index}>
                            <div className="desc">
                                <h6>{data.title}</h6>
                                <div>Created at {new Date(data.createdAt).toLocaleDateString()}</div><br />
                                <div className={data.isCompleted ? "strike" : ""} style={{fontSize:"14px"}}>{data.task}</div>
                            </div>
                            <div className="time">
                                <div>Due date</div>
                                <h6 className="datatask">{new Date(data.taskdate).toLocaleDateString()}</h6><br />
                                {google?(<>
                                    <div className="dropdown">
                                        <Button 
                                        className="p-button-text p-button-secondary p-button-sm"
                                        icon="pi pi-ellipsis-h" 
                                        type="button" 
                                        id="dropdownMenuButton" 
                                        data-toggle="dropdown" 
                                        aria-haspopup="true" 
                                        aria-expanded="false"
                                        />
                                    <div className="dropdown-menu dropdown-todo" aria-labelledby="dropdownMenuButton">
                                    {!data.isCompleted && <>
                                        <Button icon="pi pi-check" label="Mark as completed" className="p-button-text p-button-secondary p-button-sm btn-block dropbutton" onClick={() => updatedTask(data._id)}/></>}
                                        <Button icon="pi pi-trash" label="Delete Task" className="p-button-text p-button-danger p-button-sm btn-block dropbutton" onClick={() => deletedTask(data._id)}/>
                                    </div>
                                    </div>
                                                                    
                                    </>):
                                (<>
                                </>)} 
                            </div>
                        </div>
                        ))} 
                        </div> 
                        }

                        <div className="priority low"><span>Low Priority</span></div>
                        {!low.length ? <i className="pi pi-spin pi-spinner todoloader"></i> : 
                        <div>
                        {low.map((data, index) => (
                        <div className="task low" key={index}>
                            <div className="desc">
                                <h6>{data.title}</h6>
                                <div>Created at {new Date(data.createdAt).toLocaleDateString()}</div><br />
                                <div className={data.isCompleted ? "strike" : ""} style={{fontSize:"14px"}}>{data.task}</div>
                            </div>
                            <div className="time">
                                <div>Due date</div>
                                <h6 className="datatask">{new Date(data.taskdate).toLocaleDateString()}</h6><br />
                                {google?(<>
                                    <div className="dropdown">
                                        <Button 
                                        className="p-button-text p-button-secondary p-button-sm"
                                        icon="pi pi-ellipsis-h" 
                                        type="button" 
                                        id="dropdownMenuButton" 
                                        data-toggle="dropdown" 
                                        aria-haspopup="true" 
                                        aria-expanded="false"
                                        />
                                    <div className="dropdown-menu dropdown-todo" aria-labelledby="dropdownMenuButton">
                                        {!data.isCompleted && <>
                                            <Button icon="pi pi-check" label="Mark as completed" className="p-button-text p-button-secondary p-button-sm btn-block dropbutton" onClick={() => updatedTask(data._id)}/></>}
                                        <Button icon="pi pi-trash" label="Delete Task" className="p-button-text p-button-danger p-button-sm btn-block dropbutton" onClick={() => deletedTask(data._id)}/>
                                    </div>
                                    </div>
                                </>):
                                (<>
                                </>)} 
                            </div>
                        </div>
                        ))}
                        </div> 
                        }
                        
                        <div className="clearfix"></div>	
	
                    </div>	
                </div>
                </div>  
        </div>
     );
}
 
export default Todo;