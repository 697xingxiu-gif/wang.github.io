import { Worker, Order } from './types';

export const MOCK_WORKERS: Worker[] = [
  {
    id: 'w1',
    name: '王建国',
    avatar: 'https://picsum.photos/100/100?random=1',
    title: '金牌维修',
    tags: ['实名认证', '技能证书'],
    age: 42,
    experience: 12,
    rating: 4.9,
    price: 60,
    distance: '500m',
    productName: '极速上门维修',
    productTags: ['电路检修', '水管疏通', '五金更换'],
    unreadMessages: 2 // Has unread messages
  },
  {
    id: 'w2',
    name: '李秀英',
    avatar: 'https://picsum.photos/100/100?random=2',
    title: '五星保洁',
    tags: ['健康证', '无犯罪记录'],
    age: 38,
    experience: 8,
    rating: 4.9,
    price: 45,
    distance: '1.2km',
    productName: '全屋深度保洁',
    productTags: ['玻璃清洗', '高温杀毒', '除螨'],
    unreadMessages: 0
  },
  {
    id: 'w3',
    name: '张伟',
    avatar: 'https://picsum.photos/100/100?random=3',
    title: '专业跑腿',
    tags: ['退伍军人', '驾照A1'],
    age: 29,
    experience: 4,
    rating: 4.8,
    price: 30,
    distance: '300m',
    productName: '同城急送/代排队',
    productTags: ['1小时达', '全程冷链'],
    unreadMessages: 5
  }
];

export const MOCK_RECOMMENDED: Worker[] = [
  {
    id: 'r1',
    name: '赵淑芬',
    avatar: 'https://picsum.photos/100/100?random=20',
    title: '资深月嫂',
    tags: ['育婴师证', '耐心细致'],
    age: 45,
    experience: 15,
    rating: 4.7,
    price: 55,
    distance: '2.0km',
    unreadMessages: 1
  },
  {
    id: 'r2',
    name: '周杰',
    avatar: 'https://picsum.photos/100/100?random=21',
    title: '家电清洗',
    tags: ['拆机清洗', '原厂工具'],
    age: 33,
    experience: 6,
    rating: 4.6,
    price: 80,
    distance: '3.5km'
  }
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 'o1',
    clientName: '陈女士',
    clientAvatar: 'https://picsum.photos/100/100?random=10',
    serviceType: '家政保洁',
    summary: '家里大扫除，需要擦玻璃。大概3个小时工作量，需要带工具。',
    time: '今天下午 14:00',
    distance: '500m',
    address: '阳光花园 3期 5号楼 802',
    status: 'PENDING',
    unreadMessages: 3
  },
  {
    id: 'o2',
    clientName: '刘先生',
    clientAvatar: 'https://picsum.photos/100/100?random=11',
    serviceType: '水电维修',
    summary: '厨房水龙头漏水严重，需要更换阀芯。',
    time: '明天上午 09:00',
    distance: '1.5km',
    address: '幸福里小区 12栋 301',
    status: 'PENDING',
    unreadMessages: 0
  },
  {
    id: 'o3',
    clientName: '赵小姐',
    clientAvatar: 'https://picsum.photos/100/100?random=12',
    serviceType: '代取快递',
    summary: '有三个大件包裹需要帮忙搬上楼，没有电梯。',
    time: '今天 18:00',
    distance: '800m',
    address: '学府路 108号 2单元',
    status: 'PENDING'
  },
  {
    id: 'o4',
    clientName: '周奶奶',
    clientAvatar: 'https://picsum.photos/100/100?random=13',
    serviceType: '帮忙遛狗',
    summary: '金毛犬，需要遛半小时，就在小区公园。',
    time: '今天 20:00',
    distance: '200m',
    address: '阳光花园 1期 别墅区 6号',
    status: 'MATCHED',
    unreadMessages: 1
  }
];

export const TIME_OPTIONS = [
  '今天上午', '今天下午', '明天上午', '明天下午', '1月17日 周六'
];

export const CATEGORIES = ['家政保洁', '家庭维修', '跑腿代办', '宠物服务', '搬家拉货'];