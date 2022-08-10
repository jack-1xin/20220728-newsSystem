// 撰写新闻的模块
import React, { useEffect, useRef, useState } from 'react'
import { PageHeader, Steps, Button, Form, Input, Select, message, notification } from 'antd'
import NewsEditor from '../../../components/news-manage/NewsEditor'
import style from './News.module.css'
import axios from 'axios'
const { Step } = Steps
export default function NewsAdd (props) {
  console.log(props);
  // 步骤条状态控制
  const [current, setCurrent] = useState(0)
  // 新闻分类的列表
  const [categories, setCategories] = useState([])
  // 保存表单的信息
  const [newsInfo, setNewsInfo] = useState({})
  // 获取编辑的内容信息
  const [content, setContent] = useState("")
  // 校验表单
  const NewsForm = useRef(null)
  const { username, region, roleId } = JSON.parse(localStorage.getItem('token'))
  //获取新闻分类列表
  useEffect(() => {
    axios.get(`/categories`).then(res => {
      console.log(res.data);
      setCategories(res.data)
    })
  }, [])
  // 步骤条的信息
  const steps = [
    {
      title: '基本信息',
      description: '新闻标题,新闻分类'
    },
    {
      title: '新闻内容',
      description: '新闻主体内容'
    },
    {
      title: '新闻提交',
      description: '保存草稿或者提交审核'
    },
  ]

  // 点击进入下一步
  const handleNext = () => {
    // 判断是不是在第一步
    if (current === 0) {
      NewsForm.current.validateFields().then(value => {
        console.log(value);
        setNewsInfo(value)
        setCurrent(current + 1)
      }).catch(err => {
        console.log(err);
      })
    } else {
      if (content === "" || content.trim() === '<p></p>') {
        message.error('新闻内容不能为空')
      } else {
        console.log(newsInfo, content);
        setCurrent(current + 1)
      }
    }
  }

  // 点击返回上一步
  const handlePrevious = () => {
    setCurrent(current - 1)
  }

  //点击保存到草稿箱和提交审核按钮的回调
  const handleSave = (auditState) => {
    axios.post('/news', {
      ...newsInfo,
      content: content,
      region: region === '' ? '全球' : region,
      author: username,
      roleId: roleId,
      auditState: auditState,
      publishState: 0,
      createTime: Date.now(),
      star: 0,
      view: 0
    }).then(res => {
      // 将路由跳转至相应路径, 前提是要判传参为0还是为1
      props.history.push(auditState === 0 ? '/news-manage/draft' : '/audit-manage/list')

      notification.info({
        message: `通知`,
        description:
          `您可以到${auditState === 0 ? '草稿箱' : '审核列表'}中查看您的新闻`,
        placement: 'bottomRight',
      });
    })
  }
  return (
    <div>
      {/* 标题部分 */}
      <PageHeader title="撰写新闻" />
      {/* 步骤条部分 */}
      <Steps current={current}>
        {steps.map((item) => (
          <Step key={item.title} title={item.title} description={item.description} />
        ))}
      </Steps>
      {/* 操作内容部分 */}
      <div style={{ marginTop: '20px' }}>
        <div className={current === 0 ? '' : style.active}>
          <Form ref={NewsForm}>
            <Form.Item
              label="新闻标题"
              name="title"
              rules={[{ required: true, message: '请输入新闻标题!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="新闻分类"
              name="categoryId"
              rules={[{ required: true, message: '请选择新闻分类!' }]}
            >
              <Select>
                {
                  categories.map(item => <Select.Option key={item.id} value={item.id}>{item.title}</Select.Option>)
                }

              </Select>
            </Form.Item>
          </Form>
        </div>
        <div className={current === 1 ? '' : style.active}>
          <NewsEditor getContent={(value) => {
            setContent(value);
          }}></NewsEditor>
        </div>
        <div className={current === 2 ? '' : style.active}></div>
      </div>
      {/* 按钮部分 */}
      <div style={{ marginTop: '50px' }}>
        {
          current === 2 && <span>
            <Button type='primary' onClick={() => handleSave(0)}>保存草稿箱</Button>
            <Button type='danger' onClick={() => handleSave(1)}>提交审核</Button>
          </span>
        }
        {current < 2 && <Button type='primary' onClick={handleNext}>下一步</Button>}
        {current > 0 && <Button onClick={handlePrevious}>上一步</Button>}
      </div>
    </div>
  )
}
