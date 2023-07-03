import React from 'react';
import axios from 'axios';

const Login = () => {
    function testSessionLogin(){
        axios.get('/api/sss')
        .then((res)=>{
            console.log(res);
        })
    }
    function testJwtLogin(){
        axios.get('/api/ttt',{headers:{authorization: '1111'}})
        .then((res)=>{
            console.log(res);
        })
    }
    // React.useEffect(()=>{
    //     // testSessionLogin()
    //     testJwtLogin()
    // },[])
    return (
        <div className="Login">
            LoginLoginLoginLoginLoginLoginLogin
        </div>
    );
};

export default Login;
