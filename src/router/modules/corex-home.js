/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const corexHomeRouter = {
  path: '/home',
  component: Layout,
  redirect: '/home',
  children: [
    {
      path: 'home',
      component: () => import('@/views/corex-home/index'),
      name: '主页',
      meta: { title: '主页', icon: 'dashboard', affix: true }
    }
  ]
}
export default corexHomeRouter
