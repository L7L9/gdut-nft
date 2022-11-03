import { List,Card,message} from 'antd';
import React, { useState } from 'react';
import { useEffect } from 'react';
import Loading from '@/components/Loading'
const listData1 = Array.from({
  length: 3,
}).map((_, i) => ({
  href: 'https://ant.design',
  title: `ant design part ${i}`,
  description:
    'Ant Design, a design language for background applications, is refined by Ant UED Team.',
  content:
    'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
}));

const Notify = () => {
  const [loading, setLoading] = useState(true);
  const [listData, setlistData] = useState([]);
  useEffect(() => {
    setTimeout(() => {
      setlistData(listData1)
      setLoading(false);
      message.success(`${listData1.length}条公告已加载出来`)
    },2000)
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