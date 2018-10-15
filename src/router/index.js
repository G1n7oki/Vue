import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const Recommend = (resolve) => {
  import ('components/recommend/Recommend').then((module) => {
    resolve(module);
  })
}

const Singer = (resolve) => {
  import ('components/singer/Singer').then((module) => {
    resolve(module);
  })
}

const Rank = (resolve) => {
  import ('components/rank/Rank').then((module) => {
    resolve(module);
  })
}

const Search = (resolve) => {
  import ('components/search/Search').then((module) => {
    resolve(module);
  })
}

const SingerDetail = (resolve) => {
  import ('components/singer-detail/SingerDetail').then((module) => {
    resolve(module);
  })
}

const Disc = (resolve) => {
  import ('components/disc/Disc').then((module) => {
    resolve(module);
  })
}

const TopList = (resolve) => {
  import ('components/top-list/TopList').then((module) => {
    resolve(module);
  })
}

const UserCenter = (resolve) => {
  import ('components/user-center/UserCenter').then((module) => {
    resolve(module);
  })
}


export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      component: Recommend,
      children: [
        {
          path: ':id',
          component: Disc
        }
      ]
    },
    {
      path: '/singer',
      component: Singer,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/rank',
      component: Rank,
      children: [
        {
          path: ':id',
          component: TopList
        }
      ]
    },
    {
      path: '/search',
      component: Search,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/user',
      component: UserCenter
    }
  ]
})
