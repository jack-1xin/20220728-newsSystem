import React, { useEffect, useRef, useState } from 'react'
import { Row, Col, Card, Avatar, List, Drawer } from 'antd'
import { EditOutlined, EllipsisOutlined, PieChartOutlined } from '@ant-design/icons';
import axios from 'axios';
import { Link } from 'react-router-dom';
import * as echarts from 'echarts'
import _ from 'lodash'
const { Meta } = Card;
export default function Home () {
  // 控制抽屉的显示隐藏状态
  const [visible, setVisible] = useState(false);
  // 存储用户最常浏览的数据集合
  const [viewList, setViewList] = useState([])
  // 存储用户点赞最多的数据集合
  const [starList, setStarList] = useState([])
  // 当前用户的数据
  const { username, region, role: { roleName } } = JSON.parse(localStorage.getItem('token'))
  // 图像化数据集合
  const [allList, setAllList] = useState([])
  const [pieChart, setPieChart] = useState(null)
  // 柱状图的ref
  const barRef = useRef()
  // 饼状图的ref
  const pieRef = useRef()
  // 获取用户最常浏览的数据列表前6条数据
  useEffect(() => {
    axios.get(`/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6`).then(res => {
      setViewList(res.data);
    })
  }, [])
  // 获取用户点赞数最多的数据列表前6条数据
  useEffect(() => {
    axios.get(`/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=6`).then(res => {
      setStarList(res.data);
    })
  }, [])
  // 获取图像化数据
  useEffect(() => {
    axios.get(`/news?publishState=2&_expand=category`).then(res => {
      renderBarView(_.groupBy(res.data, item => item.category.title));
      setAllList(res.data)
    })
    return () => {
      window.onresize = null
    }
  }, [])
  // 初始化柱状图
  const renderBarView = (obj) => {
    var myChart = echarts.init(barRef.current)
    const option = {
      title: {
        text: '新闻分类图示'
      },
      tooltip: {},
      legend: {
        data: ['数量']
      },
      xAxis: {
        data: Object.keys(obj),
        axisLabel: {
          rotate: "45"
        }
      },
      yAxis: {
        minInterval: 1 // 保证坐标轴分割刻度显示成整数
      },
      series: [
        {
          name: '数量',
          type: 'bar',
          data: Object.values(obj).map(item => item.length),// 把数组映射成长度
        }
      ]
    }
    myChart.setOption(option)

    window.onresize = () => {
      // console.log('resize');
      myChart.resize()
    }
  }
  // 初始化饼状图
  const renderPieView = (obj) => {
    // 基于准备好的dom，初始化echarts实例
    var myChart1;
    var option;
    // 获取数据
    let currentList = allList.filter(item => item.author === username)
    let groupObj = _.groupBy(currentList, item => item.category.title)
    let list = []
    for (let i in groupObj) {
      list.push({
        name: i,
        value: groupObj[i].length
      })
    }
    console.log(list);
    // 判断图表是否已经初始化完成
    if (!pieChart) {
      myChart1 = echarts.init(pieRef.current)
      setPieChart(myChart1)
    } else {
      myChart1 = pieChart
    }

    option = {
      title: {
        text: '当前用户新闻分类图示',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: '发布数量',
          type: 'pie',
          radius: '50%',
          data: list,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };

    option && myChart1.setOption(option);

    window.onresize = () => {
      myChart1.resize()
    }
  }
  // 显示抽屉的回调
  const showDrawer = () => {
    setTimeout(() => {
      setVisible(true);
      // init初始化
      renderPieView()
    }, 0)

  };
  return (
    <div className="site-card-wrapper">
      <Row gutter={16}>
        <Col span={8}>
          <Card title="用户最常浏览" bordered={true} >
            <List
              size="small"
              dataSource={viewList}
              renderItem={(item) => <List.Item><Link to={`/news-manage/preview/${item.id}`}>{item.title}</Link></List.Item>}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="用户点赞最多" bordered={true} >
            <List
              size="small"
              dataSource={starList}
              renderItem={(item) => <List.Item><Link to={`/news-manage/preview/${item.id}`}>{item.title}</Link></List.Item>}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            style={{ height: '340px' }}
            bordered
            cover={
              <img
                alt="example"
                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
              />
            }
            actions={[
              <PieChartOutlined key="setting" onClick={showDrawer} />,
              <EditOutlined key="edit" />,
              <EllipsisOutlined key="ellipsis" />,
            ]}
          >
            <Meta
              avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
              title={username}
              description={<div><b>{region ? region : '全球'}</b> <span style={{ paddingLeft: '30px' }}>{roleName}</span></div>}
            />
          </Card>
        </Col>
      </Row>
      <Drawer
        width='500px'
        title="个人新闻分类"
        placement="right"
        closable
        onClose={() => {
          setVisible(false);
        }}
        visible={visible}>
        <div ref={pieRef} style={{ height: "400px", width: "100%", marginTop: "30px" }}></div>
      </Drawer>
      <div ref={barRef} style={{ height: "400px", width: "100%", marginTop: "30px" }}></div>
    </div>
  )
}
