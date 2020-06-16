/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const corexProjectManageRouter = {
  path: '/projectmanage',
  component: Layout,
  redirect: '/projectmanage/project1',
  name: 'projectmanage',
  meta: {
    title: '项目管理',
    icon: 'table'
  },
  children: [
    {
      path: 'project1',
      component: () => import('@/views/corex-projectmanage/index'),
      name: 'DynamicTable',
      meta: { title: '项目一' }
    },
    {
      path: 'project2',
      component: () => import('@/views/corex-projectmanage/index'),
      name: 'DragTable',
      meta: { title: '项目二' }
    }
  ]
}
export default corexProjectManageRouter
