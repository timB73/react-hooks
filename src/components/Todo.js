import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Todo = props => {
    const [todoName, setTodoName] = useState('');
    const [todoList, setTodoList] = useState([]);

    useEffect(() => {
        axios
            .get('https://react-hooks-95d0d.firebaseio.com/todos.json')
            .then(result => {
                console.log(result);
                const todoData = result.data;
                const todos = [];
                for (const key in todoData) {
                    todos.push({ id: key, name: todoData[key].name });
                }
                setTodoList(todos);
            });
    }, []);
    const inputChangeHandler = event => {
        setTodoName(event.target.value);
    };

    const todoAddHandler = async () => {
        setTodoList(todoList.concat(todoName));
        try {
            const res = await axios.post(
                'https://react-hooks-95d0d.firebaseio.com/todos.json',
                { name: todoName }
            );
            console.log(res);
        } catch (err) {
            console.log(err);
        }
        setTodoName('');
    };

    return (
        <React.Fragment>
            <input
                type="text"
                placeholder="Todo"
                onChange={inputChangeHandler}
                value={todoName}
            />
            <button type="button" onClick={todoAddHandler}>
                Add
            </button>
            <ul>
                {todoList.map(todo => (
                    <li key={todo.id}>{todo.name}</li>
                ))}
            </ul>
        </React.Fragment>
    );
};

export default Todo;
