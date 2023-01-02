import React, { Component } from 'react'
import { Carousel, Typography,Col, Row } from 'antd';
const { Title,Paragraph } = Typography;
import './index.css'
const contentStyle = {
    height: '400px',
    color: '#fff',
    lineHeight: '350px',
    textAlign: 'center',
    background: '#364d79',
};

export default class Home extends Component {
    render() {
        return (
            <div>
                <Carousel autoplay style={{marginTop:'-50px',marginLeft:'-50px',height:'400px',width:'110%'}}>
                    <div>
                    <h3 style={contentStyle}>1</h3>
                    </div>
                    <div>
                    <h3 style={contentStyle}>2</h3>
                    </div>
                    <div>
                    <h3 style={contentStyle}>3</h3>
                    </div>
                    <div>
                    <h3 style={contentStyle}>4</h3>
                    </div>
                </Carousel>
                <Title level={2} className="title">什么是数字藏品</Title>
                <Row style={{marginTop:'40px'}}>
                    <Col span={8} className='intro'>
                        <Title level={4}>唯一性</Title>
                        <Paragraph>
                        每个数字藏品都是独一无二的，且具有不同属性，这些属性通常存储在元数据中，且铸造后不可篡改。
                        </Paragraph>
                    </Col>
                    <Col span={8} className='intro'>
                        <Title level={4}>可证明的稀缺性</Title>
                        <Paragraph>
                        数字藏品铸造数量可通过公共区块链网络验证，数量固定，永恒不变，具有可证明性。
                        </Paragraph>
                    </Col>
                    <Col span={8} className='intro'>
                        <Title level={4}>不可分割性</Title>
                        <Paragraph>
                        每个数字藏品都是一个独立的个体，无法拆分，因此不能购买或寄售数字藏品的一部分，因此具有不可分割性。
                        </Paragraph>
                    </Col>
                </Row>
                <Title level={2} className="title">这个项目是什么</Title>
                <Paragraph>
                这是一个基于区块链技术的数字藏品应用，用户可以上传图片来铸造数字藏品作为纪念凭证、链上资产，也可以上传图片作为活动标识并创建活动供他人领取，成为活动参与证明。得益于区块链技术，这些数字藏品具有唯一性、可证明的稀缺性、不可分割性，为用户的数字藏品价值提供了技术保障。初步计划在校园内推广,期望师生们通过此应用来记录自己的校园生活。
                </Paragraph>
            </div>
        )
    }
}

