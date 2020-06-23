import Layout from '@/layout'

const projectManageRouter = {
  path: '/projectmanage',
  component: Layout,
  redirect: 'noRedirect',
  name: 'projectmanage',
  meta: {
    title: '项目管理',
    icon: 'list'
  },
  children: [
    {
      path: 'pdemo',
      component: () => import('@/views/components-demo/drag-kanban'),
      name: 'pdemo',
      meta: { title: '项目一' }
    }
  ]
}

export function projectmanage(arr) {
  if (arr.length > 0) {
    arr.forEach((item, index) => {
      projectManageRouter.children.push({
        path: 'p' + index,
        component: () => import('@/views/projectmanage/index'),
        name: item,
        meta: { title: item }
      })
    })
  }
  return [projectManageRouter]
}
