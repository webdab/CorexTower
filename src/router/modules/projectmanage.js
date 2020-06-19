import Layout from '@/layout'

const projectManageRouter = {
  path: '/projectmanage',
  component: Layout,
  // redirect: '/projectmanage/project1',
  name: 'projectmanage',
  meta: {
    title: '项目管理',
    icon: 'list'
  },
  children: [
    // {
    //   path: 'project1',
    //   component: () => import('@/views/corex-projectmanage/index'),
    //   name: 'DynamicTable',
    //   meta: { title: '项目一' }
    // },
    // {
    //   path: 'project2',
    //   component: () => import('@/views/corex-projectmanage/index'),
    //   name: 'DragTable',
    //   meta: { title: '项目二' }
    // }
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
  console.log([projectManageRouter])
  return [projectManageRouter]
}
