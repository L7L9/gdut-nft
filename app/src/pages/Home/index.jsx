import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { connect } from 'react-redux'
import { Carousel, Typography, Col, Row, Image, Layout, Statistic, Card, Button } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import Loading from '@/components/Loading';
import { getmainColor } from '@/utils/getmainColor';
import { Setdata } from '@/redux/actions/data'
import { markID } from '@/utils/globalType';
const { Title, Paragraph } = Typography;
const { Sider, Content,Footer } = Layout;
import './index.css'

class Home extends Component {
    state = {
        contentStyle: {
            height: '750px',
            color: '#fff',
            lineHeight: '750px',
            textAlign: 'center',
            // background: '#364d79'
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundImage:''
        },
        homesellnft: [],
        loading:true
    }

    componentDidMount() {
        const {alldata,updatedata}=this.props
        pageModel.showHomePageSellNFT().then(res => {
            let homesellnft = []
            res.map(item => {
                homesellnft.push(item)
            })
            this.setState({ homesellnft, loading: false })
            updatedata({...alldata,currentdata:res})
        })
    }
    render() {
        const {loading,homesellnft}=this.state
        return (
            loading?<Loading/>:<div>
                <div className='images'>
                <Carousel autoplaySpeed={2000}  effect='fade' autoplay>
                    {homesellnft.map((item,index) => {
                        return <div key={index}>
                            <Layout style={{height:'750px',backgroundColor:'#f8fbff'}}>
                                <Content style={{ borderRadius: '15px',backgroundColor:'#f8fbff'}} width={850}>
                                    <Image src={item.url} style={{ height:'750px',objectFit: 'cover',borderRadius:'15px' }} width={850} onClick={()=>getmainColor(item.url)} />
                                </Content>
                                <Sider style={{ position:'relative',marginLeft: '50px', backgroundColor:'#f8fbff' }} width={400}>
                                    <Title level={1} className="title">{item.nftName}</Title>
                                    <Statistic title="创作者" value={item.authorName} style={{ marginTop: '50px', paddingLeft: '30px' }} />
                                    <Card style={{marginTop:'20px',borderRadius:'5px'}}>
                                        <Title level={5}>寄售价格</Title>
                                        <span style={{fontSize:'40px'}}>￥{item.price}</span>
                                        <Title level={5} style={{marginTop:'10px'}}>商品描述</Title>
                                        <span style={{ color: '#959599' }}>{item.nftDes}</span>
                                    </Card>
                                    <Link to='/GDUT-nft/news/detail' state={{ ...item,index,markID:markID.allnft }} style={{position:'absolute',bottom: '80px',zIndex:'99',width:'100%'}} ref='link'>
                                        <Button type="primary" block style={{ height: '50px', borderRadius: '8px' }} icon={<ArrowRightOutlined />} >前往购买</Button>
                                    </Link>
                                </Sider> 
                            </Layout>
                            
                        </div>
                    })}
                </Carousel>
                </div>
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


export default connect(
    state => ({alldata:state.data}),
    {
        updatedata: Setdata,
    }
)(Home)

