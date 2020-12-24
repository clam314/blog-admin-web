import Mock from 'mockjs2'
import { builder, builderV2, getBody, getQueryParameters } from '../util'

const titles = [
  'Alipay',
  'Angular',
  'Ant Design',
  'Ant Design Pro',
  'Bootstrap',
  'React',
  'Vue',
  'Webpack'
]

const avatar = ['https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png',
  'https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png',
  'https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png',
  'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png',
  'https://gw.alipayobjects.com/zos/rmsportal/siCrBXXhmvTQGWPNLBow.png'
]

const covers = [
  'https://gw.alipayobjects.com/zos/rmsportal/uMfMFlvUuceEyPpotzlq.png',
  'https://gw.alipayobjects.com/zos/rmsportal/iZBVOIhGJiAnhplqjvZW.png',
  'https://gw.alipayobjects.com/zos/rmsportal/iXjVmWVHbCJAyqvDxdtx.png',
  'https://gw.alipayobjects.com/zos/rmsportal/gLaIAoVWTtLbBWZNYEMg.png'
]

const owner = [
  '付小小',
  '吴加好',
  '周星星',
  '林东东',
  '曲丽丽'
]

const content = '段落示意：蚂蚁金服设计平台 ant.design，用最小的工作量，无缝接入蚂蚁金服生态，提供跨越设计与开发的体验解决方案。蚂蚁金服设计平台 ant.design，用最小的工作量，无缝接入蚂蚁金服生态，提供跨越设计与开发的体验解决方案。'
const description = '在中台产品的研发过程中，会出现不同的设计规范和实现方式，但其中往往存在很多类似的页面和组件，这些类似的组件会被抽离成一套标准规范。'
const href = 'https://ant.design'

const descList = [
  description,
  content,
  href,
  'fafsafsafaaaaaaaawwwwfffffffffffff',
  'dwagwadfwad'
]

// eslint-disable-next-line no-unused-vars
const article = (options) => {
  const queryParameters = getQueryParameters(options)
  console.log('queryParameters', queryParameters)
  if (queryParameters && !queryParameters.count) {
    queryParameters.count = 5
  }
  const data = []
  for (let i = 0; i < queryParameters.count; i++) {
    const tmpKey = i + 1
    const num = parseInt(Math.random() * (4 + 1), 10)
    data.push({
      id: tmpKey,
      avatar: avatar[num],
      owner: owner[num],
      content: content,
      star: Mock.mock('@integer(1, 999)'),
      percent: Mock.mock('@integer(1, 999)'),
      like: Mock.mock('@integer(1, 999)'),
      message: Mock.mock('@integer(1, 999)'),
      // eslint-disable-next-line standard/computed-property-even-spacing
      description: descList[ i % 5],
      href: href,
      title: titles[ i % 8 ],
      updatedAt: Mock.mock('@datetime'),
      members: [
        {
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ZiESqWwCXBRQoaPONSJe.png',
          name: '曲丽丽',
          id: 'member1'
        },
        {
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/tBOxZPlITHqwlGjsJWaF.png',
          name: '王昭君',
          id: 'member2'
        },
        {
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/sBxjgqiuHMGRkIjqlQCd.png',
          name: '董娜娜',
          id: 'member3'
        }
      ],
      activeUser: Math.ceil(Math.random() * 100000) + 100000,
      newUser: Math.ceil(Math.random() * 1000) + 1000,
      cover: parseInt(i / 4, 10) % 2 === 0 ? covers[i % 4] : covers[3 - (i % 4)]
    })
  }
  return builder(data)
}

const articles = (options) => {
  const body = getBody(options)
  console.log('mock: body', body)
  let { pageNum, pageCount } = body
  if (!pageNum) {
    pageNum = 1
  }
  if (!pageCount) {
    pageCount = 20
  }
  const data = []
  for (let i = 0; i < pageCount; i++) {
    data.push({
      tid: Mock.mock('@id'),
      uid: Mock.mock('@id'),
      fid: Mock.mock('@id'),
      title: Mock.mock('@title'),
      description: Mock.mock('@cparagraph()'),
      des_image: null,
      content: Mock.mock('@paragraph()'),
      file_type: 'md',
      created: Mock.mock('@datetime'),
      updated: Mock.mock('@datetime'),
      published: Mock.mock('@integer(0, 1)'),
      role: Mock.mock('@integer(1, 99)'),
      reads: Mock.mock('@integer(1, 999)'),
      like: Mock.mock('@integer(1, 999)'),
      comments: Mock.mock('@integer(1, 999)'),
      converse: Mock.mock('@integer(0, 1)'),
      isTop: Mock.mock('@integer(0, 1)'),
      sort: Mock.mock('@integer(0, 3)'),
      tags: Mock.mock({ 'array|1-6': ['Hello', 'Mock.js', '!'] })
    })
  }
  const result = {
      pageNum: pageNum + 1,
      pageCount: pageCount,
      list: data
  }
  return builderV2(result, body.head.requestId)
}

const folders = (options) => {
  const body = getBody(options)
  console.log('mock: body', body)
  const count = Mock.mock('@integer(0, 50)')
  const data = []
  for (let i = 0; i < count; i++) {
    data.push({
      uid: Mock.mock('@id'),
      fid: Mock.mock('@id'),
      name: Mock.mock('@word()'),
      created: Mock.mock('@datetime'),
      updated: Mock.mock('@datetime'),
      status: Mock.mock('@integer(0, 1)')
    })
  }
  console.log('folders', data)
  return builderV2(data, body.head.requestId)
}

// Mock.mock(/\/list\/article/, 'get', article)

Mock.mock(/\/list\/articles/, 'post', articles)
Mock.mock(/\/list\/folders/, 'post', folders)
