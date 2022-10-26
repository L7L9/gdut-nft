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
import { Upload, message, Button } from 'antd';
import PubSub from 'pubsub-js';
import ImgCrop from 'antd-img-crop';
import React, { useState } from 'react';
const Selectnft = () => {
  const [fileList, setFileList] = useState([]);
  const onChange = ({ fileList: newFileList,file }) => {
    if (file.status === 'removed') {
      setFileList([]);
      PubSub.publish("nftfile", fileList)
    }
    else {
      newFileList[0].status = 'uploading'
      setTimeout(() => {
        newFileList[0].status = 'done'
        setFileList(newFileList);
        message.success('上传成功',.5)
      }, 1000)
      PubSub.publish("nftfile", newFileList[0].originFileObj)
    }
    // PubSub.publish("nftfile", window.URL.createObjectURL(new Blob(newFileList)))
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
  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };
  return (
    <ImgCrop rotate>
      <Upload
        // action="http://localhost:8081"
        listType="picture-card"
        fileList={fileList}
        onChange={onChange}
        onPreview={onPreview}
        beforeUpload={beforeUpload}
      >
      {fileList.length < 1 && '+ Upload'}
      </Upload>
    </ImgCrop>
    
  );
};
export default Selectnft;