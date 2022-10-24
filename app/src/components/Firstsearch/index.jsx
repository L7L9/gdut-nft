import { CalendarTwoTone } from '@ant-design/icons';
import { Button, Result } from 'antd';
import React from 'react';
const Firstsearch = () => (
    <Result
        icon={<CalendarTwoTone twoToneColor="#00a9fb" style={{marginBottom:'30px'}}/>}
        title="请输入你的搜索内容   !"
        // extra={<Button type="primary">Next</Button>}
    />
);
export default Firstsearch;