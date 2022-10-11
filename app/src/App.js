import React, { Component } from 'react';
import { Route,Routes, Navigate } from 'react-router-dom'
import BaseLayout from "@/components/BaseLayout"
import Login from "@/components/Login"
import Register from "@/components/Register"
import 'antd/dist/antd.less';

class App extends Component {
  render() {
    return (
      <div>
        <Routes>
          <Route path="/GDUT-nft/*" element={<BaseLayout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Navigate to={"/login"} />} />
        </Routes>
      </div>
    );
  }
}

export default App;