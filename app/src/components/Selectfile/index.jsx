import { Upload, message,Modal,Image } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import PubSub from 'pubsub-js';
import React, { useState } from 'react';



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
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState([]);
  const handleCancel = () => setPreviewOpen(false);
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    setTimeout(() => {
      document.querySelector('.ant-image').click()
    },20)
  };
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );
  const handleChange = ({ fileList: newFileList, file }) => {
    const {type}=props
    if (file.status === 'removed') {
      setFileList([]);
      type === 'foundry' ? PubSub.publish("nftfile", 1) :
      type==='create'?PubSub.publish("activityfile",1):null
    }
    else {
      newFileList[0].status = 'uploading'
      setTimeout(() => {
        newFileList[0].status = 'done'
        setFileList(newFileList);
        message.success('上传成功',.5)
      }, 500)
      type === 'foundry' ? PubSub.publish("nftfile", newFileList[0].originFileObj) :
      type==='create'?PubSub.publish("activityfile",newFileList[0].originFileObj):null
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
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        beforeUpload={beforeUpload}
      >
        {fileList.length >= 1 ? null : uploadButton}
      </Upload>
      <Image
        src={previewImage}
        style={{display:'none'}}
      />
      {/* <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
        <img
          alt="example"
          style={{
            width: '100%',
          }}
          src={previewImage}
        />
      </Modal> */}
    </>
    
  );
};
export default Selectnft;