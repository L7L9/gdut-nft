import React, { Component,Suspense,lazy } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom'
const BaseLayout=lazy(()=>import ('@/components/BaseLayout'))
const Login=lazy(()=>import ('@/components/Login'))
const Register=lazy(()=>import ('@/components/Register'))
// import 'antd/dist/antd.less';

class App extends Component {
  render() {
    return (
      <div>
        <Suspense>
          <Routes>
            <Route path="/GDUT-nft/*" element={<BaseLayout />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Navigate to={"/login"} />} />
          </Routes>
        </Suspense>
      </div>
    );
  }
}

export default App;