/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const corexUsertManageRouter = {
  path: '/usermanage',
  component: Layout,
  redirect: '/usermanage/list',
  name: 'Table',
  meta: {
    title: '用户管理',
    icon: 'table'
  },
  children: [
    {
      path: 'list',
      component: () => import('@/views/corex-usermanage/index'),
      name: 'DynamicTable',
      meta: { title: '用户列表' }
    },
    {
      path: 'role',
      component: () => import('@/views/corex-usermanage/index'),
      name: 'DragTable',
      meta: { title: '角色权限' }
    }
  ]
}
export default corexUsertManageRouter
