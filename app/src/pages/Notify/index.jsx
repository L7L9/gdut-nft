import { List,Card,message} from 'antd';
import React, { useState } from 'react';
import { useEffect } from 'react';
import Loading from '@/components/Loading'


const Notify = () => {
  const [loading, setLoading] = useState(true);
  const [listData, setlistData] = useState([]);
  useEffect(() => {
    noticeModel.getNotice().then((res) => {
      setlistData(res.map(item => ({
        title:item.title ,
        description: `${item.user}/${item.id}`,
        content:item.des
      })))
      setLoading(false);
      if (res.length > 0) message.success(`${res.length}条公告已加载出来`)
      else message.info("暂无公告")
    })
  },[])
  return (
    <>
      {loading?<Loading/>:<List
        itemLayout="vertical"
        size="large"
        dataSource={listData}
        renderItem={(item) => (
          <List.Item
            key={item.title}
          >
            <Card hoverable>
              <List.Item.Meta
                title={item.title}
                description={item.description}
              />
              {item.content}
            </Card>
          </List.Item>
        )}
      />}
    </>
  );
};
export default Notify;