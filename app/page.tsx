'use client'

import {useEffect, useMemo, useState} from 'react';

const CreateForm = (props) => {
    const selectedUser = useMemo(() => props.user, [props]);
    const [newUserLogin, setNewUserLogin] = useState('')
    const [newUserUrl, setNewUserUrl] = useState('')
    
    const handleUserLoginChange = (value) => {
        setNewUserLogin(value)
    }
    
    const handleUserUrlChange = (value) => {
        setNewUserUrl(value)
    }
    
    const saveNewUser = () => {
        const newObj = {
            id: props.data.length + 1,
            login: newUserLogin, url: newUserUrl
        }
        const newArr = [...props.data, newObj]
        props.setData(newArr)
        props.setCreateNewUser(false)
    }
    
    return (
        <div>
            <h4>Login:</h4>
            <input style={{marginRight: '10px'}} onChange={(e) => handleUserLoginChange(e.target.value)} type="text"
                   value={newUserLogin}></input>
            <h4>Url:</h4>
            <input style={{marginRight: '10px'}} onChange={(e) => handleUserUrlChange(e.target.value)} type="text"
                   value={newUserUrl}></input>
            <button onClick={() => saveNewUser()}>Save</button>
        </div>
    )
}

const EditForm = (props) => {
    const selectedUser = useMemo(() => props.user, [props]);
    const [selectedUserLogin, setSelectedUserLogin] = useState(null)
    const [selectedUserUrl, setSelectedUserUrl] = useState(null)
    
    useEffect(() => {
        setSelectedUserLogin(selectedUser.login)
        setSelectedUserUrl(selectedUser.url)
    }, [selectedUser]);
    
    const handleUserLoginChange = (value) => {
        setSelectedUserLogin(value)
    }
    
    const handleUserUrlChange = (value) => {
        setSelectedUserUrl(value)
    }
    
    const handleEditSave = () => {
        const updatedArr = props.data.map(a => {
            const returnValue = {...a};
            
            if (a.id == selectedUser.id) {
                returnValue.login = selectedUserLogin;
                returnValue.url = selectedUserUrl;
            }
            
            return returnValue
        })
        
        props.setData(updatedArr);
        props.setSelectedUser(null)
    }
    
    return (
        <div>
            <input style={{marginRight: '10px'}} onChange={(e) => handleUserLoginChange(e.target.value)} type="text"
                   value={selectedUserLogin}></input>
            <input style={{marginRight: '10px'}} onChange={(e) => handleUserUrlChange(e.target.value)} type="text"
                   value={selectedUserUrl}></input>
            <button onClick={() => handleEditSave()}>Save</button>
        </div>
    )
}

export default function Home() {
    const [data, setData] = useState([])
    const [selectedUser, setSelectedUser] = useState(null)
    const [createNewUser, setCreateNewUser] = useState(false)
    
    useEffect(() => getData(), [])
    const getData = async () => {
        const res = await fetch('https://api.github.com/users');
        const jsonData = await res.json();
        setData(jsonData);
    }
    
    const handleUserClick = (user) => {
        setSelectedUser(user);
    }
    
    const handleCreateNewUser = () => {
        setCreateNewUser(true);
    }
    
    return (
        <div>
            <div style={{float: 'left', width: '50%'}}>
                <ul>
                    {data.map((el) => {
                        return (
                            <li key={el.id}>
                                <span style={{marginRight: '10px'}}>{el.login}</span>
                                <a href={el.url}>
                                    <span style={{marginRight: '10px'}}>{el.url}</span>
                                </a>
                                <span style={{marginRight: '10px'}}>{Math.floor(Math.random() * 16) + 18}</span>
                                <button onClick={() => handleUserClick(el)}>Edit</button>
                            </li>
                        )
                    })
                    }
                </ul>
                <button onClick={() => handleCreateNewUser()}>Add</button>
                {createNewUser ?
                    <CreateForm data={data} setData={setData} setCreateNewUser={setCreateNewUser} set/> : null}
            </div>
            <div style={{float: 'left', width: '50%'}}>
                {selectedUser ? <EditForm user={selectedUser}
                                          setSelectedUser={setSelectedUser}
                                          data={data}
                                          setData={setData}/> : null}
            </div>
        
        </div>
    
    )
}
