import React, { useState, useEffect, useReducer, useRef, useMemo } from 'react';
import axios from 'axios';
import List from './List';

const Todo = props => {
    const [inputIsValid, setInputIsValid] = useState(false);

    // const [todoName, setTodoName] = useState('');
    // const [todoList, setTodoList] = useState([]);
    const todoInputRef = useRef();

    const todoListReducer = (state, action) => {
        switch (action.type) {
            case 'ADD':
                return state.concat(action.payload);
            case 'SET':
                return action.payload;
            case 'REMOVE':
                return state.filter(todo => todo.id !== action.payload);
            default:
                return state;
        }
    };

    const [todoList, dispatch] = useReducer(todoListReducer, []);

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
                dispatch({ type: 'SET', payload: todos });
            });

        return () => {
            console.log('Cleanup');
        };
    }, []);

    const mouseMoveHandler = event => {
        console.log(event.clientX, event.clientY);
    };

    const inputValidationHandler = event => {
        if (event.target.value.trim() === '') {
            setInputIsValid(false);
        } else {
            setInputIsValid(true);
        }
    };

    // useEffect(() => {
    //     document.addEventListener('mousemove', mouseMoveHandler);
    //     return () => {
    //         document.removeEventListener('mousemove', mouseMoveHandler);
    //     };
    // }, []);

    // const inputChangeHandler = event => {
    //     setTodoName(event.target.value);
    // };

    const todoAddHandler = async () => {
        const todoName = todoInputRef.current.value;
        try {
            const res = await axios.post(
                'https://react-hooks-95d0d.firebaseio.com/todos.json',
                { name: todoName }
            );
            setTimeout(() => {
                console.log(res);
                const todoItem = { id: res.data.name, name: todoName };
                dispatch({ type: 'ADD', payload: todoItem });
            }, 3000);
        } catch (err) {
            console.log(err);
        }
        // setTodoName('');
    };

    const todoRemoveHandler = async todoId => {
        try {
            await axios.delete(
                `https://react-hooks-95d0d.firebaseio.com/todos/${todoId}.json`
            );
            dispatch({ type: 'REMOVE', payload: todoId });
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <React.Fragment>
            <input
                type="text"
                placeholder="Todo"
                ref={todoInputRef}
                onChange={inputValidationHandler}
                style={{
                    backgroundColor: inputIsValid ? 'transparent' : 'red'
                }}
            />
            <button type="button" onClick={todoAddHandler}>
                Add
            </button>
            {useMemo(
                () => (
                    <List items={todoList} onClick={todoRemoveHandler} />
                ),
                [todoList]
            )}
        </React.Fragment>
    );
};

export default Todo;
