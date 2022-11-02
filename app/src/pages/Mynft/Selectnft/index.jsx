// import React, { Component } from 'react'


// export default class Selectnft extends Component {
//     preview = () => pageModel.preview()
//     render() {
//     return (
//         <div>     
//             <div style={{textAlign:'center',width:'600px'}}>
//                 <div style={{ marginRight: '150px' }}>
//                 <div><img id="nftShower" style={{ width: '150px', height: '150px',marginLeft:'-160px' }}/></div>
//                 <p style={{marginTop:'8px',marginLeft:'-160px'}}>上传一张图片，获得一份独一无二的nft</p>
//                 <input type="file" id="nft" onChange={this.preview} />
//                 </div>
//             </div>
//         </div>
//     )
//     }
// }
import { Upload, message,Modal } from 'antd';
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
const Selectnft = () => {
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
  const handleChange = ({ fileList: newFileList,file }) => {
    if (file.status === 'removed') {
      setFileList([]);
      PubSub.publish("nftfile",1)
    }
    else {
      newFileList[0].status = 'uploading'
      setTimeout(() => {
        newFileList[0].status = 'done'
        setFileList(newFileList);
        message.success('上传成功',.5)
      }, 500)
      PubSub.publish("nftfile", newFileList[0].originFileObj)
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
      <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
        <img
          alt="example"
          style={{
            width: '100%',
          }}
          src={previewImage}
        />
      </Modal>
    </>
    
  );
};
export default Selectnft;