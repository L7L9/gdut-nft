// import React from 'react'
import { PlusOutlined } from '@ant-design/icons';
import { Modal, Upload } from 'antd';
import React, { Component,useState } from 'react';

export default class Notify extends Component {
  render() {
    return (
      <div>Notify</div>
    )
  }
}

// const getBase64 = (file) =>
//   new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = () => resolve(reader.result);
//     reader.onerror = (error) => reject(error);
//   });
// const Notify = () => {
//   const [previewOpen, setPreviewOpen] = useState(false);
//   const [previewImage, setPreviewImage] = useState('');
//   const [previewTitle, setPreviewTitle] = useState('');
//   const [fileList, setFileList] = useState([
    
//   ]);
//   const handleCancel = () => setPreviewOpen(false);
//   const handlePreview = async (file) => {
//     if (!file.url && !file.preview) {
//       file.preview = await getBase64(file.originFileObj);
//     }
//     setPreviewImage(file.url || file.preview);
//     setPreviewOpen(true);
//     setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
//   };
//   const handleChange = ({ fileList: newFileList }) => {
//     console.log(newFileList);
//     // newFileList[0].status="done"
//     setFileList(newFileList)
//   };
  
//   const uploadButton = (
//     <div>
//       <PlusOutlined />
//       <div
//         style={{
//           marginTop: 8,
//         }}
//       >
//         Upload
//       </div>
//     </div>
//   );
//   return (
//     <>
//       <Upload
//         // action="/GDUT-nft/notify"
//         listType="picture-card"
//         fileList={fileList}
//         onPreview={handlePreview}
//         onChange={handleChange}
//         // headers={null}
//         style={{border:'1px solid green'}}
//       >
//         {fileList.length >= 1 ? null : uploadButton}
//       </Upload>
//       <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
//         <img
//           alt="example"
//           style={{
//             width: '100%',
//           }}
//           src={previewImage}
//         />
//       </Modal>
//     </>
//   );
// };