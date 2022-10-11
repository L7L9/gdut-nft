import { Image } from 'antd';
import React, { useState } from 'react';

const Nft = () => {
    const [visible, setVisible] = useState(false);
    return (
    <>
        <Image
        preview={{
            visible: false,
        }}
        width={300}
        height={300}
        src="https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp"
        onClick={() => setVisible(true)}
        />
        <div
        style={{
            display: "none",
        }}
        >
        <Image.PreviewGroup
            preview={{
            visible,
            onVisibleChange: (vis) => setVisible(vis),
            }}
        >
        <Image src="https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp" />
        </Image.PreviewGroup>
        </div>
        <h3 style={{ textAlign: "center" }}>名字：</h3>
        <h3 style={{ textAlign: "center" }}>作者：</h3>
    </>
    );
};


export default Nft