import { Upload, message,Image,Spin } from 'antd';
import { PlusOutlined,InboxOutlined   } from '@ant-design/icons';
import PubSub from 'pubsub-js';
import React, { useState } from 'react';
import { getmainColor } from '@/utils/getmainColor';


const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
const Selectnft = (props) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState([]);
  const handleCancel = () => setPreviewOpen(false);
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    getmainColor(file.preview)
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setTimeout(() => {
      document.querySelector('.ant-image').click()
    },20)
  };
  const uploadButton = (
    <div>
      {props.type === 'foundry' ?<InboxOutlined  style={{ color: '#4f98fe', fontSize:'40px'}}/>:<PlusOutlined/>}
      <div
        style={{
          marginTop: 8,
        }}
      >
        {props.type === 'foundry' ?
          <div>
            <p style={{fontSize:'20px',fontWeight:'600'}}>点击上传一张图片</p>
            <p style={{marginTop:'6px'}}>上传一张图片，获得一份独一无二的nft</p>
          </div> :
          '上传'}
      </div>
    </div>
  );
  const handleChange = ({ fileList: newFileList, file }) => {
    const { type } = props
    if (file.status === 'removed') {
      setFileList([]);
      type === 'foundry' ? PubSub.publish("nftfile", 1) :
      type==='create'?PubSub.publish("activityfile",1):null
    }else {
      newFileList[0].status = 'done'
      if (fileList.length === 0) {
        setFileList(newFileList)
        setTimeout(async() => {
          if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
            message.success('上传成功', .5)
            setPreviewImage(file.url || file.preview);
            let image=document.querySelector('.ant-upload-list-item-image')
            image.src = file.preview
          }
        }, 200)
        type === 'foundry' ? PubSub.publish("nftfile", newFileList[0].originFileObj) :
        type==='create'?PubSub.publish("activityfile",newFileList[0].originFileObj):null
      }
    }
  };
  const beforeUpload = (file) => {
    return new Promise((resolve, reject) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        message.error('请上传 JPG/PNG 格式图片!');
        return reject(false);
      }
      return resolve(true);
    })
  }
  
  return ( 
    <>
      <Upload
        listType='picture-card'
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        beforeUpload={beforeUpload}
      >
        {fileList.length >= 1 ?null : uploadButton}
        </Upload>
      <Image
        src={previewImage}
        style={{display:'none'}}
      />
      
    </>
    
  );
};
export default Selectnft;